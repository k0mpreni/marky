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
</script>

<header class="bg-opacity-30">
	<Navbar let:hidden let:toggle color="none">
		<NavBrand href="/">
			<img class="w-auto h-8" src="https://placehold.co/160x32" alt="" />
		</NavBrand>
		<NavUl
			{hidden}
			class="order-1"
			ulClass="flex flex-col p-4 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-md md:font-medium items-center"
		>
			{#if isLoggedIn}
				<NavLi href="/app" active={$page.url.pathname === '/app'}>App</NavLi>
			{/if}
			<NavLi
				href="/pricing"
				data-sveltekit-preload-data="hover"
				active={$page.url.pathname === '/pricing'}>Pricing</NavLi
			>
			<GradientButton
				size="md"
				shadow
				href={isLoggedIn ? '/user/account' : '/login'}
				color="purpleToBlue"
				data-sveltekit-preload-data="hover">{isLoggedIn ? 'Account' : 'Sign in'}</GradientButton
			>
			<div class="ml-2">
				<DarkMode />
			</div>
			<NavHamburger on:click={toggle} />
		</NavUl>
	</Navbar>
</header>
