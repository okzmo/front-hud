<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { Separator } from '$lib/components/ui/separator';
	import Icon from '@iconify/svelte';
	import { server } from '$lib/stores';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Dialog from '$lib/components/ui/dialog';
	import { writable, type Writable } from 'svelte/store';
	import ChannelDialog from './ChannelDialog.svelte';

	export let categoryName: string;

	async function deleteChannel() {
		const endpoint = `${import.meta.env.VITE_API_URL}/api/v1/category/delete`;
		let body: any = {
			category_name: categoryName,
			server_id: $server?.id
		};

		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message);
			}
		} catch (e) {
			console.log(e);
		}
	}

	let openAlert: Writable<boolean> = writable<boolean>(false);
	let openChannel: Writable<boolean> = writable<boolean>(false);
	let canDelete: boolean;

	let isOwner: boolean;
	$: if ($server) {
		if ($server.roles?.some((role) => role === 'owner')) {
			isOwner = true;
		} else {
			isOwner = false;
		}

		canDelete = $server.categories.length > 1;
	}
</script>

{#if isOwner}
	<ContextMenu.Content id="context-menu-category">
		<ContextMenu.Item class="gap-x-2 items-center text-sm">
			<Icon icon="ph:pencil-simple-duotone" height={16} width={16} class="" />
			Edit category
		</ContextMenu.Item>
		<ContextMenu.Item class="gap-x-2 items-center text-sm" on:click={() => openChannel.set(true)}>
			<Icon icon="ph:plus-circle-duotone" height={16} width={16} class="" />
			Create channel
		</ContextMenu.Item>
		{#if canDelete}
			<Separator class="my-2 max-w-[10rem] bg-zinc-700 mx-auto" />
			<ContextMenu.Item
				class="gap-x-2 items-center text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-zinc-50 text-sm"
				on:click={() => openAlert.set(true)}
			>
				<Icon icon="ph:trash-duotone" height={16} width={16} />
				Delete category
			</ContextMenu.Item>
		{/if}
	</ContextMenu.Content>
{/if}

<Dialog.Root open={$openChannel} onOpenChange={() => openChannel.set(!$openChannel)}>
	<ChannelDialog {categoryName} open={openChannel} />
</Dialog.Root>

<AlertDialog.Root open={$openAlert} onOpenChange={() => openAlert.set(!$openAlert)}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure ?</AlertDialog.Title>
			<AlertDialog.Description>
				This action will permanently delete <span class="font-bold">{categoryName}</span> as well as
				all the messages in it if any.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				on:click={() => deleteChannel()}
				class="bg-destructive border-none hover:bg-destructive/80"
			>
				Remove
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
