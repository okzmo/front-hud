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
	vcRoom,
	user
} from './stores';
import protobuf from 'protobufjs';
import { decompress } from 'brotli-dec-wasm/web';

export async function treatMessage(message: ArrayBuffer) {
	const protoResponse = await fetch('/proto/message.proto');
	if (!protoResponse.ok) {
		throw new Error(`HTTP error! status: ${protoResponse.status}`);
	}
	const protoContent = await protoResponse.text();

	const root = protobuf.parse(protoContent, { keepCase: true }).root;
	const messProto = root.lookupType('hudori.WSMessage');

	const decompressed = decompress(new Uint8Array(message));
	const decoded = messProto.decode(decompressed);
	const wsMessage = decoded.toJSON();

	switch (wsMessage.type) {
		case 'text_message':
			const newMessage = wsMessage.mess;
			const pathname = window.location.pathname;
			const ownId = get(user);
			const channelId =
				newMessage.channel_id.split(':')[1] === ownId?.id.split(':')[1]
					? newMessage.author.id.split(':')[1]
					: newMessage.channel_id.split(':')[1];

			messages.update((cache) => {
				if (cache[channelId] && cache[channelId].messages) {
					cache[channelId].messages.push(newMessage);
					cache[channelId].scrollPosition = undefined;
				}
				return cache;
			});

			if (!pathname.includes(channelId)) {
				notifications.update((notifications) => {
					const notif = notifications.find(
						(notification) =>
							notification.user_id === wsMessage.notification.user_id &&
							notification.channel_id === wsMessage.notification.channel_id
					);
					if (!notif) {
						notifications.push(wsMessage.notification);
					} else if (notif && wsMessage.notification.mentions) {
						notif.mentions = wsMessage.notification.mentions;
						notif.counter += 1;
					} else {
						notif.counter += 1;
					}

					messages.update((cache) => {
						if (cache[channelId]) {
							cache[channelId].scrollPosition = undefined;
						}
						return cache;
					});

					return notifications;
				});
			}
			break;
		case 'friend_request':
			notifications.update((notifications) => {
				notifications.unshift(wsMessage.friend_request);
				return notifications;
			});

			break;
		case 'friend_accept':
			friends.update((friends) => {
				friends.push(wsMessage.friend_accept);
				return friends;
			});

			break;
		case 'create_channel':
			server.update((server) => {
				const category = server?.categories.find(
					(category) => category.name === wsMessage.channel.category_name
				);
				category?.channels.push(wsMessage.channel.channel);
				return server;
			});
			break;
		case 'delete_channel':
			server.update((server) => {
				let category = server?.categories.find(
					(category) => category.name === wsMessage.delchannel.category_name
				);
				const chanIdx = category?.channels.findIndex(
					(channel) => channel.id === wsMessage.delchannel.channel_id
				)!;
				category?.channels.splice(chanIdx, 1);
				return server;
			});

			if (window.location.pathname.includes(wsMessage.delchannel.channel_id.split(':')[1])) {
				const serverInfos = get(server);
				const serverId = serverInfos?.id.split(':')[1];
				const chanId = serverInfos?.categories[0].channels[0].id.split(':')[1];
				goto(`/hudori/chat/community/${serverId}/channels/${chanId}`);
			}
			break;
		case 'create_category':
			server.update((server) => {
				server?.categories.push({ name: wsMessage.category_name, channels: [] });
				return server;
			});
			break;
		case 'delete_category':
			server.update((server) => {
				let catIdx = server?.categories.findIndex(
					(category) => category.name === wsMessage.category_name
				)!;
				server?.categories.splice(catIdx, 1);
				return server;
			});
			break;
		case 'friend_remove':
			friends.update((friends) => {
				const newArr = friends.filter((friend) => friend.id !== wsMessage.user_id);
				return newArr;
			});
			if (window.location.pathname.includes(wsMessage.user_id.split(':')[1])) {
				goto('/hudori/chat/friends');
			}
			break;
		case 'delete_server':
			servers.update((servers) => {
				const serverIdx = servers.findIndex((server) => server.id === wsMessage.server_id)!;
				servers.splice(serverIdx, 1);
				return servers;
			});
			if (window.location.pathname.includes(wsMessage.server_id.split(':')[1])) {
				goto('/hudori/chat/friends');
			}
			break;
		case 'join_server':
			if (window.location.pathname.includes(wsMessage.join_server.server_id.split(':')[1])) {
				server.update((server) => {
					server?.members.push(wsMessage.join_server.user);
					return server;
				});
			}
			break;
		case 'leave_server':
			if (window.location.pathname.includes(wsMessage.quit_server.server_id.split(':')[1])) {
				server.update((server) => {
					const memberIdx = server?.members.findIndex(
						(server) => server.id === wsMessage.quit_server.user_id
					)!;
					server?.members.splice(memberIdx, 1);
					return server;
				});
			}
			break;
		case 'new_avatar':
			friends.update((friends) => {
				const friend = friends.find((friend) => friend.id === 'users:' + wsMessage.content.user_id);
				if (friend) {
					friend.avatar = wsMessage.content.avatar;
				}
				return friends;
			});
		case 'change_status':
			friends.update((friends) => {
				const friend = friends.find((friend) => friend.id === wsMessage.change_status.user_id);
				if (friend) {
					friend.status = wsMessage.change_status.status;
				}
				return friends;
			});
		default:
			break;
	}
}

export function treatMessageJSON(message: any) {
	const wsMessage = JSON.parse(message);

	const room = get(vcRoom);
	switch (wsMessage.type) {
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
	}
}
