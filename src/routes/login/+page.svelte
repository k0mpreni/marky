<script lang="ts">
	import { APP_NAME } from '$lib/utils/consts';
	import { Button, Input, Label, P } from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';

	export let data;
	async function signInWithGoogle() {
		const response = await data.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: '/pricing' }
		});
	}
	async function signInWithGithub() {
		const response = await data.supabase.auth.signInWithOAuth({
			provider: 'github'
		});
	}
	async function signInWithDiscord() {
		const response = await data.supabase.auth.signInWithOAuth({
			provider: 'discord'
		});
	}
	// async function signInWithApple() {
	// 	const response = await data.supabase.auth.signInWithOAuth({
	// 		provider: 'apple'
	// 	});
	// }
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<section>
	<div class="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 sm:py-16 lg:py-24">
		<div class="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto flex flex-col items-center">
			<P align="center" class="text-3xl font-bold leading-tight sm:text-4xl mb-12">
				Sign in to {APP_NAME}
			</P>

			<!-- <form method="POST" action="?/signInMagicEmail" class="mb-10"> -->
			<!-- 	<Label for="email" class="block mb-2" -->
			<!-- 		><span class="block mb-2">Your Email</span> -->
			<!-- 		<Input -->
			<!-- 			required -->
			<!-- 			id="email" -->
			<!-- 			size="lg" -->
			<!-- 			name="email" -->
			<!-- 			type="email" -->
			<!-- 			placeholder="name@email.com" -->
			<!-- 		> -->
			<!-- 			<Icon -->
			<!-- 				name="envelope-outline" -->
			<!-- 				slot="left" -->
			<!-- 				class="w-5 h-5 text-gray-500 dark:text-gray-400" -->
			<!-- 			/> -->
			<!-- 		</Input> -->
			<!-- 	</Label> -->
			<!-- 	<P class="text-gray-500 dark:text-gray-400 mb-2">We will send you an email to sign in</P> -->
			<!-- 	<Button type="submit">Submit</Button> -->
			<!-- </form> -->
			<div class="mt-3 space-y-3 w-80">
				<button
					on:click={signInWithGoogle}
					type="button"
					class="relative inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-gray-700 transition-all duration-200 bg-white border-2 border-gray-200 rounded-md hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black focus:outline-none"
				>
					<div class="absolute inset-y-0 left-0 p-4">
						<Icon name="google-solid" />
					</div>
					Sign in with Google
				</button>
				<button
					on:click={signInWithDiscord}
					type="button"
					class="relative inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-gray-700 transition-all duration-200 bg-white border-2 border-gray-200 rounded-md hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black focus:outline-none"
				>
					<div class="absolute inset-y-0 left-0 p-4">
						<Icon name="discord-solid" />
					</div>
					Sign in with Discord
				</button>
				<!-- <button -->
				<!-- 	on:click={signInWithGithub} -->
				<!-- 	type="button" -->
				<!-- 	class="relative inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-gray-700 transition-all duration-200 bg-white border-2 border-gray-200 rounded-md hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black focus:outline-none" -->
				<!-- > -->
				<!-- 	<div class="absolute inset-y-0 left-0 p-4"> -->
				<!-- 		<Icon name="apple-solid" /> -->
				<!-- 	</div> -->
				<!-- 	Sign in with Apple -->
				<!-- </button> -->

				<button
					on:click={signInWithGithub}
					type="button"
					class="relative inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-gray-700 transition-all duration-200 bg-white border-2 border-gray-200 rounded-md hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black focus:outline-none"
				>
					<div class="absolute inset-y-0 left-0 p-4">
						<Icon name="github-solid" />
					</div>
					Sign in with Github
				</button>
			</div>
		</div>
	</div>
</section>
