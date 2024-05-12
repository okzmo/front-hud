<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Placeholder from '@tiptap/extension-placeholder';
	import { user } from '$lib/stores';
	import { page } from '$app/stores';

	let element: Element | undefined;
	let editor: Editor;

	export let friend_chatbox: boolean;

	async function sendMessage(content: string) {
		const body = {
			author: $user,
			channel_id: $page.params.id,
			content: content,
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

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit.configure({
					gapcursor: false,
					dropcursor: false
				}),
				Placeholder.configure({
					placeholder: 'Write something...'
				})
			],
			content: '',
			onTransaction: () => {
				editor = editor;
			},
			editorProps: {
				handleKeyDown: (view, event) => {
					if (event.key === 'Enter' && !event.shiftKey) {
						event.preventDefault();

						sendMessage(view.state.doc.textContent);

						editor.commands.clearContent();

						return true;
					}

					return false;
				}
			}
		});
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
		padding: 1rem;
		border-radius: 0.75rem;
		scroll-padding-block: 16px;
		overflow: auto;
		margin: 0rem 0.75rem 0.75rem;
	}

	:global(.is-editor-empty:first-child::before) {
		color: theme(colors.zinc.600);
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
</style>
