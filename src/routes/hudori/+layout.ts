import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { friendRequestSchema } from '$lib/components/friends/schema-friend-request';
import { friends, servers, sessStore, user } from '$lib/stores';
import { fetch } from '@tauri-apps/api/http';
import type { Server, User } from '$lib/types';

export const load = async () => {
	console.log('calleed');
	const sessionId = await sessStore.get('sessionId');
	console.log(sessionId);

	const responseUser = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${sessionId}`
		}
	});
	const userData = responseUser.data as { user: User; message: string };

	if (!responseUser.ok) {
		throw new Error(`error on validating session: ${responseUser.status}, ${userData.message}`);
	}

	user.set(userData.user);

	const userId = userData.user.id.split(':')[1];

	const friendsEndpoint = `api/v1/friends/${userId}`;
	const serversEndpoint = `api/v1/servers/${userId}`;

	try {
		const [friendsResponse, serversResponse] = await Promise.all([
			fetch(`${import.meta.env.VITE_API_URL}/${friendsEndpoint}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${sessionId}`
				}
			}),
			fetch(`${import.meta.env.VITE_API_URL}/${serversEndpoint}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${sessionId}`
				}
			})
		]);

		const friendsData = friendsResponse.data as { message: string; friends: User[] };
		const serversData = serversResponse.data as { message: string; servers: Server[] };

		if (!friendsResponse.ok || !serversResponse.ok) {
			throw new Error(
				`error on validating session: ${friendsResponse.status}, ${friendsData.message}`
			);
		}

		friends.set(friendsData.friends);
		servers.update((cache) => {
			serversData.servers.forEach((server) => {
				cache[server.id] = { ...server };
			});
			return cache;
		});

		return {
			props: {
				formFriendRequest: await superValidate(zod(friendRequestSchema))
			}
		};
	} catch (error) {
		console.log(error);
	}
};
