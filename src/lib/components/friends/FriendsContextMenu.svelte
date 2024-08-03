<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import Icon from '@iconify/svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { friends, sessStore, user } from '$lib/stores';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Body, fetch } from '@tauri-apps/api/http';

	export let username: string;
	export let friend_id: string;
	export let space_id: string;

	async function removeFriend() {
		const endpoint = `${import.meta.env.VITE_API_URL}/api/v1/friends/delete`;
		let body: any = {
			user_id: $user?.id,
			friend_id: friend_id,
			space_id: space_id
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

			friends.update((friends) => {
				const newArr = friends.filter((friend) => friend.id !== friend_id);
				return newArr;
			});

			if ($page.url.pathname.includes(space_id.split(':')[1])) {
				goto('/hudori/discovery');
			}
		} catch (e) {
			console.log(e);
		}
	}
</script>

<AlertDialog.Root>
	<ContextMenu.Content>
		<!-- <ContextMenu.Item class="gap-x-2 items-center  text-sm"> -->
		<!-- 	<Icon icon="ph:user-duotone" height={16} width={16} class="" /> -->
		<!-- 	Profile -->
		<!-- </ContextMenu.Item> -->
		<!-- <Separator class="my-2 max-w-[9.5rem] bg-zinc-700 mx-auto" /> -->

		<AlertDialog.Trigger>
			<ContextMenu.Item
				class="gap-x-2 items-center text-destructive data-[highlighted]:text-zinc-50 data-[highlighted]:bg-destructive text-sm"
			>
				<Icon icon="ph:user-minus-duotone" height={16} width={16} class="" />
				Remove Friend
			</ContextMenu.Item>
		</AlertDialog.Trigger>
	</ContextMenu.Content>

	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure ?</AlertDialog.Title>
			<AlertDialog.Description>
				This action will permanently remove <span class="font-bold">{username}</span> from your friend
				list.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				on:click={removeFriend}
				class="bg-destructive border-none hover:bg-destructive/80"
			>
				Remove
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
