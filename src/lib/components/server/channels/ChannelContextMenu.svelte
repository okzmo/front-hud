<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Separator } from '$lib/components/ui/separator';
	import Icon from '@iconify/svelte';
	import { servers, sessStore, user } from '$lib/stores';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { fetch, Body } from '@tauri-apps/api/http';

	export let channelId: string;
	export let categoryName: string;
	export let channelName: string;

	async function deleteChannel() {
		const endpoint = `${import.meta.env.VITE_API_URL}/api/v1/channels/delete`;
		let body: any = {
			channel_id: channelId,
			category_name: categoryName,
			server_id: 'servers:' + $page.params.serverId
		};

		try {
			const sessId = await sessStore.get('sessionId');
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-User-ID': $user?.id,
					Authorization: `Bearer ${sessId}`
				},
				body: Body.json(body)
			});
			const data = response.data as { message: string };

			if (!response.ok) {
				throw new Error(data.message);
			}

			if ($page.url.pathname.includes(channelId.split(':')[1])) {
				const serverId = $page.params.serverId;
				const chanId =
					$servers['servers:' + $page.params.serverId].categories[0].channels[0].id.split(':')[1];
				goto(`/hudori/chat/space/${serverId}/channels/${chanId}`);
			}
		} catch (e) {
			console.log(e);
		}
	}

	let isOwner: boolean;
	$: if ($servers['servers:' + $page.params.serverId]) {
		if ($servers['servers:' + $page.params.serverId].roles?.some((role) => role === 'owner')) {
			isOwner = true;
		} else {
			isOwner = false;
		}
	}

	const openChannel = writable<boolean>(false);
</script>

{#if isOwner}
	<ContextMenu.Content>
		<ContextMenu.Item class="gap-x-2 items-center text-sm">
			<Icon icon="ph:pencil-simple-duotone" height={16} width={16} class="" />
			Edit channel
		</ContextMenu.Item>
		<Separator class="my-2 max-w-[10rem] bg-zinc-700 mx-auto" />
		<ContextMenu.Item
			class="gap-x-2 items-center text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-zinc-50 text-sm"
			on:click={() => openChannel.set(true)}
		>
			<Icon icon="ph:trash-duotone" height={16} width={16} />
			Delete channel
		</ContextMenu.Item>
	</ContextMenu.Content>
{/if}

<AlertDialog.Root open={$openChannel} onOpenChange={() => openChannel.set(!$openChannel)}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure ?</AlertDialog.Title>
			<AlertDialog.Description>
				This action will permanently delete <span class="font-bold">{channelName}</span> as well as all
				the messages in it if any.
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
