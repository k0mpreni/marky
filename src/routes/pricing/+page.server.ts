import { stripe } from '$lib/server/stripe';
import type { TPlan } from '$lib/types/plans.js';
import { redirect, type Actions, type Load } from '@sveltejs/kit';

type TUserSubscription = {
    status: string;
    cancel_end: number | null;
    canceled: boolean;
};

export const load: Load = async ({ params, locals }) => {
    const priceRes = await stripe.prices.list();
    const { data, error } = await locals.supabase
        .from('profiles')
        .select('stripe_subscription_id,stripe_plan_id, stripe_subscription_status');
    const subscriptionId = data && data[0]?.stripe_subscription_id;
    const planId = data && data[0]?.stripe_plan_id;
    let userSubscription: TUserSubscription = {
        status: '',
        cancel_end: null,
        canceled: false
    };
    if (subscriptionId) {
        try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
            userSubscription = {
                status: subscription.status,
                cancel_end: subscription.cancel_at,
                canceled: subscription.status === 'canceled'
            };
        } catch (e) {
            console.error(e);
        }
    }
    const plans = priceRes.data
        .map((el): TPlan => {
            const isYearly = el.recurring?.interval === 'year';
            return {
                id: el.id,
                unit_amount: el.unit_amount || 0,
                name: el.nickname || '',
                yearly: isYearly,
                current: planId === el.id && userSubscription.status === 'active',
                cancel_end: userSubscription.cancel_end,
                canceled: userSubscription.canceled
            };
        })
        .sort((a, b) => (a?.unit_amount < b?.unit_amount ? -1 : 0));

    return {
        plans
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
        const { data } = await locals.supabase.from('profiles').select().limit(1).single();

        // This should be done in the webhook
        const currentStripeId = data?.stripe_subscription_id;
        const currentStripeStatus = data?.stripe_subscription_status;
        console.log(currentStripeId, currentStripeStatus);
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
    cancelPlan: async ({ request, locals }) => {
        const data = await request.formData();
        const planId = data.get('planId');
        const { data: supRes } = await locals.supabase
            .from('profiles')
            .select('stripe_subscription_id, stripe_subscription_status');
        const subscriptionId = supRes && supRes[0].stripe_subscription_id;
        const subscriptionStatus = supRes && supRes[0].stripe_subscription_status;
        if (subscriptionId && subscriptionStatus === 'active') {
            const subscription = await stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: true
            });
            try {
                const { data: subUpdate } = await locals.supabase
                    .from('profiles')
                    .update({ stripe_subscription_status: subscription.status })
                    .eq('stripe_subscription_id', subscriptionId)
                    .select();
            } catch (error) {
                console.log('Error canceling plan', error);
            }
        }
        return;
    }
};
