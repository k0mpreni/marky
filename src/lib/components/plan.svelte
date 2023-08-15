<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { TPlan } from '$lib/types/plans';
	import { Button, GradientButton, Spinner } from 'flowbite-svelte';

	export let plan: TPlan;
	export let principal = false;
	export let noCard = false;
	export let current = false;
	export let canceled = false;
	export let cancel_end: number | null = null;

	let loading = false;

	const handleSubmit: SubmitFunction = () => {
		loading = true;

		return async ({ update, result }) => {
			await update();
			if (result.type !== 'redirect') {
				loading = false;
			}
		};
	};
</script>

<div class={`bg-white border-4 ${principal ? 'border-blue-600' : 'border-transparent'} rounded-md`}>
	<form
		method="POST"
		action={current && !canceled && !cancel_end ? '?/cancelPlan' : '?/choosePlan'}
		use:enhance={handleSubmit}
	>
		<input class="hidden" type="hidden" name="planId" value={plan.id} />
		<div class="p-6 md:py-10 md:px-9">
			<div
				class={`inline-block px-4 py-2 ${principal ? 'bg-blue-100' : 'bg-gray-100'} rounded-full`}
			>
				<h3 class="text-sm font-semibold text-gray-900">{plan.name}</h3>
			</div>
			<p class={`mt-5 text-5xl font-bold  ${principal ? 'text-blue-600' : 'text-black'}`}>
				${plan.unit_amount / 100}
			</p>
			<p class="mt-2 text-base text-gray-600">Per month</p>

			<ul class="flex flex-col my-8 space-y-4">
				<li class="inline-flex items-center space-x-2">
					<svg
						class="flex-shrink-0 w-5 h-5 text-green-500"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="text-base font-medium text-gray-900"> 1 Domain License </span>
					<svg
						class="w-4 h-4 ml-0.5 text-gray-500"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</li>

				<li class="inline-flex items-center space-x-2">
					<svg
						class="flex-shrink-0 w-5 h-5 text-green-500"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="text-base font-medium text-gray-400"> Premium Support </span>
				</li>
			</ul>

			<GradientButton
				outline={!principal}
				color={principal ? 'purpleToBlue' : 'blue'}
				shadow={principal}
				class="w-full"
				type="submit"
				size="lg"
			>
				{#if loading}
					<Spinner class="mr-3" size="6" />
				{:else if current && cancel_end}
					Resubscribe
				{:else if current && !canceled}
					Cancel
				{:else}
					Get this plan
				{/if}
			</GradientButton>
			{#if noCard}
				<p class="mt-5 text-sm text-gray-500">No Credit Card Required</p>
			{/if}
		</div>
	</form>
</div>
