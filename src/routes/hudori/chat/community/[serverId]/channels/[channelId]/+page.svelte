<script lang="ts">
	import Chatbox from '$lib/components/ui/chatbox/Chatbox.svelte';
	import { messages, notifications, server, serversStateStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;
	$: {
		messages.set(data.props?.messages);
		server.set(data.props?.server);
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

	onMount(() => {
		window.addEventListener('beforeunload', () => {
			localStorage.setItem('states', JSON.stringify($serversStateStore));
		});
	});
</script>

<Chatbox friend_chatbox={false} />
