<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import Separator from '../ui/separator/separator.svelte';
	import Icon from '@iconify/svelte';
</script>

<ContextMenu.Content>
	<ContextMenu.Item class="gap-x-2 items-center">
		<Icon icon="ph:user-duotone" height={20} width={20} class="" />
		Profile
	</ContextMenu.Item>
	<ContextMenu.Item class="gap-x-2 items-center">
		<Icon icon="ph:phone-duotone" height={20} width={20} class="" />
		Call
	</ContextMenu.Item>
	<Separator class="my-2 max-w-[8.5rem] bg-zinc-700 mx-auto" />
	<ContextMenu.Item
		class="gap-x-2 items-center text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-zinc-50"
	>
		<Icon icon="ph:user-minus-duotone" height={22} width={22} />
		Remove Friend
	</ContextMenu.Item>
</ContextMenu.Content>
