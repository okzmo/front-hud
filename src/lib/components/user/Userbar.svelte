<script lang="ts">
	import Icon from '@iconify/svelte';
	import Button from '../ui/button/button.svelte';
	import { user, vcRoom, wsConn, mutedState } from '$lib/stores';
	import * as Popover from '$lib/components/ui/popover';
	import Profile from './Profile.svelte';
	import { quitRoom } from '$lib/rtc';
	import { Track } from 'livekit-client';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import type { User } from '$lib/types';
	import { getProfile } from '$lib/fetches';
	import { page } from '$app/stores';

	function muteMicrophone() {
		mutedState.update((state) => {
			state.muteMic = !state.muteMic;
			return state;
		});
		if ($vcRoom) {
			$vcRoom.localParticipant.setMicrophoneEnabled(!$mutedState.muteMic);
			const wsMess = {
				type: 'participant_status',
				content: {
					user_id: $user?.id,
					serverId: 'servers:' + $page.params.serverId,
					channelId: $vcRoom.name,
					muted: $mutedState.muteMic,
					deafen: $mutedState.muteHead
				}
			};
			$wsConn?.send(JSON.stringify(wsMess));
		}
	}

	function muteHeadphone() {
		mutedState.update((state) => {
			state.muteHead = !state.muteHead;
			return state;
		});
		if ($vcRoom) {
			$vcRoom.remoteParticipants.forEach((participant) => {
				const audioTrack = participant.getTrackPublication(Track.Source.Microphone);
				audioTrack?.setEnabled(!$mutedState.muteHead);
			});
			const wsMess = {
				type: 'participant_status',
				content: {
					user_id: $user?.id,
					serverId: 'servers:' + $page.params.serverId,
					channelId: $vcRoom.name,
					muted: $mutedState.muteMic,
					deafen: $mutedState.muteHead
				}
			};
			$wsConn?.send(JSON.stringify(wsMess));
		}
	}

	onMount(() => {
		// TEMPORARY
		window.addEventListener('beforeunload', () => {
			if ($vcRoom) {
				const wsMess = {
					type: 'quit_participant',
					content: {
						user_id: $user?.id,
						serverId: 'servers:' + $page.params.serverId,
						channelId: $vcRoom?.name
					}
				};
				$wsConn?.send(JSON.stringify(wsMess));
			}
		});
	});

	let open = writable<boolean>(false);
	let user_profile: User | undefined;

	async function getUserProfile() {
		open.set(!$open);
		if (!$open) return;

		user_profile = await getProfile($user?.id, $user!.id);
	}
</script>

<div
	class={`flex items-end flex-shrink-0 border-t border-zinc-850 ${$vcRoom ? 'h-[7.5rem]' : 'h-[4rem]'}  transition-[height] duration-200 relative overflow-hidden bg-zinc-960 backdrop-blur-xl rounded-bl-[0.5rem] `}
>
	<div
		class="absolute w-full flex justify-between items-center py-1 pl-5 pr-3 bottom-[4rem] z-[20]"
	>
		<div class="flex items-center gap-x-2">
			<Icon icon="ph:wifi-high-duotone" class="text-green-500" width="20" height="20" />
			<p class="text-green-500">Connected</p>
		</div>
		<button
			class="h-10 w-10 rounded-lg px-2 flex justify-center items-center group hover:bg-red-500/20 transition-colors"
			on:click={() => quitRoom('servers:' + $page.params.serverId)}
		>
			<Icon
				icon="ph:phone-slash-duotone"
				class="text-zinc-500 group-hover:text-red-500 transition-colors duration-75"
				width="20"
				height="20"
			/>
		</button>
	</div>
	<div
		class="flex gap-x-2 justify-between rounded-bl-xl p-[0.375rem] px-3 py-2 items-center w-full"
	>
		{#if $user}
			<Popover.Root onOpenChange={getUserProfile}>
				<Popover.Trigger class="max-w-[9rem]">
					<button
						class="p-0 rounded-xl px-1 py-1 text-sm gap-x-3 border-none relative flex items-center hover:bg-zinc-850 transition-colors"
					>
						<img
							class="object-cover w-10 h-10 aspect-square rounded-lg z-[1] shrink-0"
							src={$user.avatar}
							alt=""
						/>
						<div class="flex flex-col gap-y-1">
							<span
								class="text-left truncate w-full z-[1] font-medium text-base leading-none"
								style="color: {$user.username_color};">{$user.display_name || 'User'}</span
							>
							<span class="text-left truncate w-full z-[1] leading-none"
								>{$user.username || 'User'}</span
							>
						</div>
					</button>
				</Popover.Trigger>
				<Profile user={user_profile} side="top" />
			</Popover.Root>
		{/if}
		<div class="flex">
			<button
				class="h-10 w-10 rounded-lg px-2 flex justify-center items-center group hover:bg-zinc-850 transition-colors"
				on:click={muteMicrophone}
			>
				<Icon
					icon="solar:microphone-2-bold-duotone"
					class={`${$mutedState.muteMic ? 'text-red-500 group-hover:text-red-400' : 'text-zinc-500 group-hover:text-zinc-200'}  transition-colors`}
					width="20"
					height="20"
				/>
			</button>

			<button
				class="h-10 w-10 rounded-lg px-2 flex justify-center items-center hover:bg-zinc-850 transition-colors group"
				on:click={muteHeadphone}
			>
				<Icon
					icon="solar:headphones-round-bold-duotone"
					class={`${$mutedState.muteHead ? 'text-red-500 group-hover:text-red-400' : 'text-zinc-500 group-hover:text-zinc-200'}  transition-colors`}
					width="20"
					height="20"
				/>
			</button>
		</div>
	</div>
</div>

<style>
	.max-height-transi {
		transition: max-height 150ms ease-out;
	}
</style>
