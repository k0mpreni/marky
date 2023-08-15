<script lang="ts">
	import { goto } from '$app/navigation';
	import Link from '$lib/components/link.svelte';
	import { Button } from 'flowbite-svelte';

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
				<div class="my-2">
					{#if data.infos.isCanceled}
						<span>Subscription canceled, ends on {data.infos.canceledDate}</span>
					{:else if data.infos.isSubscribed}
						{#await data.editUrl}
							<span>Loading</span>
						{:then}
							<span>Subscribed:</span>
						{/await}
					{:else}
						<span>Not subscription yet</span>
					{/if}
					<div>
						{#if data.editUrl}
							<Link link={data.editUrl} title="Edit subscription" />
						{/if}
					</div>
				</div>
			</div>
			<Button on:click={handleLogout} outline color="dark">Logout</Button>
		</div>
	</div>
</section>
