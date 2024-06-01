import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { notifications, messages, friends, server, servers } from './stores';
import type { Channel, Message, Notification, User } from './types';

export function treatMessage(message: any) {
	const wsMessage = JSON.parse(message);
	switch (wsMessage.type) {
		case 'text_message':
			console.log(wsMessage);
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
			const newFR: Notification = wsMessage.content;
			notifications.update((notifications) => {
				notifications.unshift(newFR);
				return notifications;
			});

			break;
		case 'friend_accept':
			const friend: User = wsMessage.content;
			friends.update((friends) => {
				friends.push(friend);
				return friends;
			});

			break;
		case 'create_channel':
			const newChannel: { channel: Channel; category_name: string } = wsMessage.content;
			server.update((server) => {
				const category = server?.categories.find(
					(category) => category.name === newChannel.category_name
				);
				category?.channels.push(newChannel.channel);
				return server;
			});
			break;
		case 'delete_channel':
			const oldChannel: { channel_id: string; category_name: string } = wsMessage.content;
			server.update((server) => {
				let category = server?.categories.find(
					(category) => category.name === oldChannel.category_name
				);
				const chanIdx = category?.channels.findIndex(
					(channel) => channel.id === oldChannel.channel_id
				)!;
				category?.channels.splice(chanIdx, 1);
				return server;
			});

			if (window.location.pathname.includes(oldChannel.channel_id.split(':')[1])) {
				const serverInfos = get(server);
				const serverId = serverInfos?.id.split(':')[1];
				const chanId = serverInfos?.categories[0].channels[0].id.split(':')[1];
				goto(`/hudori/chat/community/${serverId}/channels/${chanId}`);
			}
			break;
		case 'create_category':
			const catName: string = wsMessage.content;
			server.update((server) => {
				server?.categories.push({ name: catName, channels: [] });
				return server;
			});
			break;
		case 'delete_category':
			const categoryName: string = wsMessage.content;
			server.update((server) => {
				let catIdx = server?.categories.findIndex((category) => category.name === categoryName)!;
				server?.categories.splice(catIdx, 1);
				return server;
			});
			break;
		case 'friend_remove':
			const userId: string = wsMessage.content;
			friends.update((friends) => {
				const newArr = friends.filter((friend) => friend.id !== userId);
				return newArr;
			});
			if (window.location.pathname.includes(userId.split(':')[1])) {
				goto('/hudori/chat/friends');
			}
			break;
		case 'delete_server':
			const serverId: string = wsMessage.content;
			servers.update((servers) => {
				const serverIdx = servers.findIndex((server) => server.id === serverId)!;
				servers.splice(serverIdx, 1);
				return servers;
			});
			if (window.location.pathname.includes(serverId.split(':')[1])) {
				goto('/hudori/chat/friends');
			}
			break;
		default:
			console.log(message);
			break;
	}
}
