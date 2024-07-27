<script>
	import { page } from '$app/stores';

	import FriendsChannelsList from '$lib/components/friends/FriendsChannelsList.svelte';
	import ChannelsList from '$lib/components/server/channels/ChannelsList.svelte';
	import Userbar from '$lib/components/user/Userbar.svelte';
</script>

<aside
	class="relative flex-shrink-0 w-[17rem] flex flex-col rounded-tl-xl rounded-bl-xl border-r border-zinc-850"
>
	{#if $page.url.pathname.includes('chat')}
		{#if $page.url.pathname.includes('friends')}
			<FriendsChannelsList />
		{:else}
			<ChannelsList />
		{/if}
	{:else if $page.url.pathname.includes('videos')}
		hello
	{:else if $page.url.pathname.includes('thoughts')}
		hello
	{/if}

	<Userbar />
</aside>
