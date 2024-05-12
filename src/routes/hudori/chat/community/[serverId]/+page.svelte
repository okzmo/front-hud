<script lang="ts">
	import { server } from '$lib/stores';
	import type { Server } from '$lib/types';

	export let data: { server: Server };
	server.set(data.server);
</script>
