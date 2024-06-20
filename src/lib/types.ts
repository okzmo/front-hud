import type { JSONContent } from '@tiptap/core';

export interface User {
	id: string;
	email: string;
	password: string;
	username: string;
	display_name: string;
	username_color?: string;
	avatar: string;
	banner: string;
	status: string;
	about_me: string;
	created_at: string;
	deafen: boolean;
	muted: boolean;
	talking: boolean;
}

export interface Server {
	id: string;
	name: string;
	icon: string;
	banner: string;
	categories: Category[];
	roles?: string[];
	created_at: string;
}

export interface Category {
	name: string;
	channels: Channel[];
}

export interface Channel {
	id: string;
	name: string;
	type: string;
	private: boolean;
	created_at: string;
	participants: User[];
}

export interface Message {
	id: string;
	author: User;
	channel_id: string;
	content: JSONContent;
	edited: boolean;
	images: string[];
	updated_at: string;
}

export interface MessageUI {
	id: string;
	author: User;
	channel_id: string;
	content: JSONContent;
	edited: boolean;
	updated_at: string;
	groupWithPrevious: boolean;
	images: string[];
	groupWithAfter: boolean;
}

export interface Notification {
	id: string;
	user_id: string;
	type: 'friend_request' | 'new_video' | 'new_message';
	message: string;
	created_at: string;
	initiator_id?: string;
	request_id?: string;
	channel_id?: string;
	counter?: number;
	server_id?: string;
}

export interface MessageCache {
	[channelId: string]: {
		messages: Message[];
		scrollPosition: number;
		date: number;
	};
}

export interface ServersState {
	[serverId: string]: ServerState;
}

export interface ServerState {
	categories: {
		[categoryName: string]: {
			isOpen: boolean;
		};
	};
	lastVisited: string;
}
