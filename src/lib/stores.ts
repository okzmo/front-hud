import { type Writable, writable } from 'svelte/store';
import type { User, Server, Message, Notification } from './types';
import { getContext, setContext } from 'svelte';
import { type SuperValidated, type Infer } from 'sveltekit-superforms';
import type { FriendRequestFormSchema } from './components/friends/schema-friend-request';

const USER_CTX = 'user';
const SERVERS_CTX = 'servers';
const FRIENDS_CTX = 'friends';
const NOTIF_CTX = 'notifications';

export const server = writable<Server | undefined>();
export const servers = writable<Server[]>();
export const user = writable<User | undefined>();
export const messages = writable<Message[]>();
export const notifications = writable<Notification[]>();
export const friends = writable<User[]>();
export const friendRequest = writable<SuperValidated<Infer<FriendRequestFormSchema>>>();

export function setUserState(initData: User | undefined) {
	user.set(initData);
	setContext(USER_CTX, user);
	return user;
}
export function getUserState() {
	return getContext<Writable<User | undefined>>(USER_CTX);
}

export function setServersState(initData: Server[]) {
	servers.set(initData);
	setContext(SERVERS_CTX, servers);
	return servers;
}
export function getServersState() {
	return getContext<Writable<Server[]>>(SERVERS_CTX);
}

export function setFriendsState(initData: User[]) {
	friends.set(initData);
	setContext(FRIENDS_CTX, friends);
	return friends;
}
export function getFriendsState() {
	return getContext<Writable<User[]>>(FRIENDS_CTX);
}

export function setNotificationsState(initData: Notification[]) {
	notifications.set(initData);
	setContext(NOTIF_CTX, notifications);
	return notifications;
}
export function getNotificationsState() {
	return getContext<Writable<Notification[]>>(NOTIF_CTX);
}
