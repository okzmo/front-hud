<script lang="ts">
	import { onMount, onDestroy, beforeUpdate } from 'svelte';
	import { Editor, type JSONContent } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Placeholder from '@tiptap/extension-placeholder';
	import Link from '@tiptap/extension-link';
	import { user, updateChatInputState, getChatInputState, server } from '$lib/stores';
	import { page } from '$app/stores';
	import { debounce } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import type { Writable } from 'svelte/store';
	import Mention from '@tiptap/extension-mention';
	import suggestion from './suggestion';
	import MentionList from './MentionList.svelte';

	let element: Element | undefined;
	let editor: Editor;
	let mentionList;

	export let friend_chatbox: boolean;
	export let files: Writable<File[]>;

	let channelId = '';
	let currentChannelId = '';
	let showSlowRequest = false;
	let mentionProps;
	let mentions: string[] = [];

	$: if ($page.params.id || $page.params.channelId) {
		channelId = $page.params.id || $page.params.channelId;
	}

	beforeUpdate(() => {
		if (currentChannelId !== channelId) {
			if (editor) {
				updateChatInputState(currentChannelId, editor.getHTML());
				editor.destroy();
			}
			currentChannelId = channelId;
			initializeEditor();
		}
	});

	async function sendMessage(richInputContent: JSONContent) {
		if (
			(!richInputContent.content ||
				!richInputContent.content[0] ||
				!richInputContent.content[0].content ||
				richInputContent.content[0].content.length <= 0) &&
			$files.length === 0
		) {
			return;
		}

		const body = {
			author: $user,
			channel_id: $page.params.id || $page.params.channelId,
			content: richInputContent,
			mentions: mentions,
			private_message: friend_chatbox
		};

		if (!friend_chatbox) {
			body.server_id = $server?.id;
		}

		const formData = new FormData();

		if ($files.length > 0) {
			showSlowRequest = true;
			$files.forEach((file, idx) => {
				formData.append(`file-${idx}`, file);
			});
		}

		formData.append('body', JSON.stringify(body));

		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/messages/create`, {
				method: 'POST',
				credentials: 'include',
				body: formData,
				headers: {
					'X-User-ID': $user?.id,
					'X-User-Agent': navigator.userAgent
				}
			});

			if (!response.ok) {
				throw new Error(`error when sending message ${response.status}`);
			}

			debouncedInput(channelId, null);
			showSlowRequest = false;
			files.set([]);
			mentions = [];
		} catch (err) {
			console.log(err);
		}
	}

	const debouncedInput = debounce((channelId, content) => {
		updateChatInputState(channelId, content);
	}, 300);

	function initializeEditor() {
		editor = new Editor({
			element: element,
			extensions: [
				Link.configure({
					openOnClick: true,
					defaultProtocol: 'https',
					autolink: true,
					protocols: ['https']
				}),
				StarterKit.configure({
					gapcursor: false,
					dropcursor: false,
					heading: false,
					orderedList: false,
					bulletList: false,
					blockquote: false
				}),
				Placeholder.configure({
					placeholder: 'Write something...'
				}),
				Mention.configure({
					HTMLAttributes: {
						class: 'editor-mention'
					},
					renderHTML({ options, node }) {
						return [
							'span',
							options.HTMLAttributes,
							`${options.suggestion.char}${node.attrs.label}`
						];
					},
					suggestion: {
						items: async ({ query }) => {
							const filteredMembers = $server?.members
								.filter((item) => item.username.toLowerCase().startsWith(query.toLowerCase()))
								.slice(0, 5);
							return filteredMembers;
						},
						render: () => {
							return {
								onStart: (props) => {
									if (!props.clientRect) {
										return;
									}

									mentionProps = props;
								},
								onUpdate: (props) => {
									if (!props.clientRect) {
										return;
									}

									mentionProps = props;
								},
								onExit() {
									mentionProps = null;
								},
								onKeyDown: (props) => {
									if (props.event.key === 'Escape') {
										mentionProps = null;
										return true;
									}

									return mentionList?.handleKeyDown(props);
								}
							};
						}
					}
				})
			],
			content: getChatInputState(channelId),
			onUpdate: ({ editor }) => {
				debouncedInput(channelId, editor.getHTML());
			},
			editorProps: {
				handleKeyDown: (_, event) => {
					if (
						event.key === 'Enter' &&
						(!mentionProps || mentionProps.items.length === 0) &&
						!event.shiftKey
					) {
						event.preventDefault();

						sendMessage(editor.getJSON());

						editor.commands.clearContent();

						return true;
					}

					return false;
				}
			}
		});
	}

	onMount(() => {
		initializeEditor();
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div id="rich-input" class="rich-input bg-zinc-925 relative">
	{#if showSlowRequest}
		<div
			class="absolute bg-zinc-850 left-3 -top-8 w-[calc(100%-1.5rem)] py-1 pb-3 px-3 rounded-tr-lg rounded-tl-lg"
		>
			Sending...
		</div>
	{/if}
	{#if mentionProps}
		<MentionList props={mentionProps} bind:this={mentionList} {mentions} />
	{/if}
	<div bind:this={element} class="relative">
		<label
			for="dropzone-file"
			id="image-upload-icon"
			class="absolute top-1/2 -translate-y-1/2 left-[1.5rem] z-[2] w-[1.25rem] h-[1.25rem] flex justify-center items-center text-zinc-600 hover:text-zinc-400"
		>
			{#if $files.length > 0}
				<span class="text-xs">{$files.length}</span>
			{:else}
				<Icon icon="ph:images-duotone" class="pointer-events-none" height={20} width={20} />
			{/if}
		</label>
		<Icon
			icon="ph:smiley-melting-duotone"
			class="absolute top-1/2 -translate-y-1/2 right-[1.5rem] z-[2] text-zinc-600 hover:text-zinc-400"
			height={20}
			width={20}
		/>
	</div>
</div>

<style lang="postcss">
	.rich-input {
		width: 100%;
		z-index: 2;
	}

	:global(.ProseMirror:focus) {
		outline: none;
		border-color: theme(colors.zinc.600);
		transition: border-color 75ms ease-out;
	}

	:global(.ProseMirror) {
		max-height: 20rem;
		border: 1px solid theme(colors.zinc.750);
		background-color: theme(colors.zinc.850);
		font-size: theme(fontSize.sm);
		padding: 0.685rem 2.5rem;
		border-radius: 0.75rem;
		scroll-padding-block: 0.685rem;
		overflow: auto;
		margin: 0rem 0.75rem 0.75rem;
	}

	:global(.ProseMirror a) {
		color: theme(colors.blue.400);
	}

	:global(.ProseMirror a:hover) {
		cursor: pointer;
		text-decoration: underline;
	}

	:global(.is-editor-empty:first-child::before) {
		color: theme(colors.zinc.600);
		font-size: theme(fontSize.sm);
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
</style>
