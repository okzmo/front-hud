<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Chatbox from '$lib/components/ui/chatbox/Chatbox.svelte';
	import { messages, notifications } from '$lib/stores';
	import { getMessages } from '$lib/fetches';
	import { onMount } from 'svelte';

	$: if ($notifications) {
		let friendNotif = $notifications.findIndex(
			(notification) =>
				notification.channel_id?.split(':')[1] === $page.params.id && !notification.read
		);
		if (friendNotif > -1) {
			notifications.update((notifs) => {
				notifs[friendNotif].read = true;
				return notifs;
			});
		}
	}

	onNavigate(async ({ to }) => {
		if (to && to.params) {
			if (!$messages[to.params.id]) {
				const allMessages = await getMessages({ ...to.params, offset: 0, limit: 25 });

				messages.update((cache) => {
					if (!cache[to.params.id]) {
						cache[to.params.id] = { messages: [], date: Date.now() };
					}
					cache[to.params.id].messages = allMessages;
					return cache;
				});
			}
		}
	});

	onMount(async () => {
		const params = {
			id: $page.params.id,
			offset: 0,
			limit: 25
		};

		if (!$messages[$page.params.id]) {
			const allMessages = await getMessages(params);

			messages.update((cache) => {
				if (!cache[$page.params.id]) {
					cache[$page.params.id] = { messages: [], date: Date.now() };
				}
				cache[$page.params.id].messages = allMessages;
				return cache;
			});
		}
	});
</script>

<Chatbox friend_chatbox={true} />
