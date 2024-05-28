<script lang="ts">
	import Icon from '@iconify/svelte';

	import Button from '../button/button.svelte';
	import Separator from '../separator/separator.svelte';
	import { servers } from '$lib/stores';
	import ServerActionsButton from './ServerActionsButton.svelte';
	import GlobalButton from './GlobalButton.svelte';
	import FriendsButton from './FriendsButton.svelte';
	import ServerAccessButton from './ServerAccessButton.svelte';
	import NotificationsButton from './NotificationsButton.svelte';
</script>

<nav class="p-3 border-r border-zinc-850 w-fit h-full">
	<ul class="flex flex-col relative h-full">
		<GlobalButton />
		<Separator class="mt-3 bg-zinc-700" />
		<div class="pt-3 overflow-y-auto h-full flex flex-col gap-y-2 pb-36 scrollbar-hide relative">
			<FriendsButton />
			{#if $servers}
				{#each $servers as server}
					<ServerAccessButton
						id={server.id}
						icon={server.icon}
						name={server.name}
						roles={server.roles}
					/>
				{/each}
			{/if}
			<ServerActionsButton />
		</div>
	</ul>

	<!-- settings/notifications -->
	<div class="fixed bottom-3 rounded-md">
		<span class="block w-full h-4 bg-gradient-to-t from-zinc-925" />
		<div class="flex flex-col bg-zinc-925 gap-y-2">
			<NotificationsButton />

			<Button class="h-12 w-12 rounded-xl text-zinc-500" size="icon">
				<Icon icon="ph:gear-duotone" height="24" width="24" />
			</Button>
		</div>
	</div>
</nav>
