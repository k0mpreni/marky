<script lang="ts">
	import { goto } from '$app/navigation';
	import { A, Button, P, Span } from 'flowbite-svelte';

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
			<P align="center" class="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl"
				>Account</P
			>
			<div class="my-5">
				<P align="center" class="my-2">
					Email: {data.email}
				</P>
				<div class="my-2">
					{#if data.infos.isCanceled}
						<Span>Subscription canceled, ends on {data.infos.canceledDate}</Span>
					{:else if data.infos.isSubscribed}
						<Span>Subscribed</Span>
					{:else}
						<span>Not subscription yet</span>
					{/if}
					{#if data.editUrl}
						<A href={data.editUrl}>Edit subscription</A>
					{/if}
				</div>
			</div>
			<Button on:click={handleLogout} outline color="dark">Logout</Button>
		</div>
	</div>
</section>
