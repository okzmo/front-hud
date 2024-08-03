<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Icon from '@iconify/svelte';
	import ServerActionsDialog from './ServerActionsDialog.svelte';
	import { writable } from 'svelte/store';
	import { showFriends, user } from '$lib/stores';
	import FriendRequestDialog from '$lib/components/friends/FriendRequestDialog.svelte';

	const open = writable<boolean>(false);
</script>

<li>
	<Dialog.Root open={$open} onOpenChange={() => open.set(!$open)}>
		<Dialog.Trigger>
			<Button class="h-12 w-12 text-zinc-500" size="icon">
				<Icon icon="ph:plus-light" height="22" width="22" />
			</Button>
		</Dialog.Trigger>
		{#if $showFriends}
			<FriendRequestDialog initiator_id={$user?.id} initiator_username={$user?.username} />
		{:else}
			<ServerActionsDialog {open} />
		{/if}
	</Dialog.Root>
</li>
