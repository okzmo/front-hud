import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params, locals }) => {
	const sessionId = cookies.get('session');
	const userId: string | undefined = locals.user.id;

	try {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/api/v1/messages/${params.id}/private/${userId?.split(':')[1]}`,
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

		return { messages: data.messages };
	} catch (error) {
		console.log(error);
	}
};
