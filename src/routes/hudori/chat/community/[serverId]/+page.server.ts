import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, locals, params, fetch }) => {
	const sessionId = cookies.get('session');
	const user = locals.user;
	const userId = user.id.split(':')[1];

	try {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/api/v1/server/${userId}/${params.serverId}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: {
					Cookie: `session=${sessionId}`
				}
			}
		);

		const data = await response.json();

		if (!response.ok) {
			throw new Error(`error on validating session: ${response.status}`);
		}

		return { server: data.server };
	} catch (error) {
		console.log(error);
	}
};
