<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import * as Dialog from '$lib/components/ui/dialog';
	import Icon from '@iconify/svelte';
	import { writable } from 'svelte/store';
	import ChannelDialog from './channels/ChannelDialog.svelte';
	import ChannelCategoryDialog from './channels/ChannelCategoryDialog.svelte';
	import { server, user } from '$lib/stores';
	import ServerInviteDialog from './ServerInviteDialog.svelte';

	const openChannel = writable<boolean>(false);
	const openCategory = writable<boolean>(false);
	const openInvite = writable<boolean>(false);

	let inviteId: string = '';
	let isOwner: boolean;
	$: if ($server) {
		if ($server.roles?.some((role) => role === 'owner')) {
			isOwner = true;
		} else {
			isOwner = false;
		}
	}

	async function createInvitation() {
		const endpoint = `${import.meta.env.VITE_API_URL}/api/v1/invites/create`;
		let body: any = {
			user_id: $user?.id,
			server_id: $server?.id
		};

		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'X-User-Agent': navigator.userAgent,
					'X-User-ID': $user?.id
				},
				body: JSON.stringify(body)
			});
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message);
			}

			inviteId = data.id;
		} catch (e) {
			console.log(e);
		}
	}
</script>

<ContextMenu.Content>
	<ContextMenu.Item
		class="gap-x-2 items-center text-sm"
		on:click={() => {
			createInvitation();
			openInvite.set(true);
		}}
	>
		<Icon icon="ph:chats-circle-duotone" height={16} width={16} />
		Invite People
	</ContextMenu.Item>
	{#if isOwner}
		<ContextMenu.Item class="gap-x-2 items-center text-sm" on:click={() => openCategory.set(true)}>
			<Icon icon="ph:rows-plus-bottom-duotone" height={16} width={16} />
			Create category
		</ContextMenu.Item>
		<ContextMenu.Item class="gap-x-2 items-center text-sm" on:click={() => openChannel.set(true)}>
			<Icon icon="ph:plus-circle-duotone" height={16} width={16} />
			Create channel
		</ContextMenu.Item>
	{/if}
</ContextMenu.Content>

<Dialog.Root open={$openInvite} onOpenChange={() => openInvite.set(!$openInvite)}>
	<ServerInviteDialog id={inviteId} />
</Dialog.Root>

<Dialog.Root open={$openCategory} onOpenChange={() => openCategory.set(!$openCategory)}>
	<ChannelCategoryDialog open={openCategory} />
</Dialog.Root>

<Dialog.Root open={$openChannel} onOpenChange={() => openChannel.set(!$openChannel)}>
	<ChannelDialog categoryName={$server?.categories[0].name} open={openChannel} />
</Dialog.Root>
