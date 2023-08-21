<script lang="ts">
	import Faq from '$lib/components/faq.svelte';
	import Hero from '$lib/components/hero.svelte';
	import Howto from '$lib/components/howto.svelte';
	import Testimonials from '$lib/components/testimonials.svelte';
	export let data;

	let { session } = data;
	$: ({ session } = data);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Hero isLoggedIn={!!session?.user.email} />
<Howto />
<Faq />
<Testimonials />
