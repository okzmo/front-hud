<script lang="ts">
	import ServerChannelLink from './ServerChannelLink.svelte';
	import { server } from '$lib/stores';
</script>

<ul class="flex flex-col px-4 pt-4 w-full">
	<span class="block w-full h-[12rem] rounded-lg bg-zinc-500" />
	{#if $server && $server.channels}
		<div class="px-2 mt-8 flex flex-col gap-y-2">
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
</ul>
