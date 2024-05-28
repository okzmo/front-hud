<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import * as Dialog from '$lib/components/ui/dialog';
	import Icon from '@iconify/svelte';
	import { writable } from 'svelte/store';
	import ChannelDialog from './channels/ChannelDialog.svelte';
	import ChannelCategoryDialog from './channels/ChannelCategoryDialog.svelte';
	import { server } from '$lib/stores';

	const openChannel = writable<boolean>(false);
	const openCategory = writable<boolean>(false);

	let isOwner: boolean;
	$: if ($server) {
		if ($server.roles?.some((role) => role === 'owner')) {
			isOwner = true;
		} else {
			isOwner = false;
		}
	}
</script>

<ContextMenu.Content>
	<ContextMenu.Item class="gap-x-2 items-center text-sm">
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

<Dialog.Root open={$openCategory} onOpenChange={() => openCategory.set(!$openCategory)}>
	<ChannelCategoryDialog open={openCategory} />
</Dialog.Root>

<Dialog.Root open={$openChannel} onOpenChange={() => openChannel.set(!$openChannel)}>
	<ChannelDialog categoryName={$server?.categories[0].name} open={openChannel} />
</Dialog.Root>
