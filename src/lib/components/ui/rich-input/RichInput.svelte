<script lang="ts">
	import { onMount, onDestroy, beforeUpdate } from 'svelte';
	import { Editor, type JSONContent } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Placeholder from '@tiptap/extension-placeholder';
	import { user, updateChatInputState, getChatInputState } from '$lib/stores';
	import { page } from '$app/stores';
	import { debounce } from '$lib/utils';

	let element: Element | undefined;
	let editor: Editor;

	export let friend_chatbox: boolean;
	let channelId = '';
	let currentChannelId = '';

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
			!richInputContent.content ||
			!richInputContent.content[0] ||
			!richInputContent.content[0].content ||
			richInputContent.content[0].content.length <= 0
		) {
			return;
		}

		const body = {
			author: $user,
			channel_id: $page.params.id || $page.params.channelId,
			content: richInputContent,
			private_message: friend_chatbox
		};

		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/messages/create`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});

			if (!response.ok) {
				throw new Error(`error when sending message ${response.status}`);
			}
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
				})
			],
			content: getChatInputState(channelId),
			onUpdate: ({ editor }) => {
				debouncedInput(channelId, editor.getHTML());
			},
			editorProps: {
				handleKeyDown: (_, event) => {
					if (event.key === 'Enter' && !event.shiftKey) {
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

<div class="rich-input left-0 bg-zinc-925">
	<div bind:this={element} />
</div>

<style lang="postcss">
	.rich-input {
		width: 100%;
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
		padding: 0.685rem 1rem;
		border-radius: 0.75rem;
		scroll-padding-block: 0.685rem;
		overflow: auto;
		margin: 0rem 0.75rem 0.75rem;
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
