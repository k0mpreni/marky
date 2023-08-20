import { redirect, type Actions, fail } from '@sveltejs/kit';

export async function load({ parent }) {
	const { session } = await parent();
	if (session) {
		throw redirect(303, '/user/account');
	}
}

export const actions: Actions = {
	//
	// The email rate limit is pretty small with supabase, a custom SMTP needs to be setup
	//
	// signInMagicEmail: async ({ url, request, locals }) => {
	// 	const data = await request.formData();
	// 	const email = data.get('email') as string;
	// 	if (!email) {
	// 		return fail(400, { email, missing: true });
	// 	}
	//
	// 	const response = await locals.supabase.auth.signInWithOtp({
	// 		email,
	// 		options: {
	// 			emailRedirectTo: url.origin
	// 		}
	// 	});
	// }
};
