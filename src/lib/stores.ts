import { writable } from 'svelte/store';
import type { User, Server, Message, Notification, ServerState, ServersState } from './types';
import { type SuperValidated, type Infer } from 'sveltekit-superforms';
import type { FriendRequestFormSchema } from './components/friends/schema-friend-request';
import { browser } from '$app/environment';

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

// chat input (tiptap)
export const editorState = writable<{ [key: string]: string }>({});
export const updateChatInputState = (route: string, content: string) => {
	editorState.update((state) => {
		return { ...state, [route]: content };
	});
};
export const getChatInputState = (route: string) => {
	let state;
	editorState.subscribe((value) => {
		state = value[route] || '';
	})();
	return state;
};

// serverState
export const serversStateStore = writable<ServersState>({});
if (browser) {
	if (localStorage.getItem('states')) {
		const states = JSON.parse(localStorage.getItem('states')!);
		serversStateStore.set(states);
	}
}

export const updateCategoryState = (serverId: string, categoryName: string, isOpen: boolean) => {
	serversStateStore.update((state) => {
		if (!state[serverId]) {
			state[serverId] = { categories: {}, lastVisited: '' };
		}
		state[serverId].categories[categoryName] = { isOpen };
		return state;
	});
};

export const updateLastVisited = (serverId: string, channelId: string) => {
	serversStateStore.update((state) => {
		if (!state[serverId]) {
			state[serverId] = { categories: {}, lastVisited: '' };
		}
		state[serverId].lastVisited = channelId;
		return state;
	});
};

export const getLastVisited = (serverId: string) => {
	let lastVisited: string = '';
	serversStateStore.subscribe((state) => {
		lastVisited = state[serverId]?.lastVisited ?? lastVisited;
	})();
	return lastVisited;
};

export const getCategoryState = (serverId: string, categoryName: string) => {
	let categoryState: boolean = true;
	serversStateStore.subscribe((state) => {
		categoryState = state[serverId]?.categories[categoryName]?.isOpen ?? categoryState;
	})();
	return categoryState;
};
