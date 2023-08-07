<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/button.svelte';
	import Link from '$lib/components/link.svelte';

	export let data;

	const handleLogout = async () => {
		const { error } = await data.supabase.auth.signOut();
		if (!error) {
			await goto('/', { invalidateAll: true, replaceState: true });
		}
	};
</script>

<svelte:head>
	<title>Account</title>
</svelte:head>
<section class="p y-10 sm:py-16 lg:py-24">
	<div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
		<div class="max-w-2xl mx-auto text-center flex flex-col items-center">
			<h2 class="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Account</h2>
			<div class="my-5">
				<p class="my-2">
					Email: {data.email}
				</p>
				{#if data.infos.isSubscribed}
					{#await data.editUrl}
						<p class="my-2">Loading</p>
					{:then}
						<p class="my-2">
							Subscribed: <Link link={data.editUrl} title="Edit" />
						</p>
					{/await}
				{:else if data.infos.isCanceled}
					<p class="my-2">Subscription canceled</p>
				{:else}
					<p class="my-2">Not subscription yet</p>
				{/if}
			</div>
			<Button name="Logout" action={handleLogout} />
		</div>
	</div>
</section>
