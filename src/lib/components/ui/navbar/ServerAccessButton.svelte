<script lang="ts">
	import Button from '../button/button.svelte';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import ServerAccessContextMenu from './ServerAccessContextMenu.svelte';
	import { contextMenuInfo, serversStateStore } from '$lib/stores';
	import { generateRandomId, handleContextMenu } from '$lib/utils';

	export let icon: string | undefined;
	export let name: string;
	export let id: string;
	export let roles: string[] | undefined;

	let openContextMenuId = `context-menu-${generateRandomId()}`;
	let isOpen: boolean = false;
	let href = `/hudori/chat/community/${id.split(':')[1]}`;

	$: isOpen = $contextMenuInfo?.id === openContextMenuId;
	$: if ($serversStateStore[id]) {
		href = `/hudori/chat/community/${id.split(':')[1]}/channels/${$serversStateStore[id].lastVisited}`;
	}
</script>

<li>
	<ContextMenu.Root>
		<ContextMenu.Trigger on:contextmenu={() => handleContextMenu(openContextMenuId, roles)}>
			<Button class="h-12 w-12 rounded-xl text-zinc-500 overflow-hidden" size="icon" {href}>
				{#if icon}
					<img class="aspect-square object-cover" src={icon} alt={name.slice(0, 2).toUpperCase()} />
				{:else}
					{name.slice(0, 2).toUpperCase()}
				{/if}
			</Button>
		</ContextMenu.Trigger>
		{#if isOpen}
			<ServerAccessContextMenu {roles} {name} {id} />
		{/if}
	</ContextMenu.Root>
</li>
