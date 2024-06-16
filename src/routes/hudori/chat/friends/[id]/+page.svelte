<script lang="ts">
	import { page } from '$app/stores';
	import Chatbox from '$lib/components/ui/chatbox/Chatbox.svelte';
	import { messages, notifications } from '$lib/stores';
	import type { Message } from '$lib/types';

	export let data: { messages: Message[] };
	$: messages.set(data.messages);

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
</script>

<Chatbox friend_chatbox={true} />
