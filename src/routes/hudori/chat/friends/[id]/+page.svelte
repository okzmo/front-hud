<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Chatbox from '$lib/components/ui/chatbox/Chatbox.svelte';
	import { messages, notifications, user } from '$lib/stores';
	import type { Message } from '$lib/types';
	import { onMount } from 'svelte';

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

	async function fetchFriendMessages(channelId: string): Promise<Message[] | undefined> {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/api/v1/messages/${channelId}/private/${$user?.id.split(':')[1]}`,
				{
					method: 'GET',
					credentials: 'include',
					headers: {
						'X-User-Agent': navigator.userAgent,
						'X-User-ID': $user?.id
					}
				}
			);
			const data = await response.json();
			return data.messages;
		} catch (error) {
			console.error('Error fetching messages:', error);
		}
	}

	afterNavigate(async () => {
		messages.set(await fetchFriendMessages($page.params.id));
	});
	onMount(async () => {
		messages.set(await fetchFriendMessages($page.params.id));
	});
</script>

<Chatbox friend_chatbox={true} />
