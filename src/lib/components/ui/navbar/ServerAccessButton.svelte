<script lang="ts">
	import Button from '../button/button.svelte';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import ServerAccessContextMenu from './ServerAccessContextMenu.svelte';

	export let icon: string | undefined;
	export let name: string;
	export let id: string;
</script>

<li>
	<ContextMenu.Root>
		<ContextMenu.Trigger>
			<Button
				class="h-14 w-14 rounded-xl text-zinc-500 overflow-hidden"
				size="icon"
				href={`/hudori/chat/community/${id.split(':')[1]}`}
			>
				{#if icon}
					<img class="aspect-square object-cover" src={icon} alt={name.slice(0, 2).toUpperCase()} />
				{:else}
					{name.slice(0, 2).toUpperCase()}
				{/if}
			</Button>
		</ContextMenu.Trigger>
		<ServerAccessContextMenu />
	</ContextMenu.Root>
</li>
