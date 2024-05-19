<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import Separator from '../ui/separator/separator.svelte';
	import Icon from '@iconify/svelte';
</script>

<ContextMenu.Content>
	<ContextMenu.Item class="gap-x-2 items-center">
		<Icon icon="ph:pencil-simple-duotone" height={20} width={20} class="" />
		Edit channel
	</ContextMenu.Item>
	<ContextMenu.Item class="gap-x-2 items-center">
		<Icon icon="ph:chats-circle-duotone" height={20} width={20} class="" />
		Duplicate channel
	</ContextMenu.Item>
	<Separator class="my-2 max-w-[10rem] bg-zinc-700 mx-auto" />
	<ContextMenu.Item
		class="gap-x-2 items-center text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-zinc-50"
	>
		<Icon icon="ph:trash-duotone" height={22} width={22} />
		Delete channel
	</ContextMenu.Item>
</ContextMenu.Content>
