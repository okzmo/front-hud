<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import Separator from '../separator/separator.svelte';
	import Icon from '@iconify/svelte';
</script>

<ContextMenu.Content>
	<ContextMenu.Item class="gap-x-2 items-center">
		<Icon icon="ph:user-plus-duotone" height={20} width={20} class="" />
		Invite people
	</ContextMenu.Item>
	<Separator class="my-2 max-w-[10rem] bg-zinc-700 mx-auto" />
	<ContextMenu.Item
		class="gap-x-2 items-center text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-zinc-50"
	>
		<Icon icon="ph:sign-out-duotone" height={22} width={22} />
		Leave community
	</ContextMenu.Item>
	<ContextMenu.Item
		class="gap-x-2 items-center text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-zinc-50"
	>
		<Icon icon="ph:trash-duotone" height={22} width={22} />
		Delete community
	</ContextMenu.Item>
</ContextMenu.Content>
