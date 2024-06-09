import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import {
	notifications,
	messages,
	friends,
	server,
	servers,
	addParticipant,
	removeParticipant,
	updateParticipantStatus,
	vcRoom
} from './stores';
import type { Message } from './types';

export function treatMessage(message: any) {
	const wsMessage = JSON.parse(message);
	const room = get(vcRoom);
	switch (wsMessage.type) {
		case 'text_message':
			const newMessage: Message = wsMessage.content;
			const pathname = window.location.pathname;
			if (
				pathname.includes(newMessage.channel_id.split(':')[1]) ||
				pathname.includes(newMessage.author.id.split(':')[1])
			) {
				messages.update((messages) => {
					messages.push(newMessage);
					return messages;
				});
				const chatbox = document.getElementById('chatbox');
				setTimeout(() => {
					chatbox?.scrollTo({ left: 0, top: chatbox.scrollHeight, behavior: 'smooth' });
				}, 10);
			} else {
				notifications.update((notifications) => {
					const notif = notifications.find(
						(notification) =>
							notification.user_id === wsMessage.notification.user_id &&
							notification.channel_id === wsMessage.notification.channel_id
					);
					if (!notif) {
						notifications.push(wsMessage.notification);
					} else {
						notif.counter += 1;
					}
					return notifications;
				});
			}
			break;
		case 'friend_request':
			notifications.update((notifications) => {
				notifications.unshift(wsMessage.content);
				return notifications;
			});

			break;
		case 'friend_accept':
			friends.update((friends) => {
				friends.push(wsMessage.content);
				return friends;
			});

			break;
		case 'create_channel':
			server.update((server) => {
				const category = server?.categories.find(
					(category) => category.name === wsMessage.content.category_name
				);
				category?.channels.push(wsMessage.content.channel);
				return server;
			});
			break;
		case 'delete_channel':
			server.update((server) => {
				let category = server?.categories.find(
					(category) => category.name === wsMessage.content.category_name
				);
				const chanIdx = category?.channels.findIndex(
					(channel) => channel.id === wsMessage.content.channel_id
				)!;
				category?.channels.splice(chanIdx, 1);
				return server;
			});

			if (window.location.pathname.includes(wsMessage.content.channel_id.split(':')[1])) {
				const serverInfos = get(server);
				const serverId = serverInfos?.id.split(':')[1];
				const chanId = serverInfos?.categories[0].channels[0].id.split(':')[1];
				goto(`/hudori/chat/community/${serverId}/channels/${chanId}`);
			}
			break;
		case 'create_category':
			server.update((server) => {
				server?.categories.push({ name: wsMessage.content, channels: [] });
				return server;
			});
			break;
		case 'delete_category':
			server.update((server) => {
				let catIdx = server?.categories.findIndex(
					(category) => category.name === wsMessage.content
				)!;
				server?.categories.splice(catIdx, 1);
				return server;
			});
			break;
		case 'friend_remove':
			friends.update((friends) => {
				const newArr = friends.filter((friend) => friend.id !== wsMessage.content);
				return newArr;
			});
			if (window.location.pathname.includes(wsMessage.content.split(':')[1])) {
				goto('/hudori/chat/friends');
			}
			break;
		case 'delete_server':
			servers.update((servers) => {
				const serverIdx = servers.findIndex((server) => server.id === wsMessage.content)!;
				servers.splice(serverIdx, 1);
				return servers;
			});
			if (window.location.pathname.includes(wsMessage.content.split(':')[1])) {
				goto('/hudori/chat/friends');
			}
			break;
		case 'new_participant':
			addParticipant(wsMessage.content.channelId, wsMessage.content.user);
			if (room?.name === wsMessage.content.channelId) {
				const audio = document.getElementById('audio_join_channel') as HTMLMediaElement;
				audio.play();
			}
			break;
		case 'quit_participant':
			removeParticipant(wsMessage.content.channelId, wsMessage.content.user_id);
			if (room?.name === wsMessage.content.channelId) {
				const audio = document.getElementById('audio_quit_channel') as HTMLMediaElement;
				audio.play();
			}
			break;
		case 'participant_status':
			updateParticipantStatus(
				wsMessage.content.channelId,
				wsMessage.content.user_id,
				wsMessage.content.muted,
				wsMessage.content.deafen
			);
			break;
		default:
			break;
	}
}
