<script lang="ts">
	import UserMessage from '$lib/components/user/UserMessage.svelte';
	import { user } from '$lib/stores';
	import RichInput from '../rich-input/RichInput.svelte';
	import type { MessageUI } from '$lib/types';
	import Icon from '@iconify/svelte';
	import { afterUpdate } from 'svelte';

	export let friend_chatbox: boolean;
	export let messages: MessageUI[] | undefined;

	let chatbox: HTMLDivElement;

	afterUpdate(() => {
		chatbox.scrollTop = chatbox.scrollHeight;
	});
</script>

<div class="flex flex-col h-full w-full">
	<div id="chatbox" bind:this={chatbox} class="flex flex-col p-6 overflow-y-auto h-full">
		{#if messages && messages.length > 0}
			{#each messages as message}
				<UserMessage
					author={message.author}
					content={message.content}
					sender={message.author.id === $user?.id}
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
