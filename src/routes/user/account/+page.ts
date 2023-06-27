// import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { supabase, session } = await parent();
	if (!session) {
		throw redirect(303, '/');
	}
	const user = await supabase.auth.getUser();
	// const { data: profile } = await supabase.from('profiles').select().limit(1).single();

	return {
		user
	};
};
