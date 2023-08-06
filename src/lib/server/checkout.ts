import { stripe } from './stripe';
import { supabaseAdmin } from './supabase-admin';

export const handleCheckoutCompleted = async (checkout) => {
	const userId = checkout.metadata.userId;

	const subscriptionId = checkout.subscription;

	try {
		const { data: profile, error } = await supabaseAdmin
			.from('users')
			.select('organization_id')
			.eq('user_id', userId)
			.limit(1)
			.single();

		if (!profile || error) {
			console.error('error checkout getting profile', error);
		}

		const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);

		const { data, error: errorSub } = await supabaseAdmin
			.from('subscriptions')
			.insert({
				price_id: subscription.plan.id,
				stripe_id: subscription.id,
				status: subscription.status,
				period_end: subscription.cancel_at_period_end || null
			})
			.select()
			.single();

		if (errorSub) {
			throw new Error('sub' + errorSub.message);
		}

		const { error: errorOrga } = await supabaseAdmin
			.from('organizations')
			.update({
				subscription_id: data.id,
				customer_id: subscription.customer
			})
			.eq('id', profile.organization_id);

		if (errorOrga) {
			throw new Error('orga' + errorOrga.message);
		}
	} catch (e) {
		console.error('ERR: Updating user', e);
	}
};

export const handleCheckoutUpdated = async (subscription) => {
	try {
		const { error } = await supabaseAdmin
			.from('subscriptions')
			.update({
				status: subscription.status,
				period_end: new Date(subscription.cancel_at * 1000).toISOString() || null
			})
			.eq('stripe_id', subscription.id);
		if (error) {
			throw new Error(error.message);
		}
	} catch (e) {
		console.error('ERR: Updating subscriptions', e);
	}
};
