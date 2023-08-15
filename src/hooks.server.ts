import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { stripe } from '$lib/server/stripe';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	/**
	 * a little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	if (event.url.pathname.startsWith('/app')) {
		if (!(await event.locals.getSession())) throw redirect(303, '/login');
		const { data: supRes } = await event.locals.supabase
			.from('subscriptions')
			.select('stripe_id')
			.single();
		const subscription = await stripe.subscriptions.retrieve(supRes?.stripe_id as string);
		if (subscription.status !== 'active') {
			throw redirect(303, '/pricing');
		}
	}

	if (event.url.pathname.startsWith('/dashboard')) {
		if (!(await event.locals.getSession())) throw redirect(303, '/');
		const { data: supRes, error } = await event.locals.supabase
			.from('users')
			.select('role')
			.single();

		console.log(error);
		if (supRes.role !== 1) {
			throw redirect(303, '/');
		}
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
