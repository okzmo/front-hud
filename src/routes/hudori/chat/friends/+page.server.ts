import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const initiator_username = data.get('initiator_username');
		const initiator_id = data.get('initiator_id');
		const receiver_username = data.get('username');
		const sessionId = cookies.get('session');

		if (!receiver_username) {
			return fail(400, { receiver_username, missing: true });
		}

		const body = {
			receiver_username,
			initiator_username,
			initiator_id
		};

		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/friends/add`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					Cookie: `session=${sessionId}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(`${response.status}-${data.message}`);
			}
		} catch (error) {
			console.log(error);
			const errorMess = error.message.split('-')[1];
			return fail(400, { message: errorMess });
		}

		return { success: true };
	}
};
