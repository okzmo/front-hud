import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
  const sessionId = cookies.get('session');

  try {

    const [channelsResponse, messagesResponse] = await Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/v1/server/${params.serverId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Cookie: `session=${sessionId}`
        }
      }),

      fetch(`${import.meta.env.VITE_API_URL}/api/v1/messages/${params.channelId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Cookie: `session=${sessionId}`
        }
      })
    ])


    const channelsData = await channelsResponse.json();
    const messagesData = await messagesResponse.json();

    if (!channelsResponse.ok || !messagesResponse.ok) {
      throw new Error(`error on fetching server data: ${channelsResponse.status}, ${messagesResponse.status}`);
    }

    return {
      props: {
        messages: messagesData.messages,
        server: channelsData.server,
      }
    };
  } catch (error) {
    console.log(error);
  }
};