import { get, writable } from 'svelte/store';
import type { User, Server, Message, Notification, ServersState } from './types';
import { type SuperValidated, type Infer } from 'sveltekit-superforms';
import type { FriendRequestFormSchema } from './components/friends/schema-friend-request';
import { browser } from '$app/environment';
import type { Room } from 'livekit-client';

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
export const wsConn = writable<WebSocket | undefined>();
export const vcRoom = writable<Room | undefined>();
export const mutedState = writable({ muteHead: false, muteMic: false });

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

export const addParticipant = (channelId: string, user: User) => {
	server.update((server) => {
		let channel;
		for (const category of server?.categories) {
			channel = category.channels.find((channel) => channel.id === channelId);
			if (channel) {
				if (channel.participants) {
					channel.participants.push(user);
				} else {
					channel.participants = [user];
				}
				break;
			}
		}
		return server;
	});

	const serverInfos = get(server);
	const states = get(mutedState);
	const ws = get(wsConn);
	const wsMessStatus = {
		type: 'participant_status',
		content: {
			user_id: user?.id,
			serverId: serverInfos?.id,
			channelId: channelId,
			muted: states.muteMic,
			deafen: states.muteHead
		}
	};
	ws?.send(JSON.stringify(wsMessStatus));
};

export const removeParticipant = (channelId: string, userId: string) => {
	server.update((server) => {
		let channel;
		for (const category of server?.categories) {
			channel = category.channels.find((channel) => channel.id === channelId);
			if (channel) {
				if (channel.participants.length > 1) {
					const participantIdx = channel.participants.findIndex(
						(participant) => participant.id === userId
					);
					channel.participants.splice(participantIdx, 1);
				} else {
					channel.participants = [];
				}
				break;
			}
		}

		return server;
	});
};

export const participantExist = (channelId: string, userId: string) => {
	const serverInfos = get(server);
	let channel;
	let idx;
	for (const category of serverInfos?.categories) {
		channel = category.channels.find((channel) => channel.id === channelId);
		if (channel) {
			idx = channel.participants?.find((participant) => participant.id === userId);
		}
	}

	return idx;
};

export const updateParticipantStatus = (
	channelId: string,
	userId: string,
	muted: boolean,
	deafen: boolean
) => {
	server.update((server) => {
		let channel;
		for (const category of server?.categories) {
			channel = category.channels.find((channel) => channel.id === channelId);
			if (channel) {
				const participant = channel.participants?.find((participant) => participant.id === userId);
				if (participant) {
					participant.muted = muted;
					participant.deafen = deafen;
				}
				break;
			}
		}

		return server;
	});
};
