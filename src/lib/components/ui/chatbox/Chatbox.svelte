<script lang="ts">
	import UserMessage from '$lib/components/messages/UserMessage.svelte';
	import { loadingMessages, messages, usersTyping } from '$lib/stores';
	import RichInput from '../rich-input/RichInput.svelte';
	import type { MessageUI } from '$lib/types';
	import Icon from '@iconify/svelte';
	import { afterUpdate, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { beforeNavigate } from '$app/navigation';
	import TypingMessage from '$lib/components/messages/typingMessage.svelte';
	import { getMessages } from '$lib/fetches';
	import { groupMessages } from '$lib/utils';

	export let friend_chatbox: boolean;

	let infiniteLoadKey = 0;
	let chatbox: HTMLDivElement;
	let groupedMessages: MessageUI[] = [];
	let dropzone: HTMLLabelElement;
	let dropzone_indicator: HTMLDivElement;
	let dropzone_opacity = 0;
	let dropzone_zindex = 1;
	let files = writable<File[]>([]);
	let isLoadingMore = false;

	async function loadMoreMessages() {
		isLoadingMore = true;
		const channelId = $page.params.id || $page.params.channelId;

		const newMessages = await getMessages(
			{
				channelId,
				offset: groupedMessages.length,
				limit: 25
			},
			true
		);

		if (newMessages && newMessages.length > 0) {
			messages.update((cache) => {
				cache[channelId].messages = [...cache[channelId].messages, ...newMessages];
				return cache;
			});
		}
		isLoadingMore = false;
	}

	$: channelId = $page.params.id || $page.params.channelId;
	$: if ($messages[channelId]) {
		loadingMessages.set(true);
		infiniteLoadKey += 1;
		if ($messages[channelId].messages) {
			groupedMessages = groupMessages($messages[channelId]?.messages);
		}
		loadingMessages.set(false);
	}

	function scrollToPosition() {
		const channelContent = $messages[channelId];
		if (chatbox && channelContent) {
			if (chatbox.scrollTop + chatbox.clientHeight >= chatbox.scrollHeight - 100) {
				chatbox.scrollTop = chatbox.scrollHeight;
			} else if (channelContent.scrollPosition) {
				chatbox.scrollTop = channelContent.scrollPosition;
			}
		}
	}

	beforeNavigate(() => {
		const channelId = $page.params.id || $page.params.channelId;
		if ($messages[channelId]) {
			messages.update((cache) => {
				cache[channelId].scrollPosition = chatbox.scrollTop;
				return cache;
			});
		}
	});

	afterUpdate(() => {
		if (!isLoadingMore) {
			scrollToPosition();
		}
	});

	onMount(() => {
		dropzone.addEventListener('click', (e) => {
			if (e.target.id !== 'image-upload-icon' && e.target.id !== 'dropzone-file') {
				e.preventDefault();
				return;
			}
		});

		dropzone.addEventListener('change', (e) => {
			const filesUploaded = Array.from(e.target.files);
			files.update((state) => {
				state.push(...filesUploaded);
				return state;
			});
		});

		dropzone.addEventListener('dragover', (e) => {
			e.preventDefault();
			if (dropzone_opacity === 1) return;
			dropzone_zindex = 4;
			dropzone_opacity = 1;
		});

		dropzone.addEventListener('dragleave', (e) => {
			dropzone_opacity = 0;
		});

		dropzone.addEventListener('drop', (e) => {
			e.preventDefault();
			const filesUploaded = Array.from(e.dataTransfer?.files);
			files.update((state) => {
				state.push(...filesUploaded);
				return state;
			});
			dropzone_zindex = 2;
			dropzone_opacity = 0;
		});
	});

	let isNearTop = false;

	function handleScroll() {
		isNearTop = -chatbox.scrollTop > chatbox.scrollHeight - 910;
		if (isNearTop && !isLoadingMore) {
			loadMoreMessages();
		}
	}
</script>

<label
	bind:this={dropzone}
	for="dropzone-file"
	class="flex flex-col h-full max-w-full cursor-auto relative"
>
	<div
		bind:this={dropzone_indicator}
		class="absolute h-full w-full left-0 top-0 bg-zinc-950/85 z-[4] backdrop-blur-sm flex justify-center items-center text-zinc-600 flex-col transition-opacity duration-75 pointer-events-none"
		style="opacity: {dropzone_opacity}; z-index: {dropzone_zindex};"
	>
		<Icon icon="ph:images-duotone" height={100} width={100} />
		<p>Drop your file for it to be uploaded!</p>
	</div>

	<div
		id="chatbox"
		bind:this={chatbox}
		class="flex flex-col-reverse py-6 overflow-y-auto h-full select-none"
		on:scroll={handleScroll}
	>
		{#if $loadingMessages}
			Loading...
		{:else if groupedMessages.length > 0}
			{#each groupedMessages as message}
				<UserMessage
					{friend_chatbox}
					id={message.id}
					author={message.author}
					content={message.content}
					time={message.created_at}
					groupedWithPrevious={message.groupWithPrevious}
					groupedWithAfter={message.groupWithAfter}
					images={message.images}
					mentions={message.mentions}
					edited={message.edited}
					reply={message.replies}
				/>
			{/each}
		{:else}
			<div class="w-full h-full flex justify-center items-center">
				<div class="flex flex-col items-center">
					<Icon
						icon="solar:sad-circle-bold-duotone"
						height={150}
						width={150}
						class="text-zinc-725"
					/>
					<p class="text-zinc-700 text-2xl mt-4">No messages were found.</p>
				</div>
			</div>
		{/if}
		{#if $usersTyping.length > 0 && $usersTyping.some((user) => user.channel_id === $page.params.channelId || user.user_id.split(':')[1] === $page.params.id)}
			<TypingMessage usersTyping={$usersTyping} />
		{/if}
		<div class="anchor-scroll"></div>
	</div>
	<input type="file" class="hidden" id="dropzone-file" />
	<RichInput {files} {friend_chatbox} />
</label>

<style>
	#chatbox * {
		overflow-anchor: none;
	}

	.anchor-scroll {
		overflow-anchor: auto;
		height: 1px;
	}
</style>
