import { messages, notifications, user } from './stores';
import { get } from 'svelte/store';
import type { Message } from './types';
import { page } from '$app/stores';

export async function getProfile(own_id: string | undefined, user_id: string) {
	const cache = await caches.open('user_profile');
	const cachedResponse = await cache.match(
		`${import.meta.env.VITE_API_URL}/api/v1/user/${user_id}`
	);

	if (cachedResponse) {
		const cacheTimestamp = cachedResponse.headers.get('X-Cache-Timestamp');
		const expirationTime = 30 * 1000;
		if (cacheTimestamp && Date.now() - parseInt(cacheTimestamp, 10) > expirationTime) {
			await cache.delete(`${import.meta.env.VITE_API_URL}/api/v1/user/${user_id}`);
		} else {
			const data = await cachedResponse.json();
			return data.user;
		}
	}
	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/${user_id}`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'X-User-Agent': navigator.userAgent,
				'X-User-ID': own_id
			}
		});

		if (!response.ok) {
			throw new Error('Error occured when fetching profile.');
		}

		const data = await response.json();

		const headers = new Headers({
			'Content-Type': 'application/json',
			'X-Cache-Timestamp': Date.now().toString()
		});

		await cache.put(
			`${import.meta.env.VITE_API_URL}/api/v1/user/${user_id}`,
			new Response(JSON.stringify(data), { headers })
		);

		return data.user;
	} catch (error) {
		console.error(error);
	}
}

export async function getMessages(params: any): Promise<Message[] | undefined> {
	// const messagesCache = get(messages);
	const userStore = get(user);
	const channelId = params.channelId ? params.channelId : params.id;
	const offset = params.offset || 0;
	const limit = params.limit || 25;
	if (!channelId) return;
	// if (messagesCache && messagesCache[channelId]) {
	// 	return messagesCache[channelId].messages;
	// }

	const channelUrl = `${import.meta.env.VITE_API_URL}/api/v1/messages/${channelId}?limit=${limit}&before=${offset}`;
	const friendUrl = `${import.meta.env.VITE_API_URL}/api/v1/messages/${channelId}/private/${userStore?.id.split(':')[1]}?limit=${limit}&before=${offset}`;

	try {
		const response = await fetch(params.channelId ? channelUrl : friendUrl, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'X-User-ID': userStore?.id
			}
		});
		const data = await response.json();

		return data.messages;
	} catch (error) {
		console.error('Error fetching messages:', error);
	}
}

export const mergeObj = (target: Object, source: Object) => {
	for (let key in source) {
		if (!target.hasOwnProperty(key)) {
			target[key] = source[key];
		}
	}

	return target;
};

export async function typing(status: string) {
	const userInfos = get(user);
	const pageInfos = get(page);

	const body = {
		user_id: userInfos.id,
		channel_id: pageInfos.params.id || pageInfos.params.channelId,
		display_name: userInfos.display_name,
		status: status
	};

	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/channels/typing`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
				'X-User-ID': userInfos?.id
			}
		});

		if (!response.ok) {
			throw new Error(`typing error ${response.status}`);
		}

		return;
	} catch (err) {
		console.log(err);
	}
}

export function syncNotifications() {
	const userInfos = get(user);
	const notifInfos = get(notifications);
	if (!userInfos || !notifInfos) return;

	fetch(`${import.meta.env.VITE_API_URL}/api/v1/notifications/message_update`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'X-User-ID': userInfos.id,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			user_id: userInfos.id,
			channels: notifInfos
				.filter((notif) => notif.type === 'new_message' && notif.read)
				.map((notif) => notif.channel_id)
		})
	});
}

let syncTimeout;
export function scheduleSync() {
	clearTimeout(syncTimeout);
	syncTimeout = setTimeout(syncNotifications, 5000); // Sync every 5 seconds
}

export function changeStatusOffline() {
	const userInfos = get(user);
	if (!userInfos) return;

	fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/change_status`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'X-User-ID': userInfos?.id,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ user_id: userInfos.id, status: 'offline' })
	});
}

export async function fetchNotifs() {
	const userInfos = get(user);
	if (!userInfos) return;

	try {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/api/v1/notifications/${userInfos.id.split(':')[1]}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					'X-User-ID': userInfos?.id
				}
			}
		);

		if (!response.ok) {
			throw new Error("couldn't fetch notifications");
		}

		const data = await response.json();
		notifications.set(data.notifications);
	} catch (error) {
		console.log(error);
	}
}

export async function createInvitation() {
	const userInfos = get(user);
	const pageInfos = get(page);
	if (!userInfos || !pageInfos) return;

	const endpoint = `${import.meta.env.VITE_API_URL}/api/v1/invites/create`;
	let body: any = {
		user_id: userInfos.id,
		server_id: 'servers:' + pageInfos.params.serverId
	};

	try {
		const response = await fetch(endpoint, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'X-User-ID': userInfos.id
			},
			body: JSON.stringify(body)
		});
		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message);
		}

		return data.id;
	} catch (e) {
		console.log(e);
	}
}
