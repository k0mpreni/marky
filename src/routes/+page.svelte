<script lang="ts">
	import Hero from '$lib/components/hero.svelte';
	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Hero isLoggedIn={!!session?.user.email} />
