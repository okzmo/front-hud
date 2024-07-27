<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	onMount(() => {
		goto(`/hudori/chat/space/${$page.params.serverId}/settings/customization`);
	});
</script>
