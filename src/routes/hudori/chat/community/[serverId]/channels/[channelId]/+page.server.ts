import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, locals, params, fetch }) => {
	const sessionId = cookies.get('session');
	const user = locals.user;
	const userId = user.id.split(':')[1];

	try {
		const serverPromise = await fetch(
			`${import.meta.env.VITE_API_URL}/api/v1/server/${userId}/${params.serverId}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					Cookie: `session=${sessionId}`
				}
			}
		);

		const serverData = await serverPromise.json();
		console.log(serverData);

		if (!serverPromise.ok) {
			throw new Error(`error on fetching server data: ${serverPromise.status}`);
		}

		return {
			server: serverData.server
		};
	} catch (error) {
		console.log(error);
	}
};
