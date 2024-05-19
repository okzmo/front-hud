import { notifications, messages, friends } from './stores';
import type { Message, Notification, User } from './types';

export function treatMessage(message: any) {
	const wsMessage = JSON.parse(message);
	switch (wsMessage.type) {
		case 'text_message':
			const newMessage: Message = wsMessage.content;
			const pathname = window.location.pathname;
			if (
				pathname.includes(newMessage.channel_id) ||
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
		default:
			console.log(message);
			break;
	}
}
