import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
	const friendsEndpoint = 'api/v1/friends';
	const serversEndpoint = 'api/v1/servers';
	const notificationsEndpoint = 'api/v1/notifications';

	const sessionId = cookies.get('session');
	const user = locals.user;
	const userId = user.id.split(':')[1];

	try {
		const [friendsResponse, serversResponse, notificationsResponse] = await Promise.all([
			fetch(`${import.meta.env.VITE_API_URL}/${friendsEndpoint}/${userId}`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					Cookie: `session=${sessionId}`,
					'Content-Type': 'application/json'
				}
			}),
			fetch(`${import.meta.env.VITE_API_URL}/${serversEndpoint}/${userId}`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					Cookie: `session=${sessionId}`,
					'Content-Type': 'application/json'
				}
			}),
			fetch(`${import.meta.env.VITE_API_URL}/${notificationsEndpoint}/${userId}`, {
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
		const notificationsData = await notificationsResponse.json();

		if (!friendsResponse.ok || !serversResponse.ok || !notificationsResponse.ok) {
			throw new Error(
				`error on validating session: ${friendsResponse.status}, ${friendsData.message}`
			);
		}

		return {
			props: {
				user,
				friends: friendsData.friends,
				servers: serversData.servers,
				notifications: notificationsData.notifications
			}
		};
	} catch (error) {
		console.log(error);
	}
};
