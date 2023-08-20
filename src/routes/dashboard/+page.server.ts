import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { supabase, getSession } = locals;

	if (!getSession()) {
		throw redirect(303, '/');
	}

	const { data: organization } = await supabase.from('organizations').select().limit(1).single();

	return {
		organization: {
			members: [
				{ id: 1, email: 'tutu@toto.com', role: 'user' },
				{ id: 2, email: 'titi@toto.com', role: 'admin' },
				{ id: 3, email: 'marc@toto.com', role: 'user' },
				{ id: 4, email: 'aurele@toto.com', role: 'user' }
			]
		}
	};
};
