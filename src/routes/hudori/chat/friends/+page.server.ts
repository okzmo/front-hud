import { friendRequestSchema } from '$lib/components/friends/schema-friend-request';
import { fail, type Actions } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(friendRequestSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const initiator_id = formData.get('initiator_id');
		const initiator_username = formData.get('initiator_username');
		const receiver_username = form.data.username;
		const sessionId = cookies.get('session');

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
					'Content-Type': 'application/json',
					accept: 'application/json'
				},
				body: JSON.stringify(body)
			});

			const data = await response.json();

			if (!response.ok) {
				return setError(form, data.name, data.message);
			}
		} catch (error) {
			console.log(error);
			return fail(500, { message: 'An unexpected error occurred' });
		}
	}
};
