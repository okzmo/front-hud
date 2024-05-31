<script lang="ts">
	import { contextMenuInfo, getCategoryState, server, updateCategoryState } from '$lib/stores';
	import type { Category } from '$lib/types';
	import Icon from '@iconify/svelte';
	import Button from '../ui/button/button.svelte';
	import ChannelLink from './channels/ChannelLink.svelte';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { generateRandomId, handleContextMenu } from '$lib/utils';
	import ChannelCategoryContextMenu from './channels/ChannelCategoryContextMenu.svelte';

	export let category: Category;
	let openContextMenuId = `context-menu-${generateRandomId()}`;
	let contextMenuOpen: boolean = false;

	$: contextMenuOpen = $contextMenuInfo?.id === openContextMenuId;

	let isOpen: boolean;
	$: if ($server) {
		isOpen = getCategoryState($server?.id, category.name);
	}

	function toggleCategory() {
		isOpen = !isOpen;
		if ($server) {
			updateCategoryState($server.id, category.name, isOpen);
		}
	}
</script>

<ContextMenu.Root>
	<li class="first:mt-0 mt-3">
		<ContextMenu.Trigger on:contextmenu={() => handleContextMenu(openContextMenuId)}>
			<Button
				variant="ghost"
				class="p-0 text-zinc-500 w-full justify-start hover:bg-transparent hover:text-zinc-400 uppercase text-[0.68rem] leading-4"
				on:click={() => toggleCategory()}
			>
				<Icon
					icon="material-symbols:keyboard-arrow-down-rounded"
					class={`mr-1 ${!isOpen ? '-rotate-90' : ''}`}
				/>
				{category.name}
			</Button>
		</ContextMenu.Trigger>
		{#if isOpen}
			<div class="flex flex-col mt-1 gap-y-1">
				{#each category.channels as channel}
					<ChannelLink
						categoryName={category.name}
						channelId={channel.id}
						channelName={channel.name}
						type={channel.type}
						href={`/hudori/chat/community/${$server?.id.split(':')[1]}/channels/${channel.id.split(':')[1]}`}
					/>
				{/each}
			</div>
		{/if}
	</li>

	{#if contextMenuOpen}
		<ChannelCategoryContextMenu categoryName={category.name} />
	{/if}
</ContextMenu.Root>
