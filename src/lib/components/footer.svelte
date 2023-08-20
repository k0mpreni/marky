<script>
	import { APP_NAME } from '$lib/utils/consts';
	import { Footer, FooterCopyright, FooterLink, FooterLinkGroup } from 'flowbite-svelte';

	const currentYear = new Date().getFullYear();
</script>

<Footer class="sticky top-[100vh] bg-transparent">
	<FooterCopyright href="/" by={APP_NAME} year={currentYear} />
	<FooterLinkGroup
		ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0"
	>
		<FooterLink href="/">Contact</FooterLink>
		<FooterLink href="/terms">Terms and Conditions</FooterLink>
		<FooterLink target="_blank" rel="noopener noreferer" href="https://twitter.com/k0mpreni"
			>Twitter</FooterLink
		>
	</FooterLinkGroup>
</Footer>
