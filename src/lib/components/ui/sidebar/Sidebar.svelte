<script>
	import { page } from '$app/stores';

	import FriendsChannelsList from '$lib/components/friends/FriendsChannelsList.svelte';
	import ChannelsList from '$lib/components/server/channels/ChannelsList.svelte';
	import Userbar from '$lib/components/user/Userbar.svelte';
</script>

<aside class="border-r border-zinc-850 bg-zinc-900 relative flex-shrink-0 w-[17rem]">
	{#if $page.url.pathname.includes('friends')}
		<FriendsChannelsList />
	{:else}
		<ChannelsList />
	{/if}

	<Userbar />
</aside>
