<script lang="ts">
	import { contextMenuInfo, servers, user, spaceBg, serversStateStore } from '$lib/stores';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import ServerContextMenu from '$lib/components/server/ServerContextMenu.svelte';
	import ServerCategory from '../ServerCategory.svelte';
	import { generateRandomId, getImageSrc, handleContextMenu } from '$lib/utils';
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Server } from '$lib/types';
	import Icon from '@iconify/svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { fetch } from '@tauri-apps/api/http';
	import { sessStore } from '$lib/stores';

	let openContextMenuId = `context-menu-${generateRandomId()}`;
	let isOpen: boolean = false;
	let serverPromise: Promise<Server>;
	let cacheImage: string;

	$: cachedServer = $servers['servers:' + $page.params.serverId];

	async function getServerById(serverId: string) {
		if ($servers['servers:' + serverId] && $servers['servers:' + serverId].categories) {
			return $servers['servers:' + serverId];
		}

		const sessionId = await sessStore.get('sessionId');
		const res = await fetch(
			`${import.meta.env.VITE_API_URL}/api/v1/server/${$user.id.split(':')[1]}/${serverId}`,
			{
				method: 'GET',
				headers: {
					'X-User-ID': $user.id,
					Authorization: `Bearer ${sessionId}`
				}
			}
		);

		const value = res.data;

		servers.update((cache) => {
			if (cache[value.server.id]) {
				cache[value.server.id] = { ...cache[value.server.id], ...value.server };
			}
			return cache;
		});

		return value.server;
	}

	afterNavigate(async ({ from, to }) => {
		if (from?.params?.serverId !== to?.params?.serverId) {
			serverPromise = getServerById(to.params.serverId);
			cacheImage = await getImageSrc(cachedServer?.banner);
			spaceBg.set(cacheImage);

			localStorage.setItem('states', JSON.stringify($serversStateStore));
		}
	});

	onMount(async () => {
		serverPromise = getServerById($page.params.serverId);
		cacheImage = await getImageSrc(cachedServer?.banner);
		spaceBg.set(cacheImage);
	});

	$: isOpen = $contextMenuInfo?.id === openContextMenuId;
</script>

<div class="flex flex-col w-full flex-grow">
	<img
		class="absolute block w-[calc(100%+0.5rem)] max-w-[calc(100%+0.5rem)] h-[11rem] rounded-tl-lg bg-zinc-500 object-cover object-top blur-xl opacity-75 right-0 transform-gpu"
		src={cacheImage}
		alt=""
	/>
	<div class="relative group">
		<img
			class="absolute block w-full h-[11rem] rounded-tl-lg bg-zinc-500 object-cover object-top"
			src={cacheImage}
			alt=""
		/>
		<Button
			class="right-2 top-2 z-[2] absolute rounded-xl bg-zinc-800/50 hover:bg-zinc-800/75 border-none shadow-none backdrop-blur-lg opacity-0 group-hover:opacity-100 select-none"
			size="icon"
			href="/hudori/chat/space/{cachedServer?.id.split(':')[1]}/settings"
			variant="altDefault"
			draggable="false"
		>
			<Icon icon="solar:settings-bold-duotone" height={18} width={18} />
		</Button>
	</div>
	<div class="gradient-sidebar h-full flex flex-col z-[2] mt-[10rem] px-3 backdrop-blur-md">
		<div class="pt-[0.875rem] pb-8 text-zinc-50 relative w-fit mx-auto flex items-center">
			<Icon icon="solar:confetti-bold-duotone" class="absolute -left-8" height={18} width={18} />
			{cachedServer?.name}
		</div>
		{#await serverPromise then data}
			{#if $servers[data?.id]}
				<ul class="flex flex-col gap-y-1">
					{#each $servers[data?.id].categories as category}
						<ServerCategory serverId={data?.id} {category} />
					{/each}
				</ul>
			{:else}
				<div></div>
			{/if}
		{/await}
		<ContextMenu.Root>
			<ContextMenu.Trigger
				class="w-full flex-grow"
				on:contextmenu={() => handleContextMenu(openContextMenuId)}
			></ContextMenu.Trigger>
			{#if isOpen}
				<ServerContextMenu />
			{/if}
		</ContextMenu.Root>
	</div>
</div>

<style>
	.gradient-sidebar {
		background: linear-gradient(
			180deg,
			rgba(18, 18, 21, 0.55) 0%,
			rgba(18, 18, 21, 0.95) 10%,
			#121215 72%
		);
	}
</style>
