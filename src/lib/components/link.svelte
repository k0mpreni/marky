<script lang="ts">
	export let link: string;
	export let title: string;
</script>

<a
	href={link}
	{title}
	class="text-base text-black transition-all duration-200 hover:text-opacity-80"
>
	{title}
</a>
