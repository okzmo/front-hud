<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import Separator from '../ui/separator/separator.svelte';
	import Icon from '@iconify/svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	export let username;
	function handleRemoveFriend(ev: Event) {}
</script>

<AlertDialog.Root>
	<ContextMenu.Content>
		<ContextMenu.Item class="gap-x-2 items-center">
			<Icon icon="ph:user-duotone" height={20} width={20} class="" />
			Profile
		</ContextMenu.Item>
		<ContextMenu.Item class="gap-x-2 items-center">
			<Icon icon="ph:phone-duotone" height={20} width={20} class="" />
			Call
		</ContextMenu.Item>
		<Separator class="my-2 max-w-[9.5rem] bg-zinc-700 mx-auto" />

		<AlertDialog.Trigger>
			<ContextMenu.Item
				class="gap-x-2 items-center text-destructive data-[highlighted]:text-zinc-50 data-[highlighted]:bg-destructive"
				on:click={handleRemoveFriend}
			>
				<Icon icon="ph:user-minus-duotone" height={22} width={22} class="" />
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
			<AlertDialog.Action class="bg-destructive border-none hover:bg-destructive/80">
				Remove
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
