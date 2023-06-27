<script lang="ts">
	import Button from '../../../components/button.svelte';

	export let data;
	$: ({ user } = data);

	const handleLogout = async () => {
		const { error } = await data.supabase.auth.signOut();
	};
</script>

<pre>{JSON.stringify(user)}</pre>
<Button name="Logout" action={handleLogout} />
