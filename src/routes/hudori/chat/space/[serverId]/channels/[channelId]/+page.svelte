<script lang="ts">
	import Chatbox from '$lib/components/ui/chatbox/Chatbox.svelte';
	import { notifications, servers, serversStateStore, vcRoom, messages } from '$lib/stores';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { afterNavigate, onNavigate } from '$app/navigation';
	import { getMessages } from '$lib/fetches';
	import VoiceChannel from '$lib/components/ui/voicechannel/VoiceChannel.svelte';

	let type = 'textual';
	let participants = [];

	$: if ($notifications) {
		let channelNotif = $notifications.findIndex(
			(notification) => notification.channel_id?.split(':')[1] === $page.params.channelId
		);
		if (channelNotif > -1) {
			notifications.update((notifs) => {
				notifs[channelNotif].read = true;
				if (notifs[channelNotif]?.mentions?.length > 0) {
					notifs[channelNotif].mentions = [];
				}

				return notifs;
			});
		}
	}

	$: if ($vcRoom && $vcRoom.name.split(':')[1] === $page.params.channelId) {
		type = 'voice';

		for (const category of $servers[`servers:${$page.params.serverId}`].categories) {
			const channel = category.channels.find((channel) => channel.id === $vcRoom.name);
			if (channel) {
				participants = channel.participants;
				break;
			}
		}
	} else {
		type = 'textual';
	}

	afterNavigate(async ({ to }) => {
		if (to && to.params) {
			if (!$messages[to.params.channelId]) {
				const allMessages = await getMessages({ ...to.params, offset: 0, limit: 25 });

				messages.update((cache) => {
					if (!cache[to.params.channelId]) {
						cache[to.params.channelId] = { messages: [], date: Date.now() };
					}
					cache[to.params.channelId].messages = allMessages;
					return cache;
				});
			}
		}
	});

	onMount(async () => {
		const params = {
			channelId: $page.params.channelId,
			offset: 0,
			limit: 25
		};
		if (!$messages[$page.params.channelId]) {
			const allMessages = await getMessages(params);

			messages.update((cache) => {
				if (!cache[$page.params.channelId]) {
					cache[$page.params.channelId] = { messages: [], date: Date.now() };
				}
				cache[$page.params.channelId].messages = allMessages;
				return cache;
			});
		}
	});
</script>

{#if type === 'textual'}
	<Chatbox friend_chatbox={false} />
{:else if type === 'voice'}
	<VoiceChannel {participants} />
{/if}
