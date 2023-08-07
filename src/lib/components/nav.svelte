<script>
	import { browser } from '$app/environment';
	import { preloadData } from '$app/navigation';
	import RoundLink from './roundLink.svelte';
	export let isLoggedIn = false;
	$: if (browser) {
		preloadData('/pricing');
	}
</script>

<header class="bg-opacity-30">
	<div class="px-4 mx-auto sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16 lg:h-20">
			<div class="flex-shrink-0">
				<a href="/" title="Home" class="flex">
					<img class="w-auto h-8" src="https://placehold.co/160x32" alt="" />
				</a>
			</div>

			<button
				type="button"
				class="inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100"
			>
				<!-- Menu open: "hidden", Menu closed: "block" -->
				<svg
					class="block w-6 h-6"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 8h16M4 16h16"
					/>
				</svg>

				<!-- Menu open: "block", Menu closed: "hidden" -->
				<svg
					class="hidden w-6 h-6"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<div class="hidden lg:flex lg:items-center lg:justify-center lg:space-x-10">
				{#if isLoggedIn}
					<a
						href="/app"
						title=""
						class="text-base text-black transition-all duration-200 hover:text-opacity-80"
						data-sveltekit-preload-data
					>
						App
					</a>
				{/if}
				<a
					href="/pricing"
					title=""
					class="text-base text-black transition-all duration-200 hover:text-opacity-80"
					data-sveltekit-preload-data
				>
					Pricing
				</a>
				{#if isLoggedIn}
					<RoundLink name="Account" link="/user/account" />
				{:else}
					<RoundLink name="Join now" link="/login" />
				{/if}
			</div>
		</div>
	</div>
</header>
