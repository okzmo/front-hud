<script lang="ts">
	import Chatbox from '$lib/components/ui/chatbox/Chatbox.svelte';
	import { messages, server } from '$lib/stores';
	import type { PageData } from './$types';

	export let data: PageData;
	$: {
		messages.set(data.props?.messages);
		server.set(data.props?.server);
	}
</script>

<Chatbox friend_chatbox={false} />
