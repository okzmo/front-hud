export interface User {
	id: string;
	email: string;
	password: string;
	username: string;
	display_name: string;
	avatar: string;
	banner: string;
	status: string;
	about_me: string;
	created_at: string;
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
}

export interface Message {
	id: string;
	author: User;
	channel_id: string;
	content: string;
	edited: boolean;
	updated_at: string;
}

export interface MessageUI {
	id: string;
	author: User;
	channel_id: string;
	content: string;
	edited: boolean;
	updated_at: string;
	groupWithPrevious: boolean;
	groupWithAfter: boolean;
}

export interface Notification {
	id: string;
	user_id: string;
	type: 'friend_request' | 'new_video';
	message: string;
	created_at: string;
	initiator_id?: string;
	request_id?: string;
}
