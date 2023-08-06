// import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { supabase, session } = await parent();

	if (!session) {
		throw redirect(303, '/');
	}

	const {
		data: { user }
	} = await supabase.auth.getUser();

	const { data: profile } = await supabase.from('users').select().limit(1).single();
	const { data: subscription } = await supabase.from('subscriptions').select().limit(1).single();

	if (!profile || !user) {
		throw redirect(303, '/login');
	}

	const isSubscribed =
		subscription.stripe_id && subscription.status === 'active' && subscription.price_id;

	const isCanceled =
		subscription.stripe_id && subscription.status === 'canceled' && subscription.price_id;

	const account = {
		email: user?.email,
		name: profile.name,
		isSubscribed,
		isCanceled
	};

	return {
		account
	};
};
