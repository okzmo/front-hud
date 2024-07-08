import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { contextMenuInfo, messages, notifications, user } from './stores';
import { get } from 'svelte/store';
import type { Message } from './types';
import { page } from '$app/stores';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export function formatISODate(isoDate: string): string {
	const date = new Date(isoDate);
	const now = new Date();

	// If the date is today or yesterday
	if (date.toDateString() === now.toDateString()) {
		return `Today, ${date.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
	} else {
		const yesterday = new Date(now);
		yesterday.setDate(yesterday.getDate() - 1);
		if (date.toDateString() === yesterday.toDateString()) {
			return `Yesterday, ${date.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
		}
	}

	// If the date is older than yesterday
	return (
		date.toLocaleDateString('en', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		}) +
		' ' +
		date.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit', hour12: true })
	);
}

export function formatError(message: string): string {
	return message[0].toUpperCase() + message.slice(1) + '.';
}

export function manageTooltip(node: HTMLAnchorElement) {
	const handleMouseOver = (ev: MouseEvent) => {
		const link = ev.currentTarget as HTMLAnchorElement;
		if (link.hostname === window.location.hostname) {
			link.setAttribute('data-internal', 'true');
		} else {
			link.removeAttribute('data-internal');
		}
	};

	node.addEventListener('mouseover', handleMouseOver);

	return {
		destroy() {
			node.removeEventListener('mouseover', handleMouseOver);
		}
	};
}

export function handleContextMenu(id: string, roles: string[] | undefined = undefined) {
	const informations = {
		id: id,
		roles: roles
	};
	contextMenuInfo.set(informations);
}

export function generateRandomId(length = 5): string {
	return Math.random()
		.toString(36)
		.substring(2, 2 + length);
}

export function debounce<T extends (...args: any[]) => Promise<any>>(
	func: T,
	wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
	let timeout: ReturnType<typeof setTimeout> | null = null;
	let pendingPromise: Promise<ReturnType<T>> | null = null;

	return function (this: any, ...args: Parameters<T>): Promise<ReturnType<T>> {
		if (pendingPromise) {
			return pendingPromise;
		}

		const executeFunction = () => {
			const result = func.apply(this, args);
			return result instanceof Promise ? result : Promise.resolve(result);
		};

		if (timeout !== null) {
			clearTimeout(timeout);
		}

		return new Promise((resolve) => {
			timeout = setTimeout(() => {
				pendingPromise = executeFunction().finally(() => {
					pendingPromise = null;
				});
				resolve(pendingPromise);
			}, wait);
		});
	};
}

export async function removeCachedProfile(user_id: string) {
	const cache = await caches.open('user_profile');
	const cachedResponse = await cache.match(
		`${import.meta.env.VITE_API_URL}/api/v1/user/${user_id}`
	);

	if (cachedResponse) {
		await cache.delete(`${import.meta.env.VITE_API_URL}/api/v1/user/${user_id}`);
	}
}

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

export async function getMessagesCache(channel_id: string) {
	const cache = await caches.open('message-cache');
	const cachedResponse = await cache.match(
		`${import.meta.env.VITE_API_URL}/api/v1/messages/${channel_id}`
	);

	if (cachedResponse) {
		const cacheTimestamp = cachedResponse.headers.get('X-Cache-Timestamp');
		const expirationTime = 2 * 60 * 60 * 1000;
		if (cacheTimestamp && Date.now() - parseInt(cacheTimestamp, 10) > expirationTime) {
			await cache.delete(`${import.meta.env.VITE_API_URL}/api/v1/messages/${channel_id}`);
		} else {
			const data = await cachedResponse.json();
			return data.messages;
		}
	}
}

export async function addMessageToCache(channel_id: string) {
	const cache = await caches.open('user_profile');
	const cachedResponse = await cache.match(
		`${import.meta.env.VITE_API_URL}/api/v1/messages/${channel_id}`
	);

	if (cachedResponse) {
		const cacheTimestamp = cachedResponse.headers.get('X-Cache-Timestamp');
		const expirationTime = 2 * 60 * 60 * 1000;
		if (cacheTimestamp && Date.now() - parseInt(cacheTimestamp, 10) > expirationTime) {
			await cache.delete(`${import.meta.env.VITE_API_URL}/api/v1/messages/${channel_id}`);
		} else {
			const data = await cachedResponse.json();

			const headers = new Headers({
				'Content-Type': 'application/json',
				'X-Cache-Timestamp': Date.now().toString()
			});

			await cache.put(
				`${import.meta.env.VITE_API_URL}/api/v1/messages/${channel_id}`,
				new Response(JSON.stringify(data), { headers })
			);
			return data.messages;
		}
	}
}

export async function getMessages(params: any): Promise<Message[] | undefined> {
	const messagesCache = get(messages);
	const userStore = get(user);
	const channelId = params.channelId ? params.channelId : params.id;
	if (!channelId) return;
	if (messagesCache && messagesCache[channelId]) {
		return messagesCache[channelId].messages;
	}

	const channelUrl = `${import.meta.env.VITE_API_URL}/api/v1/messages/${channelId}`;
	const friendUrl = `${import.meta.env.VITE_API_URL}/api/v1/messages/${channelId}/private/${userStore?.id.split(':')[1]}`;

	try {
		const response = await fetch(params.channelId ? channelUrl : friendUrl, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'X-User-ID': userStore?.id
			}
		});
		const data = await response.json();

		messages.update((cache) => {
			cache[channelId] = {
				messages: data.messages,
				date: Date.now()
			};
			return cache;
		});
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
