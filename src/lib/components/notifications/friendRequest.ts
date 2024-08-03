import { sessStore, user } from '$lib/stores';
import type { User } from '$lib/types';
import { get } from 'svelte/store';
import { fetch, Body } from '@tauri-apps/api/http';

export async function addFriend(
  ev: Event,
  initiator_id: string,
  initiator_username: string,
  receiver_username: string
) {
  ev.preventDefault();

  const body = {
    initiator_id,
    initiator_username,
    receiver_username
  };

  try {
    const sessionId = await sessStore.get("sessionId")
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/friends/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': initiator_id,
        'Authorization': `Bearer ${sessionId}`
      },
      body: Body.json(body),
    });

    if (!response.ok) {
      throw new Error(`error occured when accepting friend request ${response.status}`);
    }

    const data = response.data

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function acceptFriendRequest(
  request_id: string,
  notif_id: string
): Promise<any | undefined> {
  const body = {
    request_id: request_id,
    id: notif_id
  };

  const userId = get(user)?.id;

  try {
    const sessionId = await sessStore.get("sessionId")
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/friends/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId,
        'Authorization': `Bearer ${sessionId}`
      },
      body: Body.json(body)
    });

    if (!response.ok) {
      throw new Error(`error occured when accepting friend request ${response.status}`);
    }

    const data = response.data

    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function refuseFriendRequest(request_id: string, notif_id: string): Promise<boolean> {
  const body = {
    request_id: request_id,
    id: notif_id
  };

  const userId = get(user)?.id;
  try {
    const sessionId = await sessStore.get("sessionId")
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/friends/refuse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId,
        'Authorization': `Bearer ${sessionId}`
      },
      body: Body.json(body)
    });

    if (!response.ok) {
      throw new Error(`error occured when refusing friend request ${response.status}`);
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
