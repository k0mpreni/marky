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

<section class="bg-gradient-to-b from-transparent to-gray-200 h-full">
	<Hero />
</section>
