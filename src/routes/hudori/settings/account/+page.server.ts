import { redirect, type Actions } from '@sveltejs/kit';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { user } from '$lib/stores';
import type { PageServerLoad } from './$types';
import {
	detailsDisplayNameSchema,
	detailsEmailSchema,
	detailsUsernameSchema
} from '$lib/components/settings/schema-details';

export const load: PageServerLoad = async () => {
	const emailForm = await superValidate(zod(detailsEmailSchema));
	const usernameForm = await superValidate(zod(detailsUsernameSchema));
	const displayNameForm = await superValidate(zod(detailsDisplayNameSchema));

	return { emailForm, usernameForm, displayNameForm };
};

export const actions: Actions = {
	email: async ({ request, fetch }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(detailsEmailSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const user_id = formData.get('user_id');
		const email = form.data.email;

		const body = {
			user_id,
			email
		};

		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/change_email`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});

			const data = await response.json();
			if (!response.ok) {
				return setError(form, data.name, data.message);
			}

			user.update((user) => {
				user!.email = email;
				return user;
			});
		} catch (err) {
			console.log(err);
			return fail(500, { error: 'An unexpected error occured.' });
		}
	},
	username: async ({ request, fetch }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(detailsUsernameSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const user_id = formData.get('user_id');
		const username = form.data.username;

		const body = {
			user_id: user_id,
			username: username
		};

		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/change_username`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});

			const data = await response.json();
			if (!response.ok) {
				return setError(form, data.name, data.message);
			}
		} catch (err) {
			console.log(err);
			return fail(500, { error: 'An unexpected error occured.' });
		}
	},
	display_name: async ({ request, fetch }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(detailsDisplayNameSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const user_id = formData.get('user_id');
		const display_name = form.data.display_name;

		const body = {
			user_id,
			display_name
		};

		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/change_name`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});

			const data = await response.json();
			if (!response.ok) {
				return setError(form, data.name, data.message);
			}

			user.update((user) => {
				user!.display_name = display_name;
				return user;
			});
		} catch (err) {
			console.log(err);
			return fail(500, { error: 'An unexpected error occured.' });
		}
	},
	logout: async ({ cookies, fetch }) => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/logout`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`Couldn't log out the user ${response.status}`);
			}

			cookies.delete('session', { path: '/' });
		} catch (err) {
			console.log(err);
			return fail(500, { error: 'An unexpected error occured.' });
		}

		throw redirect(303, '/signin');
	}
};
