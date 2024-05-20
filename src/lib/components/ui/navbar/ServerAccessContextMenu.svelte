<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import Separator from '../separator/separator.svelte';
	import Icon from '@iconify/svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	export let roles: string[] | undefined;
	export let name: string;
	let type: string;

	function isOwner(): boolean {
		if (roles) {
			return roles.some((role) => role === 'owner');
		}
		return false;
	}
</script>

<AlertDialog.Root>
	<ContextMenu.Content class="flex flex-col">
		<ContextMenu.Item class="gap-x-2 items-center">
			<Icon icon="ph:user-plus-duotone" height={20} width={20} class="" />
			Invite people
		</ContextMenu.Item>
		<Separator class="my-2 max-w-[10rem] bg-zinc-700 mx-auto" />
		<AlertDialog.Trigger>
			<ContextMenu.Item
				class="gap-x-2 items-center text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-zinc-50"
				on:click={() => (type = 'leave')}
			>
				<Icon icon="ph:sign-out-duotone" height={22} width={22} />
				Leave community
			</ContextMenu.Item>
		</AlertDialog.Trigger>
		{#if isOwner()}
			<AlertDialog.Trigger>
				<ContextMenu.Item
					class="gap-x-2 items-center text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-zinc-50"
					on:click={() => (type = 'delete')}
				>
					<Icon icon="ph:trash-duotone" height={22} width={22} />
					Delete community
				</ContextMenu.Item>
			</AlertDialog.Trigger>
		{/if}
	</ContextMenu.Content>

	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure ?</AlertDialog.Title>
			<AlertDialog.Description>
				{#if type === 'delete'}
					This action will permanently remove <span class="font-bold">{name}</span>.
				{:else if type === 'leave'}
					You will leave <span class="font-bold">{name}</span> and won't be able to join again until
					you're invited back.
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action class="bg-destructive border-none hover:bg-destructive/80">
				{type === 'delete' ? 'Remove' : 'Leave'}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
