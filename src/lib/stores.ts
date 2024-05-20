import { writable } from 'svelte/store';
import type { User, Server, Message, Notification } from './types';
import { type SuperValidated, type Infer } from 'sveltekit-superforms';
import type { FriendRequestFormSchema } from './components/friends/schema-friend-request';

type ContextMenuServer = {
	id: string;
	roles?: string[];
};

export const server = writable<Server | undefined>();
export const servers = writable<Server[]>();
export const user = writable<User | undefined>();
export const messages = writable<Message[]>();
export const notifications = writable<Notification[]>();
export const friends = writable<User[]>();
export const contextMenuInfo = writable<ContextMenuServer | undefined>();

export const friendRequest = writable<SuperValidated<Infer<FriendRequestFormSchema>>>();
