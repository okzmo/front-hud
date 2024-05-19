import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session');
	const isAuthPage = event.url.pathname === '/signin' || event.url.pathname === '/signup';
	const isHudoriPage = event.url.pathname.startsWith('/hudori');

	if (isAuthPage || isHudoriPage) {
		try {
			const responseUser = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					Cookie: `session=${sessionId}`
				}
			});

			const data = await responseUser.json();

			if (!responseUser.ok) {
				throw new Error(`invalid session: ${responseUser.status}, ${data.message}`);
			}

			event.locals.user = data.user;
		} catch (err) {
			// console.log(err);
			if (!isAuthPage) {
				redirect(303, '/signin');
			}
		}
	}

	return resolve(event);
};
