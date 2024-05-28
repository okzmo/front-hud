<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import ChannelContextMenu from './ChannelContextMenu.svelte';
	import { contextMenuInfo } from '$lib/stores';
	import { generateRandomId, handleContextMenu } from '$lib/utils';

	export let href: string = '';
	export let type: string = 'text';
	export let channelName: string = 'Channel';
	export let channelId: string;
	export let categoryName: string;

	let openContextMenuId = `context-menu-${generateRandomId()}`;
	let isOpen: boolean = false;

	$: isOpen = $contextMenuInfo?.id === openContextMenuId;
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger on:contextmenu={() => handleContextMenu(openContextMenuId)}>
		<button
			class="flex gap-x-3 hover:bg-zinc-800/75 py-[0.65rem] text-zinc-500 px-3 rounded-xl transition duration-75 active:scale-[0.97] items-center w-full"
			class:active={$page.url.pathname.includes(href)}
			on:click={() => goto(href)}
		>
			{#if type === 'textual'}
				<Icon icon="ph:chat-teardrop-text-duotone" height="20" width="20" />
			{:else if type === 'voice'}
				<Icon icon="ph:speaker-simple-low-duotone" height="20" width="20" />
			{/if}
			<p class="leading-none">{channelName}</p>
		</button>
	</ContextMenu.Trigger>
	{#if isOpen}
		<ChannelContextMenu {channelId} {categoryName} {channelName} />
	{/if}
</ContextMenu.Root>

<style lang="postcss">
	.active {
		background-color: rgba(39, 39, 42, 0.75);
		color: theme(colors.zinc.50);
	}
</style>
