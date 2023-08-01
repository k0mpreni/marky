<script lang="ts">
	export let link: string;
	export let name: string;
</script>

<a
	href={link}
	title={name}
	class="w-fit flex items-center justify-center px-5 py-2.5 text-base transition-all duration-200 hover:bg-yellow-300 hover:text-black focus:text-black focus:bg-yellow-300 font-semibold text-white bg-black rounded-full"
	role="button"
	data-sveltekit-preload-data
>
	{name}
</a>
