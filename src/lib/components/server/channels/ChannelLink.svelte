<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import ChannelContextMenu from './ChannelContextMenu.svelte';
	import { contextMenuInfo, updateLastVisited, notifications, user, servers } from '$lib/stores';
	import { generateRandomId, handleContextMenu } from '$lib/utils';
	import { joinRoom } from '$lib/rtc';
	import type { User } from '$lib/types';
	import UserVcNode from './UserVCNode.svelte';

	export let href: string = '';
	export let type: string = 'text';
	export let channelName: string = 'Channel';
	export let channelId: string;
	export let categoryName: string;
	export let participants: User[];

	let openContextMenuId = `context-menu-${generateRandomId()}`;
	let isOpen: boolean = false;
	let notification;

	$: isOpen = $contextMenuInfo?.id === openContextMenuId;
	$: if ($servers[`servers:${$page.params.serverId}`] && $page.params.channelId) {
		updateLastVisited(`servers:${$page.params.serverId}`, $page.params.channelId);
	}
	$: notification = $notifications?.filter(
		(notification) => notification.channel_id === channelId
	)[0];
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger on:contextmenu={() => handleContextMenu(openContextMenuId)}>
		<div class="flex flex-col">
			<button
				class="gradient-border relative flex gap-x-3 hover:bg-zinc-500/15 py-[0.55rem] text-zinc-500 px-3 rounded-[0.8rem] transition duration-75 active:scale-[0.97] items-center w-full"
				class:active={$page.url.pathname.includes(href)}
				class:notify={notification && !notification.read}
				class:mentioned={notification &&
					!notification.read &&
					notification.mentions &&
					notification.mentions.includes($user?.id)}
				on:click={() => {
					if (type === 'textual') {
						goto(href);
					} else {
						joinRoom(channelId, $user?.id, `servers:${$page.params.serverId}`);
					}
				}}
			>
				{#if type === 'textual'}
					<Icon
						icon="solar:chat-round-line-bold-duotone"
						class="pointer-events-none"
						height="18"
						width="18"
					/>
				{:else if type === 'voice'}
					<Icon
						icon="solar:volume-loud-bold-duotone"
						class="pointer-events-none"
						height="18"
						width="18"
					/>
				{/if}
				<p class="leading-none pointer-events-none">{channelName}</p>
			</button>
			{#if participants}
				{#each participants as participant}
					<UserVcNode connected_user={participant} />
				{/each}
			{/if}
		</div>
	</ContextMenu.Trigger>
	{#if isOpen}
		<ChannelContextMenu {channelId} {categoryName} {channelName} />
	{/if}
</ContextMenu.Root>

<style lang="postcss">
	.active {
		background-color: theme(colors.zinc.50015);
		color: theme(colors.zinc.50);
	}

	:global(.active.gradient-border::before) {
		opacity: 1;
	}

	.notify {
		color: theme(colors.zinc.50);
	}

	.mentioned {
		color: theme(colors.zinc.50);
		background-color: rgba(223, 67, 67, 0.25);
	}

	:global(.gradient-border::before) {
		content: '';
		position: absolute;
		opacity: 0;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		border-radius: inherit;
		padding: 1px; /* This determines the border thickness */
		background: linear-gradient(to bottom, rgba(113, 113, 122, 0.3) 0%, rgba(113, 113, 122, 0) 35%);
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		transition: opacity 100ms ease-out;
	}
</style>
