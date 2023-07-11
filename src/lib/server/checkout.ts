import { stripe } from './stripe';
import { supabaseAdmin } from './supabase-admin';

export const handleCheckoutCompleted = async (checkout) => {
	const userId = checkout.metadata.userId;

	const subscriptionId = checkout.subscription;
	const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
	try {
		const { error } = await supabaseAdmin
			.from('profiles')
			.update({
				stripe_subscription_id: subscription.id,
				stripe_subscription_status: subscription.status
			})
			.eq('user_id', userId);

		console.log(error);
	} catch (e) {
		console.error('ERR: Updating user', e);
	}
};
