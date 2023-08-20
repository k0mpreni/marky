<script lang="ts">
	import { GradientButton, P } from 'flowbite-svelte';

	export let isLoggedIn: boolean;
</script>

<section class="pt-10 pb-5 sm:py-16 lg:py-6">
	<div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
		<div class="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
			<div>
				<P
					size="lg"
					color="text-blue-600 dark:text-blue-400"
					class="text-base font-semibold tracking-wider uppercase"
				>
					A social media for learners
				</P>
				<P size="8xl" weight="bold" class="leading-none">Connect & learn from the experts</P>
				<P class="mt-2" size="xl">Grow your career fast with right mentor.</P>

				<div class="my-8">
					<GradientButton shadow color="purpleToBlue" href={isLoggedIn ? '/pricing' : '/login'}
						>Join for free</GradientButton
					>
				</div>
			</div>

			<div>
				<img class="w-full" src="https://placehold.co/650x660" alt="" />
			</div>
		</div>
	</div>
</section>
