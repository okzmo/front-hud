<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Chatbox from '$lib/components/ui/chatbox/Chatbox.svelte';
	import { notifications, user } from '$lib/stores';
	import type { Message, MessageUI } from '$lib/types';
	import { onMount } from 'svelte';

	export let data: { messages: Message[] };

	$: if ($notifications) {
		let friendNotif = $notifications.findIndex(
			(notification) => notification.channel_id?.split(':')[1] === $page.params.id
		);
		if (friendNotif > -1) {
			if ($notifications.length > 1) {
				notifications.update((notifications) => {
					notifications.splice(friendNotif, 1);
					return notifications;
				});
			} else {
				notifications.set([]);
			}
		}
	}

	let messages: MessageUI[] | undefined;

	async function fetchFriendMessages(channelId: string): Promise<MessageUI[] | undefined> {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/v1/messages/${channelId}/private/${$user?.id.split(':')[1]}`,
				{
					method: 'GET',
					credentials: 'include'
				}
			);
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
		messages = await fetchFriendMessages($page.params.id);
	});
	onMount(async () => {
		messages = await fetchFriendMessages($page.params.id);
	});
</script>

<Chatbox {messages} friend_chatbox={true} />
