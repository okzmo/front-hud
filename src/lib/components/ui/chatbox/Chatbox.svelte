<script lang="ts">
	import UserMessage from '$lib/components/user/UserMessage.svelte';
	import { messages, user } from '$lib/stores';
	import { onMount } from 'svelte';
	import RichInput from '../rich-input/RichInput.svelte';
	import { afterNavigate } from '$app/navigation';
	import type { Message, MessageUI } from '$lib/types';

	export let friend_chatbox: boolean;

	let chatbox: HTMLDivElement;
	let groupedMessages: MessageUI[] = [];

	onMount(() => {
		chatbox.scrollTop = chatbox.scrollHeight;
	});

	afterNavigate(() => {
		chatbox.scrollTop = chatbox.scrollHeight;
	});

	// Function to determine grouping
	function determineGrouping(messages: Message[]) {
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
	}

	$: if ($messages) {
		groupedMessages = determineGrouping($messages);
	}
</script>

<div class="flex flex-col h-full w-full">
	<div id="chatbox" bind:this={chatbox} class="flex flex-col p-6 overflow-y-auto h-full">
		{#if groupedMessages.length > 0}
			{#each groupedMessages as message}
				<UserMessage
					name={message.author.display_name}
					content={message.content}
					sender={message.author.id === $user?.id}
					avatar={message.author.avatar}
					time={message.updated_at}
					groupedWithPrevious={message.groupWithPrevious}
					groupedWithAfter={message.groupWithAfter}
				/>
			{/each}
		{:else}
			<p>no message lol</p>
		{/if}
	</div>
	<RichInput {friend_chatbox} />
</div>
