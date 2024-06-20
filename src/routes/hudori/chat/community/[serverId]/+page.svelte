<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { server } from '$lib/stores';
	import type { Server } from '$lib/types';

	export let data: { server: Server };
	$: server.set(data.server);
	$: if ($server) {
		const serverId = $server.id.split(':')[1];
		const channelId = $server.categories[0].channels[0].id.split(':')[1];
		if (browser) {
			goto(`${serverId}/channels/${channelId}`);
		}
	}
</script>
