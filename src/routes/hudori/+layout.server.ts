import { superValidate } from 'sveltekit-superforms';
import type { LayoutServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { friendRequestSchema } from '$lib/components/friends/schema-friend-request';

export const load: LayoutServerLoad = async ({ cookies, locals, fetch }) => {
	const user = locals.user;
	const userId = user.id.split(':')[1];

	const friendsEndpoint = `api/v1/friends/${userId}`;
	const serversEndpoint = `api/v1/servers/${userId}`;
	const sessionId = cookies.get('session');

	try {
		const [friendsResponse, serversResponse] = await Promise.all([
			fetch(`${import.meta.env.VITE_API_URL}/${friendsEndpoint}`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					Cookie: `session=${sessionId}`,
					'Content-Type': 'application/json'
				}
			}),
			fetch(`${import.meta.env.VITE_API_URL}/${serversEndpoint}`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					Cookie: `session=${sessionId}`,
					'Content-Type': 'application/json'
				}
			})
		]);

		const friendsData = await friendsResponse.json();
		const serversData = await serversResponse.json();

		if (!friendsResponse.ok || !serversResponse.ok) {
			throw new Error(
				`error on validating session: ${friendsResponse.status}, ${friendsData.message}`
			);
		}

		return {
			props: {
				user,
				friends: friendsData.friends,
				servers: serversData.servers,
				formFriendRequest: await superValidate(zod(friendRequestSchema))
			}
		};
	} catch (error) {
		console.log(error);
	}
};
