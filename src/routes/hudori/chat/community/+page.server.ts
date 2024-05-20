import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		// const sessionId = cookies.get('session');
		console.log(request);

		// const body = {
		// 	receiver_username,
		// 	initiator_username,
		// 	initiator_id
		// };

		// try {
		// 	const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/friends/add`, {
		// 		method: 'POST',
		// 		credentials: 'include',
		// 		headers: {
		// 			Cookie: `session=${sessionId}`,
		// 			'Content-Type': 'application/json',
		// 			accept: 'application/json'
		// 		},
		// 		body: JSON.stringify(body)
		// 	});
		//
		// 	const data = await response.json();
		//
		// 	if (!response.ok) {
		// 		return setError(form, data.name, data.message);
		// 	}
		// } catch (error) {
		// 	console.log(error);
		// 	return fail(500, { message: 'An unexpected error occurred' });
		// }
	}
};
