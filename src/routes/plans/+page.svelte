<script lang="ts">
	import Plan from '$lib/components/plan.svelte';

	export let data;
	$: plans = data.plans;
</script>

<svelte:head>
	<title>Plans</title>
</svelte:head>
<section class="bg-gray-50 p y-10 sm:py-16 lg:py-24">
	<div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
		<div class="max-w-2xl mx-auto text-center">
			<h2 class="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
				Pricing & Plans
			</h2>
			<p class="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">
				Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
				consequat duis.
			</p>
		</div>
		<div class="grid max-w-3xl grid-cols-1 gap-6 mx-auto mt-8 sm:mt-16 sm:grid-cols-2">
			{#each plans as plan, index}
				<Plan {plan} principal={index === 1} />
			{/each}
		</div>
	</div>
</section>
