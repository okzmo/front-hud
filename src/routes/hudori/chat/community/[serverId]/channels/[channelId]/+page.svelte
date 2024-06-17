<script lang="ts">
	import Chatbox from '$lib/components/ui/chatbox/Chatbox.svelte';
	import { messages, notifications, server, serversStateStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import type { Message } from '$lib/types';

	export let data: PageData;
	$: {
		server.set(data.server);
	}

	$: if ($notifications) {
		let channelNotif = $notifications.findIndex(
			(notification) => notification.channel_id?.split(':')[1] === $page.params.channelId
		);
		if (channelNotif > -1) {
			if ($notifications.length > 1) {
				notifications.update((notifications) => {
					notifications.splice(channelNotif, 1);
					return notifications;
				});
			} else {
				notifications.set([]);
			}
		}
	}

	async function fetchMessages(channelId: string): Promise<Message[] | undefined> {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/messages/${channelId}`, {
				method: 'GET',
				credentials: 'include'
			});
			const data = await response.json();
			return data.messages;
		} catch (error) {
			console.error('Error fetching messages:', error);
		}
	}

	afterNavigate(async () => {
		messages.set(await fetchMessages($page.params.channelId));
	});
	onMount(async () => {
		messages.set(await fetchMessages($page.params.channelId));
		window.addEventListener('beforeunload', () => {
			localStorage.setItem('states', JSON.stringify($serversStateStore));
		});
	});
</script>

<Chatbox friend_chatbox={false} />
