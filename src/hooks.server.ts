import { redirect, type Handle, type HandleFetch } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session');
	const isAuthPage = event.url.pathname === '/signin' || event.url.pathname === '/signup';
	const isHudoriPage = event.url.pathname.startsWith('/hudori');

	event.locals.userAgent = event.request.headers.get('user-agent');

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

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	const headers = new Headers(request.headers);

	if (event.locals.userAgent) {
		headers.set('X-User-Agent', event.locals.userAgent);
	}

	if (event.locals.user) {
		headers.set('X-User-ID', event.locals.user.id);
	}

	const modifiedRequest = new Request(request, {
		headers: headers
	});

	return fetch(modifiedRequest);
};
