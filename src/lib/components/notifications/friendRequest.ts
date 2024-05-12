import type { User } from '$lib/types';

export async function addFriend(
	ev: Event,
	initiator_id: string,
	initiator_username: string,
	receiver_username: string
) {
	ev.preventDefault();

	const body = {
		initiator_id,
		initiator_username,
		receiver_username
	};

	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/friends/add`, {
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			throw new Error(`error occured when accepting friend request ${response.status}`);
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.log(error);
	}
}

export async function acceptFriendRequest(
	request_id: string,
	notif_id: string
): Promise<User | undefined> {
	const body = {
		request_id: request_id,
		id: notif_id
	};

	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/friends/accept`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			throw new Error(`error occured when accepting friend request ${response.status}`);
		}

		const data = await response.json();

		return data.friend;
	} catch (error) {
		console.log(error);
	}
}

export async function refuseFriendRequest(request_id: string, notif_id: string): Promise<boolean> {
	const body = {
		request_id: request_id,
		id: notif_id
	};

	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/friends/refuse`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			throw new Error(`error occured when refusing friend request ${response.status}`);
		}
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
}
