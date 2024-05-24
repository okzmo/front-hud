<script lang="ts">
	import ServerChannelLink from './ServerChannelLink.svelte';
	import { server } from '$lib/stores';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import ServerContextMenu from '$lib/components/server/ServerContextMenu.svelte';
</script>

<ul class="flex flex-col px-4 pt-4 w-full h-[calc(100%_-_4.25rem)]">
	<span class="block w-full h-[10rem] rounded-lg bg-zinc-500" />
	{#if $server && $server.channels}
		<div class="mt-4 flex flex-col gap-y-1">
			{#each $server.channels as channel}
				<li>
					<ServerChannelLink
						href={`/hudori/chat/community/${$server.id.split(':')[1]}/channels/${channel.id.split(':')[1]}`}
						channelName={channel.name}
						type={channel.type}
					/>
				</li>
			{/each}
		</div>
	{:else}
		<p>no bro</p>
	{/if}
	<ContextMenu.Root>
		<ContextMenu.Trigger class="w-full h-full flex-1"></ContextMenu.Trigger>
		<ServerContextMenu />
	</ContextMenu.Root>
</ul>
