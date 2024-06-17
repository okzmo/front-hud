<script lang="ts">
	import Chatbox from '$lib/components/ui/chatbox/Chatbox.svelte';
	import { notifications, server, serversStateStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { afterNavigate, onNavigate } from '$app/navigation';
	import type { Message, MessageUI } from '$lib/types';

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

	let messages: MessageUI[] | undefined;

	async function fetchMessages(channelId: string): Promise<MessageUI[] | undefined> {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/messages/${channelId}`, {
				method: 'GET',
				credentials: 'include'
			});
			const data = await response.json();
			let groupedMessages;

			if (data.messages.length > 0) {
				const threshold = 10000; // 10 seconds
				groupedMessages = data.messages.map((msg, index) => {
					const prevMsg = data.messages[index - 1];
					const nextMsg = data.messages[index + 1];
					const groupWithPrevious =
						index > 0 &&
						new Date(msg.updated_at).getTime() - new Date(prevMsg.updated_at).getTime() <
							threshold &&
						msg.author.id === prevMsg.author.id;
					const groupWithAfter =
						index < data.messages.length - 1 &&
						new Date(nextMsg.updated_at).getTime() - new Date(msg.updated_at).getTime() <
							threshold &&
						msg.author.id === nextMsg.author.id;

					return { ...msg, groupWithPrevious, groupWithAfter };
				});
			}

			return groupedMessages;
		} catch (error) {
			console.error('Error fetching messages:', error);
		}
	}

	afterNavigate(async () => {
		messages = await fetchMessages($page.params.channelId);
	});
	onMount(async () => {
		messages = await fetchMessages($page.params.channelId);
		window.addEventListener('beforeunload', () => {
			localStorage.setItem('states', JSON.stringify($serversStateStore));
		});
	});
</script>

<Chatbox {messages} friend_chatbox={false} />
