<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { Separator } from '$lib/components/ui/separator';
	import Icon from '@iconify/svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { servers, user } from '$lib/stores';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';

	export let roles: string[] | undefined;
	export let name: string;
	export let id: string;
	let type: string;

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
				goto('/hudori/chat/friends');
			}
		} catch (e) {
			console.log(e);
		}
	}

	async function quitServer() {
		const endpoint = `${import.meta.env.VITE_API_URL}/api/v1/server/leave`;
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

			servers.update((servers) => {
				const newServers = servers.filter((server) => server.id !== id);
				return newServers;
			});

			if ($page.url.pathname.includes(id.split(':')[1])) {
				goto('/hudori/chat/friends');
			}
		} catch (e) {
			console.log(e);
		}
	}

	const openRemoveChannel = writable<boolean>(false);

	let isOwner: boolean;
	$: if (roles) {
		if (roles?.some((role) => role === 'owner')) {
			isOwner = true;
		} else {
			isOwner = false;
		}
	}
</script>

<ContextMenu.Content class="flex flex-col">
	<ContextMenu.Item class="gap-x-2 items-center text-sm">
		<Icon icon="ph:user-plus-duotone" height={16} width={16} class="" />
		Invite people
	</ContextMenu.Item>
	<Separator class="my-2 max-w-[10rem] bg-zinc-700 mx-auto" />
	{#if !isOwner}
		<ContextMenu.Item
			class="gap-x-2 items-center text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-zinc-50 text-sm"
			on:click={() => {
				openRemoveChannel.set(true);
				type = 'leave';
			}}
		>
			<Icon icon="ph:sign-out-duotone" height={16} width={16} />
			Leave community
		</ContextMenu.Item>
	{:else}
		<ContextMenu.Item
			class="gap-x-2 items-center text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-zinc-50 text-sm"
			on:click={() => {
				openRemoveChannel.set(true);
				type = 'delete';
			}}
		>
			<Icon icon="ph:trash-duotone" height={16} width={16} />
			Delete community
		</ContextMenu.Item>
	{/if}
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
				{#if type === 'delete'}
					This action will permanently delete <span class="font-bold">{name}</span> as well as all the
					data related to this community.
				{:else if type === 'leave'}
					You will leave <span class="font-bold">{name}</span> and won't be able to join again until
					you're invited back.
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				on:click={() => {
					if (type === 'delete') {
						deleteServer();
					} else {
						quitServer();
					}
				}}
				class="bg-destructive border-none hover:bg-destructive/80"
			>
				{type === 'delete' ? 'Remove' : 'Leave'}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
