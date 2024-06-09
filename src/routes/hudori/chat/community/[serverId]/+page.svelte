<script lang="ts">
	import { goto } from '$app/navigation';
	import { server } from '$lib/stores';
	import type { Server } from '$lib/types';
	import { redirect } from '@sveltejs/kit';

	export let data: { server: Server };
	$: server.set(data.server);
	$: if ($server) {
		const serverId = $server.id.split(':')[1];
		const channelId = $server.categories[0].channels[0].id.split(':')[1];
		goto(`${serverId}/channels/${channelId}`);
	}
</script>
