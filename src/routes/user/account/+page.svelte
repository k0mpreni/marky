<script lang="ts">
	import Button from '$lib/components/button.svelte';

	export let data;
	$: ({ user } = data);

	const handleLogout = async () => {
		const { error } = await data.supabase.auth.signOut();
	};
</script>

<svelte:head>
	<title>Account</title>
</svelte:head>
<section class="p y-10 sm:py-16 lg:py-24">
	<div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
		<div class="max-w-2xl mx-auto text-center flex flex-col items-center">
			<h2 class="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Account</h2>
			<p class="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">
				Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
				consequat duis.
			</p>
			{JSON.stringify(user)}
			<Button name="Logout" action={handleLogout} />
		</div>
	</div>
</section>
