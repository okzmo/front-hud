import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const sessionId = cookies.get('session');

	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/server/${params.serverId}`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				Cookie: `session=${sessionId}`
			}
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(`error on validating session: ${response.status}`);
		}

		return { server: data.server };
	} catch (error) {
		console.log(error);
	}
};