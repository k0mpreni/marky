<script>
	import { browser } from '$app/environment';
	import { preloadData } from '$app/navigation';
	import {
		DarkMode,
		GradientButton,
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger
	} from 'flowbite-svelte';
	import { page } from '$app/stores';

	export let isLoggedIn = false;
	$: if (browser) {
		preloadData('/pricing');
	}
	$: activeUrl = $page.url.pathname;
</script>

<header class="bg-opacity-300">
	<Navbar let:hidden let:toggle color="gray" navClass="bg-gray-100 dark:bg-gray-800 p-4">
		<NavBrand href="/">
			<img class="w-auto h-8" src="https://placehold.co/160x32" alt="" />
		</NavBrand>

		<NavUl {hidden} {activeUrl} class="order-1">
			{#if isLoggedIn}
				<GradientButton
					size="md"
					shadow
					href="/app"
					color="purpleToBlue"
					data-sveltekit-preload-data="hover">App</GradientButton
				>
			{/if}
			<NavLi href="/pricing" data-sveltekit-preload-data="hover">Pricing</NavLi>
		</NavUl>
		<div class="flex md:order-2">
			<GradientButton
				size="md"
				shadow={!isLoggedIn}
				outline={isLoggedIn}
				href={isLoggedIn ? '/user/account' : '/login'}
				color="purpleToBlue"
				data-sveltekit-preload-data="hover">{isLoggedIn ? 'Account' : 'Sign in'}</GradientButton
			>
			<NavHamburger on:click={toggle} />
			<div class="ml-2">
				<DarkMode />
			</div>
		</div>
	</Navbar>
</header>
