<script lang="ts">
	import Button from '../button/button.svelte';

	export let icon: string | undefined;
	export let name: string;
	export let id: string;
</script>

<li>
	<Button
		class="h-14 w-14 rounded-xl text-zinc-500 overflow-hidden"
		href={`/hudori/chat/community/${id.split(':')[1]}`}
		size="icon"
	>
		{#if icon}
			<img class="aspect-square object-cover" src={icon} alt={name.slice(0, 2).toUpperCase()} />
		{:else}
			{name.slice(0, 2).toUpperCase()}
		{/if}
	</Button>
</li>
