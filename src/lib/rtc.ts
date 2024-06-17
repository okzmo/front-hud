import {
	Participant,
	RemoteParticipant,
	RemoteTrack,
	RemoteTrackPublication,
	Room,
	RoomEvent,
	LocalTrackPublication,
	LocalParticipant,
	VideoPresets,
	Track
} from 'livekit-client';
import { mutedState, participantExist, server, user, vcRoom, wsConn } from './stores';
import { get } from 'svelte/store';
import { page } from '$app/stores';

export async function joinRoom(channelId: string, userId: string, serverId: string) {
	const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/rtc/${channelId}/${userId}`, {
		credentials: 'include'
	});
	const data = await resp.json();
	const token = data.token;
	await navigator.mediaDevices.getUserMedia({ audio: true });

	const room = new Room({
		adaptiveStream: true,
		dynacast: true,

		videoCaptureDefaults: {
			resolution: VideoPresets.h720.resolution
		}
	});

	// set up event listeners
	room
		.on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
		.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
		.on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakerChange)
		.on(RoomEvent.Disconnected, handleDisconnect)
		.on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished);

	await room.connect(import.meta.env.VITE_LIVEKIT_URL, token);
	const mutedParticipant = get(mutedState);

	try {
		await room.localParticipant.setMicrophoneEnabled(!mutedParticipant.muteMic);
	} catch (error) {
		console.error('Error enabling camera and microphone:', error);
	}

	if (mutedParticipant.muteHead) {
		room.remoteParticipants.forEach((participant) => {
			const audioTrack = participant.getTrackPublication(Track.Source.Microphone);
			audioTrack?.setEnabled(!mutedParticipant.muteHead);
		});
	}

	vcRoom.set(room);
	const userInfos = get(user);
	const exist = participantExist(channelId, userInfos?.id);

	if (!exist) {
		const ws = get(wsConn);

		const wsMessNew = {
			type: 'new_participant',
			content: {
				user: userInfos,
				serverId: serverId,
				channelId: channelId
			}
		};

		ws?.send(JSON.stringify(wsMessNew));
	}
}

export async function quitRoom(serverId: string) {
	const room = get(vcRoom);
	await room?.disconnect();
	vcRoom.set(undefined);
	const audio = document.getElementById('audio_quit_channel') as HTMLMediaElement;
	audio.play();

	const pageInfos = get(page);

	if (pageInfos.url.pathname.includes(serverId.split(':')[1])) {
		const ws = get(wsConn);
		const userInfos = get(user);
		const wsMess = {
			type: 'quit_participant',
			content: {
				user_id: userInfos?.id,
				serverId: serverId,
				channelId: room?.name
			}
		};

		ws?.send(JSON.stringify(wsMess));
	}
}

function handleTrackSubscribed(
	track: RemoteTrack,
	publication: RemoteTrackPublication,
	participant: RemoteParticipant
) {
	if (track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) {
		// attach it to a new HTMLVideoElement or HTMLAudioElement
		const element = track.attach();
		document.body.appendChild(element);

		const audioPos = document.getElementById('audio_join_channel') as HTMLMediaElement;
		audioPos.play();
	}
}

function handleTrackUnsubscribed(
	track: RemoteTrack,
	publication: RemoteTrackPublication,
	participant: RemoteParticipant
) {
	// remove tracks from all attached elements
	track.detach();
}

function handleLocalTrackUnpublished(
	publication: LocalTrackPublication,
	participant: LocalParticipant
) {
	// when local tracks are ended, update UI to remove them from rendering
	publication.track?.detach();
}

function handleActiveSpeakerChange(speakers: Participant[]) {
	// show UI indicators when participant is speaking
	const room = get(vcRoom);
	const speakersMap = new Map(speakers.map((speaker) => [speaker.identity, true]));

	server.update((server) => {
		for (const category of server?.categories) {
			for (const channel of category.channels) {
				if (channel.id === room?.name) {
					for (const participant of channel.participants) {
						participant.talking = speakersMap.has(participant.id);
					}
					break;
				}
			}
		}
		return server;
	});
}

function handleDisconnect() {}
