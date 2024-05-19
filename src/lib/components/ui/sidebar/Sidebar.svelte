<script lang="ts">
	import { page } from '$app/stores';

	import * as ContextMenu from '$lib/components/ui/context-menu';
	import ServerChannelsList from '$lib/components/server/ServerChannelsList.svelte';
	import FriendsChannelsList from '$lib/components/friends/FriendsChannelsList.svelte';
	import Userbar from '$lib/components/user/Userbar.svelte';
	import ServerContextMenu from '$lib/components/server/ServerContextMenu.svelte';

	function handleContextMenu(ev: Event) {
		ev.stopPropagation();
	}
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger
		class="border-r border-zinc-850 bg-zinc-900 w-sidebar relative flex-shrink-0 w-[20rem]"
		on:contextmenu={handleContextMenu}
	>
		{#if $page.url.pathname.includes('friends')}
			<FriendsChannelsList />
		{:else}
			<ServerChannelsList />
		{/if}

		<Userbar />
	</ContextMenu.Trigger>
	<ServerContextMenu />
</ContextMenu.Root>
