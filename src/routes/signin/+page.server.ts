import { fail, setError, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect, type Actions } from '@sveltejs/kit';
import { signinFormSchema } from '$lib/components/connection/schema-signin';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(303, '/hudori/chat/friends');
	}

	return {
		form: await superValidate(zod(signinFormSchema))
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(signinFormSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signin`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-User-Agent': request.headers.get('user-agent')
				},
				body: JSON.stringify(form.data)
			});

			const data = await response.json();
			if (!response.ok) {
				return setError(form, data.name, data.message);
			}

			const setCookieHeader = response.headers.get('set-cookie');
			if (setCookieHeader) {
				const cookieParts = setCookieHeader.split(';').map((part) => part.trim());
				const [cookieNameValue, ...options] = cookieParts;
				const [name, value] = cookieNameValue.split('=');

				cookies.set(name, value, {
					path: '/',
					httpOnly: true,
					expires: new Date(options[2].split('=')[1]),
					domain: import.meta.env.VITE_COOKIE_DOMAIN,
					sameSite: 'none',
					secure: true,
					encode: (val) => val
				});
			}
		} catch (err) {
			console.log(err);
			return fail(500, { error: 'An unexpected error occured.' });
		}

		throw redirect(303, '/hudori/chat/friends');
	}
};
