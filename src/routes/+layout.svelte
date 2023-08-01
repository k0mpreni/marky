<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Nav from '$lib/components/nav.svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<div class="bg-gradient-to-b from-transparent to-gray-200 flex flex-col min-h-screen">
	<Nav isLoggedIn={!!session} />
	<slot />
</div>
