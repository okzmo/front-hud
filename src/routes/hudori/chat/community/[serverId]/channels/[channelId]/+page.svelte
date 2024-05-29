<script lang="ts">
	import Chatbox from '$lib/components/ui/chatbox/Chatbox.svelte';
	import { messages, server, serversStateStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: {
		messages.set(data.props?.messages);
		server.set(data.props?.server);
	}

	onMount(() => {
		window.addEventListener('beforeunload', () => {
			localStorage.setItem('states', JSON.stringify($serversStateStore));
		});
	});
</script>

<Chatbox friend_chatbox={false} />
