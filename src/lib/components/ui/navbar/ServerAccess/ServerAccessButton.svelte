<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import ServerAccessContextMenu from './ServerAccessContextMenu.svelte';
	import { contextMenuInfo, notifications, serversStateStore } from '$lib/stores';
	import { generateRandomId, handleContextMenu } from '$lib/utils';
	import { user } from '$lib/stores';
	import { page } from '$app/stores';

	export let icon: string | undefined;
	export let name: string;
	export let id: string;
	export let roles: string[] | undefined;

	let openContextMenuId = `context-menu-${generateRandomId()}`;
	let isOpen: boolean = false;
	let href = `/hudori/chat/space/${id.split(':')[1]}`;
	let serverNotif = false;
	let mentioned = false;
	let inviteId = '';

	$: isOpen = $contextMenuInfo?.id === openContextMenuId;
	$: if ($serversStateStore[id]) {
		href = `/hudori/chat/space/${id.split(':')[1]}/channels/${$serversStateStore[id].lastVisited}`;
	}

	$: if ($notifications) {
		serverNotif = $notifications.some(
			(notif) => notif.server_id && notif.server_id === id && !notif.read
		);
		mentioned = $notifications.some(
			(notif) => serverNotif && notif.mentions?.includes($user?.id) && !notif.read
		);
	}
</script>

<li>
	<ContextMenu.Root>
		<ContextMenu.Trigger on:contextmenu={() => handleContextMenu(openContextMenuId, roles)}>
			<Button
				class="server-access-btn h-12 w-12 text-zinc-500 relative group"
				style="background-image: url('{icon}'); background-size: cover"
				size="icon"
				{href}
			>
				{#if !icon}
					{name.slice(0, 2).toUpperCase()}
				{/if}
				<div
					class="absolute h-2 w-2 bg-white -left-[50%] top-1/2 -translate-y-1/2 rounded-lg group-hover:-left-[30%] group-hover:h-4 transition-[height,left]"
					class:-left-[30%]={serverNotif}
					class:active={$page.url.pathname.includes(href)}
				/>
				{#if mentioned}
					<div class="absolute h-2 w-2 bg-destructive -right-[0.15rem] -top-[0.15rem] rounded-lg" />
				{/if}
			</Button>
		</ContextMenu.Trigger>
		{#if isOpen}
			<ServerAccessContextMenu {roles} {name} {id} />
		{/if}
	</ContextMenu.Root>
</li>

<style>
	.active {
		height: 1.8rem;
		left: -30%;
	}

	:global(.server-access-btn:hover .active) {
		height: 1.8rem;
		left: -30%;
	}

	:global(.server-access-btn::after) {
		transition: border-radius 150ms ease-out;
	}
</style>
