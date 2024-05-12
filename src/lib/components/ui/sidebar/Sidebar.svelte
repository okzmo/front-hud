<script>
	import { page } from '$app/stores';

	import ServerChannelsList from '$lib/components/server/ServerChannelsList.svelte';
	import FriendsChannelsList from '$lib/components/friends/FriendsChannelsList.svelte';
	import Userbar from '$lib/components/user/Userbar.svelte';
</script>

<aside class="border-r border-zinc-850 bg-zinc-900 w-sidebar relative flex-shrink-0 min-w-[20rem]">
	{#if $page.url.pathname.includes('friends')}
		<FriendsChannelsList />
	{:else}
		<ServerChannelsList />
	{/if}

	<Userbar />
</aside>
