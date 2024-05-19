<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import Icon from '@iconify/svelte';
</script>

<ContextMenu.Content>
	<ContextMenu.Item class="gap-x-2 items-center">
		<Icon icon="ph:chats-circle-duotone" height={20} width={20} class="" />
		Invite People
	</ContextMenu.Item>
	<ContextMenu.Item class="gap-x-2 items-center">
		<Icon icon="ph:pencil-simple-duotone" height={20} width={20} class="" />
		Create category
	</ContextMenu.Item>
	<ContextMenu.Item class="gap-x-2 items-center">
		<Icon icon="ph:pencil-simple-duotone" height={20} width={20} class="" />
		Create channel
	</ContextMenu.Item>
</ContextMenu.Content>
