<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import Icon from '@iconify/svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { user } from '$lib/stores';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';

	export let name: string;
	export let id: string;

	async function deleteServer() {
		const endpoint = `${import.meta.env.VITE_API_URL}/api/v1/server/delete`;
		let body: any = {
			user_id: $user?.id,
			server_id: id
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

			if ($page.url.pathname.includes(id.split(':')[1])) {
				goto('/hudori/discovery');
			}
		} catch (e) {
			console.log(e);
		}
	}

	const openRemoveChannel = writable<boolean>(false);
</script>

<ContextMenu.Content class="flex flex-col">
	<ContextMenu.Item
		class="gap-x-2 items-center text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-zinc-50 text-sm"
		on:click={() => {
			openRemoveChannel.set(true);
		}}
	>
		<Icon icon="ph:sign-out-duotone" height={16} width={16} />
		Remove friend
	</ContextMenu.Item>
</ContextMenu.Content>

<AlertDialog.Root
	open={$openRemoveChannel}
	onOpenChange={() => {
		openRemoveChannel.set(!$openRemoveChannel);
	}}
>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure ?</AlertDialog.Title>
			<AlertDialog.Description>
				This action will permanently delete your space <span class="font-bold">{name}</span> as well
				as all the data related to this space.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				on:click={() => {
					deleteServer();
				}}
				class="bg-destructive border-none hover:bg-destructive/80"
			>
				Remove
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
