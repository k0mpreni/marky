<script>
	import RoundLink from '$lib/components/roundLink.svelte';
</script>

<svelte:head>
	<title>Cancel</title>
</svelte:head>
<section class="p y-10 sm:py-16 lg:py-24">
	<div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
		<div class="max-w-2xl mx-auto text-center flex flex-col items-center">
			<h2 class="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Account</h2>
			<p class="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">
				Cancelled, feel free to check our plans again!
			</p>
			<RoundLink name="Our plans" link="/plans" />
		</div>
	</div>
</section>
