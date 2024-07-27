<script lang="ts">
	import { ContextMenuContent, ContextMenuItem } from '$lib/components/ui/context-menu';
	import { Dialog } from '$lib/components/ui/dialog';
	import { Separator } from '$lib/components/ui/separator';
	import Icon from '@iconify/svelte';
	import { servers, user } from '$lib/stores';
	import {
		AlertDialog,
		AlertDialogHeader,
		AlertDialogTitle,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent
	} from '$lib/components/ui/alert-dialog';
	import { writable, type Writable } from 'svelte/store';
	import ChannelDialog from './ChannelDialog.svelte';
	import { page } from '$app/stores';

	export let categoryName: string;

	async function deleteChannel() {
		const endpoint = `${import.meta.env.VITE_API_URL}/api/v1/category/delete`;
		let body: any = {
			category_name: categoryName,
			server_id: `servers:${$page.params.serverId}`
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
		} catch (e) {
			console.log(e);
		}
	}

	let openAlert: Writable<boolean> = writable<boolean>(false);
	let openChannel: Writable<boolean> = writable<boolean>(false);
	let canDelete: boolean;

	let isOwner: boolean;
	$: {
		if ($servers[`servers:${$page.params.serverId}`]) {
			if ($servers[`servers:${$page.params.serverId}`].roles?.some((role) => role === 'owner')) {
				isOwner = true;
			} else {
				isOwner = false;
			}

			canDelete = $servers[`servers:${$page.params.serverId}`].categories.length > 1;
		}
	}
</script>

{#if isOwner}
	<ContextMenuContent id="context-menu-category">
		<ContextMenuItem class="gap-x-2 items-center text-sm">
			<Icon icon="ph:pencil-simple-duotone" height={16} width={16} class="" />
			Edit category
		</ContextMenuItem>
		<ContextMenuItem class="gap-x-2 items-center text-sm" on:click={() => openChannel.set(true)}>
			<Icon icon="ph:plus-circle-duotone" height={16} width={16} class="" />
			Create channel
		</ContextMenuItem>
		{#if canDelete}
			<Separator class="my-2 max-w-[10rem] bg-zinc-700 mx-auto" />
			<ContextMenuItem
				class="destructive-item gap-x-2 items-center text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-zinc-50 text-sm"
				on:click={() => openAlert.set(true)}
			>
				<Icon icon="ph:trash-duotone" height={16} width={16} />
				Delete category
			</ContextMenuItem>
		{/if}
	</ContextMenuContent>
{/if}

<Dialog open={$openChannel} onOpenChange={() => openChannel.set(!$openChannel)}>
	<ChannelDialog {categoryName} open={openChannel} />
</Dialog>

<AlertDialog open={$openAlert} onOpenChange={() => openAlert.set(!$openAlert)}>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>Are you absolutely sure ?</AlertDialogTitle>
			<AlertDialogDescription>
				This action will permanently delete <span class="font-bold">{categoryName}</span> as well as
				all the messages in it if any.
			</AlertDialogDescription>
		</AlertDialogHeader>
		<AlertDialogFooter>
			<AlertDialogCancel>Cancel</AlertDialogCancel>
			<AlertDialogAction
				on:click={() => deleteChannel()}
				class="bg-destructive border-none hover:bg-destructive/80"
			>
				Remove
			</AlertDialogAction>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>

<style>
	:global(.destructive-item:hover::before) {
		opacity: 0 !important;
	}
</style>
