<script lang="ts">
	import Chatbox from '$lib/components/ui/chatbox/Chatbox.svelte';
	import { notifications, servers, vcRoom, messages, loadingMessages } from '$lib/stores';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { beforeNavigate } from '$app/navigation';
	import { getMessages } from '$lib/fetches';
	import VoiceChannel from '$lib/components/ui/voicechannel/VoiceChannel.svelte';
	import type { User } from '$lib/types';

	let type = 'textual';
	let participants: User[] = [];

	$: if ($notifications) {
		let channelNotif = $notifications.findIndex(
			(notification) => notification.channel_id?.split(':')[1] === $page.params.channelId
		);
		if (channelNotif > -1) {
			notifications.update((notifs) => {
				notifs[channelNotif].read = true;
				const mentions = notifs[channelNotif]?.mentions;
				if (mentions && mentions.length > 0) {
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

	beforeNavigate(async ({ to }) => {
		if (to && to.params) {
			const channelId = to.params.channelId;
			const allMessages = (await getMessages({ ...to.params, offset: 0, limit: 25 })) || [];
			messages.update((cache) => {
				if (!cache[channelId]) {
					cache[channelId] = { messages: allMessages, date: Date.now() };
				} else {
					cache[channelId].messages = allMessages;
				}
				return cache;
			});
		}
	});

	onMount(async () => {
		const params = {
			channelId: $page.params.channelId,
			offset: 0,
			limit: 25
		};
		if (!$messages[$page.params.channelId]) {
			const allMessages = (await getMessages(params)) || [];
			const channelId = $page.params.channelId;

			messages.update((cache) => {
				if (!cache[channelId]) {
					cache[channelId] = { messages: allMessages, date: Date.now() };
				} else {
					cache[channelId].messages = allMessages;
				}
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
