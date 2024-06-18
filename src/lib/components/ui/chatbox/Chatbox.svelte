<script lang="ts">
	import UserMessage from '$lib/components/user/UserMessage.svelte';
	import { messages } from '$lib/stores';
	import RichInput from '../rich-input/RichInput.svelte';
	import type { Message, MessageUI } from '$lib/types';
	import Icon from '@iconify/svelte';
	import { afterUpdate } from 'svelte';

	export let friend_chatbox: boolean;

	let chatbox: HTMLDivElement;
	let groupedMessages: MessageUI[] = [];

	const groupMessages = (messages: Message[]) => {
		const threshold = 10000; // 2 seconds
		const groupedMessages = messages.map((msg, index) => {
			const prevMsg = messages[index - 1];
			const nextMsg = messages[index + 1];
			const groupWithPrevious =
				index > 0 &&
				new Date(msg.updated_at).getTime() - new Date(prevMsg.updated_at).getTime() < threshold &&
				msg.author.id === prevMsg.author.id;
			const groupWithAfter =
				index < messages.length - 1 &&
				new Date(nextMsg.updated_at).getTime() - new Date(msg.updated_at).getTime() < threshold &&
				msg.author.id === nextMsg.author.id;

			return { ...msg, groupWithPrevious, groupWithAfter };
		});

		return groupedMessages;
	};

	$: if ($messages) {
		groupedMessages = groupMessages($messages);
	}

	afterUpdate(() => {
		chatbox.scrollTop = chatbox.scrollHeight;
	});
</script>

<div class="flex flex-col h-full w-full">
	<div id="chatbox" bind:this={chatbox} class="flex flex-col p-6 overflow-y-auto h-full">
		{#if groupedMessages.length > 0}
			{#each groupedMessages as message}
				<UserMessage
					author={message.author}
					content={message.content}
					time={message.updated_at}
					groupedWithPrevious={message.groupWithPrevious}
					groupedWithAfter={message.groupWithAfter}
				/>
			{/each}
		{:else}
			<div class="w-full h-full flex justify-center items-center">
				<div class="flex flex-col items-center">
					<Icon icon="quill:user-sad" height={150} width={150} class="text-zinc-725" />
					<p class="text-zinc-700 text-2xl mt-4">No messages were found.</p>
				</div>
			</div>
		{/if}
	</div>
	<RichInput {friend_chatbox} />
</div>
