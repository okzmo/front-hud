<script lang="ts">
	import Icon from '@iconify/svelte';

	import Button from '../button/button.svelte';
	import Separator from '../separator/separator.svelte';
	import { friends, servers, settingsLastPage, showFriends } from '$lib/stores';
	import ServerActionsButton from './ServerActions/ServerActionsButton.svelte';
	import GlobalButton from './GlobalButton/GlobalButton.svelte';
	import FriendsButton from './FriendsButton.svelte';
	import ServerAccessButton from './ServerAccess/ServerAccessButton.svelte';
	import NotificationsButton from './NotificationsButton.svelte';
	import { beforeNavigate } from '$app/navigation';
	import FriendAccessButton from './FriendAccessButton/FriendAccessButton.svelte';

	beforeNavigate(({ from, to }) => {
		if (from && to?.url.pathname.includes('settings')) {
			settingsLastPage.set(from.url.href);
		}
	});

	$: groupServer = Object.values($servers).filter((server) => server.type === 'group');
</script>

<nav class="min-w-[4.65rem] h-full flex flex-col pt-6">
	<ul class="flex flex-col relative flex-grow overflow-y-auto">
		<GlobalButton />
		<Separator class="mt-3 bg-zinc-700 w-[3rem] mx-auto" />
		<div class="pt-3 flex flex-col gap-y-2 scrollbar-hide relative items-center">
			<FriendsButton />
			{#if $servers && !$showFriends}
				{#each groupServer as server}
					<ServerAccessButton
						id={server.id}
						icon={server.icon}
						name={server.name}
						roles={server.roles}
					/>
				{/each}
			{:else}
				{#each $friends as friend}
					<FriendAccessButton
						friend_id={friend.id}
						space_id={friend.space_id}
						avatar={friend.avatar}
						name={friend.username}
					/>
				{/each}
			{/if}
			<ServerActionsButton />
		</div>
	</ul>

	<!-- settings/notifications -->
	<div class="flex flex-col items-center">
		<span class="block w-full h-4 bg-gradient-to-t from-zinc-950" />
		<div class="flex flex-col bg-zinc-950 gap-y-2">
			<NotificationsButton />

			<Button
				href="/hudori/settings/account"
				class="h-[3.35rem] w-[3.35rem] text-zinc-500"
				size="icon"
			>
				<Icon icon="solar:settings-bold-duotone" height="24" width="24" />
			</Button>
		</div>
	</div>
</nav>
