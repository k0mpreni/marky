import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { stripe } from '$lib/server/stripe';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { supabase, getSession } = locals;

	if (!getSession()) {
		throw redirect(303, '/');
	}

	const {
		data: { user }
	} = await supabase.auth.getUser();

	const { data: profile } = await supabase.from('users').select().limit(1).single();
	const { data: organization } = await supabase.from('organizations').select().limit(1).single();

	if (!profile || !user) {
		throw redirect(303, '/login');
	}

	const editUrl = async () => {
		const { url: portalUrl } = await stripe.billingPortal.sessions.create({
			customer: organization.customer_id,
			return_url: `${url.origin}/user/account`
		});
		return portalUrl;
	};

	const { data: subscription } = await supabase.from('subscriptions').select().limit(1).single();

	const isSubscribed = subscription?.id && subscription?.status === 'active' && subscription?.id;

	const isCanceled = subscription?.id && subscription?.status === 'canceled' && subscription?.id;

	return {
		email: user?.email,
		name: profile.name,
		infos: {
			isSubscribed,
			isCanceled
		},
		editUrl: editUrl()
	};
};
