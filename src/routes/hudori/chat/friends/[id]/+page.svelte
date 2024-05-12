<script lang="ts">
	import Chatbox from '$lib/components/ui/chatbox/Chatbox.svelte';
	import { messages } from '$lib/stores';
	import type { Message } from '$lib/types';

	export let data: { messages: Message[] };
	$: messages.set(data.messages);
</script>

<Chatbox friend_chatbox={true} />
