import { goto } from '$app/navigation';
import { stripe } from '$lib/server/stripe';
import { redirect } from '@sveltejs/kit';

export async function load({ params, locals }) {
    const productsRes = await stripe.products.list();
    const priceRes = await stripe.prices.list();
    const { data, error } = await locals.supabase
        .from('profiles')
        .select('stripe_subscription_id, stripe_subscription_status');
    const subscriptionId = data[0]?.stripe_subscription_id;
    let userSubscription = { active: false, priceId: undefined };
    if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
        console.log('titi', subscription);
        userSubscription = {
            priceId: subscription.plan.id,
            active: subscription.plan.active,
            cancelled: subscription.cancel_at !== null,
            cancel_end: subscription.cancel_at
        };
    }

    const plans = priceRes.data
        .map((el) => {
            const isYearly = el.recurring?.interval === 'year';
            return {
                ...el,
                name: productsRes.data[0].name,
                yearly: isYearly,
                current: userSubscription.priceId === el.id && userSubscription.active
            };
        })
        .sort((a, b) => (a?.unit_amount < b?.unit_amount ? -1 : 0));

    return {
        plans
    };
}
export const actions = {
    choosePlan: async ({ request, url, locals }) => {
        const data = await request.formData();
        const priceId = data.get('priceId');
        const session = await locals.getSession();
        if (!session) {
            throw redirect(303, '/login');
        }

        const res = await stripe.checkout.sessions.create({
            customer_email: session.user.email,
            metadata: {
                userId: session.user.id
            },
            line_items: [
                {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    price: priceId,
                    quantity: 1
                }
            ],
            mode: 'subscription',
            success_url: `${url.origin}/plans/success`,
            cancel_url: `${url.origin}/plans/cancel`
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
    cancelPlan: async ({ request, url, locals }) => {
        const data = await request.formData();
        const priceId = data.get('priceId');
        const { data: supRes, err } = await locals.supabase
            .from('profiles')
            .select('stripe_subscription_id, stripe_subscription_status');
        const subscriptionId = supRes[0].stripe_subscription_id;
        const subscriptionStatus = supRes[0].stripe_subscription_status;
        console.log(subscriptionId, subscriptionStatus);
        if (subscriptionId && subscriptionStatus === 'active') {
            const subscription = await stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: true
            });
        }
    }
};
