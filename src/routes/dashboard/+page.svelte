<script lang="ts">
	import {
		Button,
		Modal,
		P,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	export let data;
	$: members = data.organization.members;
	let popupModal = false;
	let selectedUser;

	const handleClick = (id) => {
		selectedUser = members.find((el) => el.id === id);
		popupModal = true;
	};

	const handleRemoveUser = () => {
		console.log('delete user with ID', selectedUser.id);
	};
</script>

<pre>{selectedUser?.email}</pre>
<div class="mx-10">
	<Table shadow>
		<caption class="my-4 ml-4">
			<P>Organization {data.organization.name ?? ''}</P>
		</caption>
		<TableHead>
			<TableHeadCell>Email</TableHeadCell>
			<TableHeadCell>Role</TableHeadCell>
			<TableHeadCell>
				<span class="sr-only">Edit</span>
			</TableHeadCell>
		</TableHead>
		<TableBody class="divide-y">
			{#each members as member}
				<TableBodyRow>
					<TableBodyCell>{member.email}</TableBodyCell>
					<TableBodyCell>{member.role} {member.id}</TableBodyCell>
					<TableBodyCell tdClass="px-6 py-4 whitespace-nowrap font-medium flex justify-end"
						><Button outline color="green" on:click={() => handleClick(member.id)}>Edit</Button
						></TableBodyCell
					>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
<Modal bind:open={popupModal} size="xs" autoclose>
	<div class="text-center">
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			{selectedUser.email}
		</h3>
		<Button color="red" class="mr-2" on:click={handleRemoveUser}>Remove</Button>
		<Button color="alternative">No, cancel</Button>
	</div>
</Modal>
