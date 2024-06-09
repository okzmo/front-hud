<script lang="ts">
	import { contextMenuInfo, server } from '$lib/stores';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import ServerContextMenu from '$lib/components/server/ServerContextMenu.svelte';
	import ServerCategory from '../ServerCategory.svelte';
	import { generateRandomId, handleContextMenu } from '$lib/utils';

	let openContextMenuId = `context-menu-${generateRandomId()}`;
	let isOpen: boolean = false;

	$: isOpen = $contextMenuInfo?.id === openContextMenuId;
</script>

<ul class="flex flex-col w-full flex-grow">
	<span class="block w-full h-[10rem] rounded-lg bg-zinc-500" />
	{#if $server && $server.categories}
		<div class="mt-4 flex flex-col gap-y-1">
			{#each $server.categories as category}
				<ServerCategory {category} />
			{/each}
		</div>
	{:else}
		<p>no bro</p>
	{/if}
	<ContextMenu.Root>
		<ContextMenu.Trigger
			class="w-full h-full flex-1"
			on:contextmenu={() => handleContextMenu(openContextMenuId)}
		></ContextMenu.Trigger>
		{#if isOpen}
			<ServerContextMenu />
		{/if}
	</ContextMenu.Root>
</ul>
