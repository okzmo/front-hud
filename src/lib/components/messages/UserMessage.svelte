<script lang="ts">
	import {
		formatISODate,
		generateRandomId,
		handleContextMenu,
		restoreSelection,
		saveSelection
	} from '$lib/utils';
	import * as Popover from '$lib/components/ui/popover';
	import Profile from '../user/Profile.svelte';
	import type { User } from '$lib/types';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import {
		contextMenuInfo,
		loadingMessages,
		user,
		editingMessage,
		messages,
		replyTo,
		sessStore
	} from '$lib/stores';
	import { getProfile } from '$lib/fetches';
	import GridImages from './GridImages.svelte';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { Skeleton } from '../ui/skeleton';
	import Icon from '@iconify/svelte';
	import RichInputEditMessage from '../ui/rich-input/RichInputEditMessage.svelte';
	import { page } from '$app/stores';
	import { generateHTML, generateText } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Mention from '@tiptap/extension-mention';
	import { Emoji } from '../ui/rich-input/emojiNode';
	import { EmojiSuggestion } from '../ui/rich-input/emojiSuggestion';
	import { fetch, Body } from '@tauri-apps/api/http';

	export let id: string;
	export let author: User;
	export let content: string;
	export let images: string[];
	export let mentions: string[];
	export let time: string;
	export let groupedWithPrevious: boolean;
	export let groupedWithAfter: boolean;
	export let friend_chatbox: boolean;
	export let edited: boolean;
	export let reply: any;

	let open = writable<boolean>(false);
	let user_profile: User | undefined;

	async function getUserProfile() {
		open.set(!$open);
		if (!$open) return;

		user_profile = await getProfile($user?.id, author.id);
	}

	let openContextMenuId = `context-menu-${generateRandomId()}`;
	let contextMenuOpen: boolean = false;

	$: contextMenuOpen = $contextMenuInfo?.id === openContextMenuId;

	async function deleteMessage() {
		const channelId = $page.params.id || $page.params.channelId;

		messages.update((cache) => {
			const messIdx = cache[channelId]?.messages?.findIndex((message) => message.id === id);
			if (messIdx > -1) {
				cache[channelId].messages.splice(messIdx, 1);
			}
			return cache;
		});

		let body: any = {
			channel_id: channelId,
			message_id: id,
			private_message: friend_chatbox,
			author_id: $user.id.split(':')[1]
		};

		try {
			const sessId = await sessStore.get('sessionId');
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/messages/delete`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'X-User-ID': $user?.id,
					Authorization: `Bearer ${sessId}`
				},
				body: Body.json(body)
			});
			const data = response.data as { message: string };

			if (!response.ok) {
				throw new Error(data.message);
			}
		} catch (e) {
			console.log(e);
		}
	}

	function goToReply() {
		const replyMessage = document.querySelector(`[data-messageid='${reply.id}']`);
		if (!replyMessage) return;
		replyMessage?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						replyMessage.classList.add('!bg-zinc-650/15');
						setTimeout(() => {
							replyMessage.classList.remove('!bg-zinc-650/15');
						}, 1000);
						observer.disconnect();
					}
				});
			},
			{ threshold: 0.5 }
		);

		observer.observe(replyMessage);
	}
</script>

{#if browser}
	<ContextMenu.Root disableFocusFirstItem={true}>
		<ContextMenu.Trigger on:contextmenu={() => handleContextMenu(openContextMenuId)}>
			<div
				class="flex gap-x-2 items-start px-6 py-3 hover:bg-zinc-500/5 transition-colors duration-75 relative select-none"
				class:mt-2={!groupedWithPrevious}
				class:pt-8={reply && reply.id !== ''}
				class:mentioned={mentions && mentions.includes($user?.id)}
				data-messageid={id}
			>
				{#if reply && reply.id !== ''}
					<button
						class="text-xs inline-flex items-center gap-x-1 text-zinc-600 ml-2 group hover:text-zinc-400 transition-colors cursor-pointer absolute top-[0.65rem] left-[4.7rem]"
						on:click={goToReply}
					>
						<Icon
							icon="iconoir:quote-message-solid"
							class="text-zinc-500 group-hover:text-zinc-300 transition-colors"
						/>
						<span class="font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors"
							>{reply?.author?.display_name}</span
						>
						<span
							class="[&>p]:max-w-[10rem] [&>p]:inline-block [&>p]:overflow-hidden [&>p]:text-ellipsis overflow-hidden text-ellipsis flex-shrink-0 whitespace-nowrap flex select-none"
						>
							{@html generateHTML(JSON.parse(reply?.content), [
								StarterKit,
								Link,
								Mention,
								Emoji,
								EmojiSuggestion
							])}
						</span>
					</button>
				{/if}
				{#if !groupedWithAfter}
					<Popover.Root onOpenChange={() => getUserProfile()}>
						<Popover.Trigger>
							<div class="flex-shrink-0 h-10 w-10 rounded-xl overflow-hidden">
								{#if $loadingMessages}
									<Skeleton class="w-full h-full" />
								{/if}
								<img class="w-full h-full object-cover select-none" src={author.avatar} alt="" />
							</div>
						</Popover.Trigger>
						<Profile user={user_profile} side="right" />
					</Popover.Root>
				{/if}
				<div class="flex flex-col w-fit">
					{#if content}
						<div
							class="rounded-xl rounded-bl-sm pl-3 w-fit text-sm [&>p]:break-all flex flex-col transition-colors"
							class:groupMessagePrevious={groupedWithPrevious}
							class:groupMessageAfter={groupedWithAfter}
						>
							{#if !groupedWithPrevious}
								<span class="flex items-end gap-x-2 w-fit">
									<p
										style={`
                  color: ${author.username_color?.includes('linear-gradient') ? 'transparent' : author.username_color};
                  background: ${author.username_color?.includes('linear-gradient') ? author.username_color : ''};
                  background-clip: ${author.username_color?.includes('linear-gradient') ? 'text' : ''};
                `}
										class={`text-sm leading-0 select-text`}
									>
										{author.display_name}
									</p>
									<time class="text-zinc-400 leading-[1.08rem] text-xs select-text"
										>{formatISODate(time)}</time
									>
									{#if edited}
										<span class="text-zinc-400 leading-[1.08rem] text-xs">(edited)</span>
									{/if}
								</span>
							{/if}
							<span
								class="[&>p>a]:text-blue-400 [&>p>a:hover]:underline break-all [&>p>span]:first:ml-0 [&>p]:leading-[1.75rem] w-fit [&>p]:w-fit select-text"
							>
								{#if $editingMessage === id}
									<RichInputEditMessage
										{friend_chatbox}
										files={null}
										messageToEdit={generateHTML(JSON.parse(content), [
											StarterKit,
											Link,
											Mention,
											Emoji,
											EmojiSuggestion
										])}
										messageToEditId={id}
									/>
								{:else}
									{@html generateHTML(JSON.parse(content), [
										StarterKit,
										Link,
										Mention,
										Emoji,
										EmojiSuggestion
									])}
								{/if}
							</span>
						</div>
						{#if contextMenuOpen}
							<ContextMenu.Content id="context-menu-message">
								<ContextMenu.Item
									class="gap-x-2 items-center text-sm"
									on:focusin={() => setTimeout(restoreSelection, 0)}
									on:focusout={() => setTimeout(restoreSelection, 0)}
									on:click={() =>
										navigator.clipboard.writeText(
											generateText(JSON.parse(content), [
												StarterKit,
												Link,
												Mention,
												Emoji,
												EmojiSuggestion
											])
										)}
								>
									<Icon icon="solar:copy-bold-duotone" height={16} width={16} class="" />
									Copy
								</ContextMenu.Item>
								<ContextMenu.Item
									class="gap-x-2 items-center text-sm"
									on:focusin={() => setTimeout(restoreSelection, 0)}
									on:focusout={() => setTimeout(restoreSelection, 0)}
									on:click={() =>
										replyTo.set({ id: id, author: { display_name: author.display_name } })}
								>
									<Icon icon="ph:arrow-bend-up-left-bold" height={16} width={16} class="" />
									Reply
								</ContextMenu.Item>
								{#if author.id === $user.id}
									<ContextMenu.Item
										class="gap-x-2 items-center text-sm"
										on:focusin={() => setTimeout(restoreSelection, 0)}
										on:focusout={() => setTimeout(restoreSelection, 0)}
										on:click={() => editingMessage.set(id)}
									>
										<Icon icon="solar:pen-bold-duotone" height={16} width={16} class="" />
										Edit message
									</ContextMenu.Item>
									<ContextMenu.Item
										class="gap-x-2 items-center text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-zinc-50 text-sm"
										on:click={deleteMessage}
										on:focusin={() => setTimeout(restoreSelection, 0)}
										on:focusout={() => setTimeout(restoreSelection, 0)}
									>
										<Icon icon="solar:trash-bin-2-bold-duotone" height={16} width={16} />
										Delete message
									</ContextMenu.Item>
								{/if}
							</ContextMenu.Content>
						{/if}
					{/if}

					{#if images && images.length > 0}
						<div
							class="flex gap-2 max-w-[30rem] [&+div]:rounded-tl-sm overflow-hidden flex-wrap ml-2 mt-1 select-none"
						>
							<GridImages {images} />
						</div>
					{/if}
				</div>
			</div>
		</ContextMenu.Trigger>
	</ContextMenu.Root>
{/if}

<style lang="postcss">
	.groupMessagePrevious {
		border-top-left-radius: theme(borderRadius.sm);
	}

	.groupMessageAfter {
		margin-left: calc(theme(margin.10) + theme(margin.2));
	}

	:global([data-type='mention']) {
		color: theme(colors.accent.DEFAULT);
		margin: 0rem 0.2rem;
		border-radius: theme(borderRadius.md);
	}

	.mentioned {
		background-color: #f9864c2b;
		border-left: 2px solid #f9864c;
	}

	.mentioned:hover {
		background-color: #f9864c3b;
	}
</style>
