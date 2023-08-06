<script lang="ts">
	import Plan from '$lib/components/plan.svelte';
	import Switch from '$lib/components/switch.svelte';

	export let data;
	let yearly = false;
</script>

<svelte:head>
	<title>Plans</title>
</svelte:head>
<section class="p y-10 sm:py-16 lg:py-24">
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
		<!-- <Switch handleClick={() => (yearly = !yearly)} checked={yearly} /> -->
		<div class="flex flex-wrap justify-center gap-6 mx-auto mt-8 sm:mt-16 sm:grid-cols-2">
			{#each data.plans as plan, index}
				<Plan
					{plan}
					cancel_end={data.userPlan.cancel_end}
					canceled={data.userPlan.canceled}
					current={data.userPlan.planId === plan.id}
					principal={index === 1}
				/>
			{/each}
		</div>
	</div>
</section>
