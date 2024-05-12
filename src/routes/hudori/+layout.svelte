<script lang="ts">
	import Navbar from '$lib/components/ui/navbar/Navbar.svelte';
	import Sidebar from '$lib/components/ui/sidebar/Sidebar.svelte';
	import { treatMessage } from '$lib/websocket';
	import { setUserState, setServersState, setFriendsState, notifications } from '$lib/stores';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	setUserState(data.props?.user);
	setServersState(data.props?.servers);
	setFriendsState(data.props?.friends);
	notifications.set(data.props?.notifications);

	let ws;

	onMount(() => {
		ws = new WebSocket(`ws://localhost:3000/api/v1/ws/${data.props?.user.id.split(':')[1]}`);

		ws.onmessage = (event) => {
			treatMessage(event.data);
		};

		const body = document.body;

		body.oncontextmenu = (ev) => {
			ev.preventDefault();
		};
	});
</script>

<div class="h-full w-full flex">
	<!-- <div -->
	<!-- 	class="absolute -top-14 left-1/2 -translate-x-1/2 rounded-[50%] w-5/6 h-28 bg-zinc-500 z-[1] bg-gradient-to-b from-[#B693FF] to-[#9397FF] blur-3xl opacity-15 pointer-events-none" -->
	<!-- ></div> -->
	<Navbar />
	<Sidebar />
	<main class="w-full relative">
		<slot />
	</main>
</div>

<style>
</style>
