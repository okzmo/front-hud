<script lang="ts">
	import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
	import Sidebar from '$lib/components/ui/sidebar/Sidebar.svelte';
	import { treatMessage } from '$lib/websocket';
	import { notifications, friendRequest, friends, servers, user, wsConn } from '$lib/stores';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';

	export let data: LayoutData;
	user.set(data.props?.user);
	servers.set(data.props?.servers);
	friends.set(data.props?.friends);
	notifications.set(data.props?.notifications);
	friendRequest.set(data.props?.formFriendRequest);

	let ws;

	onMount(() => {
		ws = new WebSocket(
			`${import.meta.env.VITE_API_WS_URL}/ws/${data.props?.user.id.split(':')[1]}`
		);
		wsConn.set(ws);

		ws.onmessage = (event) => {
			treatMessage(event.data);
		};

		const body = document.body;

		body.oncontextmenu = (ev) => {
			ev.preventDefault();
		};

		const audios = document.getElementsByTagName('audio');
		for (const audio of audios) {
			audio.volume = 0.25;
		}
	});

	const hideSidebar = ['/hudori/settings'];
</script>

<div class="h-full w-full flex">
	<!-- <div -->
	<!-- 	class="absolute -top-14 left-1/2 -translate-x-1/2 rounded-[50%] w-5/6 h-28 bg-zinc-500 z-[1] bg-gradient-to-b from-[#B693FF] to-[#9397FF] blur-3xl opacity-15 pointer-events-none" -->
	<!-- ></div> -->
	{#if !$page.url.pathname.includes('settings')}
		<Navbar />
		<Sidebar />
	{/if}
	{#if !$page.url.pathname.includes('settings')}
		<main class="flex-grow max-w-[calc(100%-17rem-4.15rem)] relative">
			<slot />
		</main>
	{/if}
	{#if $page.url.pathname.includes('settings')}
		<slot />
	{/if}

	<audio id="audio_join_channel" src="/audio/join_channel_pos.mp3"></audio>
	<audio id="audio_quit_channel" src="/audio/join_channel_neg.mp3"></audio>
	<audio id="audio_ringtone" src="/audio/ringtone.mp3"></audio>
</div>

<style>
	:global(a[data-internal='true']::after) {
		content: none;
	}
</style>
