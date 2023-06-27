<script>
	import RoundLink from './roundLink.svelte';
</script>

<section class="py-10 sm:py-16 lg:py-24">
	<div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
		<div class="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
			<div>
				<p class="text-base font-semibold tracking-wider text-blue-600 uppercase">
					A social media for learners
				</p>
				<h1 class="mt-4 text-4xl font-bold text-black lg:mt-8 sm:text-6xl xl:text-8xl">
					Connect & learn from the experts
				</h1>
				<p class="mt-4 text-base text-black lg:mt-8 sm:text-xl">
					Grow your career fast with right mentor.
				</p>

				<div class="mt-8">
					<RoundLink name="Join for free" link="/login" />
				</div>
			</div>

			<div>
				<img
					class="w-full"
					src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/1/hero-img.png"
					alt=""
				/>
			</div>
		</div>
	</div>
</section>
