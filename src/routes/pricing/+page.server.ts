import { stripe } from '$lib/server/stripe';
import type { TPlan } from '$lib/types/plans';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

type TUserSubscription = {
	planId: string | null;
	status: string;
	cancel_end: number | null;
	canceled: boolean;
};

export const load: PageServerLoad = async ({ locals }) => {
	const getPrices = async () => {
		const res = await stripe.prices.list();
		const plans: TPlan[] = res.data
			.map((el) => ({
				unit_amount: el.unit_amount || 0,
				id: el.id,
				name: el.nickname || '',
				yearly: false
			}))
			.sort((a, b) => (a?.unit_amount < b?.unit_amount ? -1 : 0));

		return plans;
	};
	const getUserPlan = async () => {
		let userSubscription: TUserSubscription = {
			planId: null,
			status: '',
			cancel_end: null,
			canceled: false
		};

		const { data, error } = await locals.supabase
			.from('subscriptions')
			.select('price_id, stripe_id, status, period_end');

		if (error) {
			throw new Error(error.message);
		}

		const subscriptionId = data && data[0]?.stripe_id;

		if (!subscriptionId) return userSubscription;

		const planId = data && data[0]?.price_id;

		if (subscriptionId) {
			try {
				const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
				userSubscription = {
					planId,
					status: subscription.status,
					cancel_end: subscription.cancel_at,
					canceled: subscription.status === 'canceled'
				};
			} catch (e) {
				console.error(e);
			}
		}
		return userSubscription;
	};
	return {
		plans: getPrices(),
		userPlan: getUserPlan()
	};
};
export const actions: Actions = {
	choosePlan: async ({ request, url, locals }) => {
		const formData = await request.formData();
		const planId = (formData.get('planId') as string) || undefined;
		const session = await locals.getSession();
		if (!session) {
			throw redirect(303, '/login');
		}
		const { data } = await locals.supabase.from('users').select().limit(1).single();

		// This should be done in the webhook
		const currentStripeId = data?.stripe_subscription_id;
		const currentStripeStatus = data?.stripe_subscription_status;
		if (currentStripeId && currentStripeStatus === 'active') {
			try {
				const subscription = await stripe.subscriptions.cancel(currentStripeId, {
					// end immediatly to change plan
				});
				if (subscription.status !== 'canceled') {
					throw new Error('cancel current plan failed');
				}
			} catch (e) {
				console.error('Error occured: cancel current plan failed', e);
			}
		}

		const res = await stripe.checkout.sessions.create({
			customer_email: session.user.email,
			metadata: {
				userId: session.user.id
			},
			line_items: [
				{
					// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
					price: planId,
					quantity: 1
				}
			],
			mode: 'subscription',
			success_url: `${url.origin}/pricing/success`,
			cancel_url: `${url.origin}/pricing`
			// Uncomment to add a free trial without card required
			// subscription_data: {
			// 	trial_settings: {
			// 		end_behavior: {
			// 			missing_payment_method: 'cancel'
			// 		}
			// 	},
			// 	trial_period_days: 30
			// },
			// payment_method_collection: 'if_required'
		});
		if (res.url) {
			throw redirect(303, res.url);
		}
	},
	cancelPlan: async ({ locals }) => {
		const { data: supRes } = await locals.supabase
			.from('subscriptions')
			.select('stripe_id, status');
		const subscriptionId = supRes && supRes[0].stripe_id;
		const subscriptionStatus = supRes && supRes[0].status;
		if (subscriptionId && subscriptionStatus === 'active') {
			const subscription = await stripe.subscriptions.update(subscriptionId, {
				cancel_at_period_end: true
			});
			try {
				await locals.supabase
					.from('users')
					.update({ status: subscription.status })
					.eq('stripe_id', subscriptionId);
			} catch (error) {
				console.error('Error canceling plan', error);
			}
		}
		return;
	}
};
