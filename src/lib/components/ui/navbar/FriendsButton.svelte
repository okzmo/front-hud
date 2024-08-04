<script>
	import { notifications, showFriends } from '$lib/stores';
	import Button from '../button/button.svelte';
	import Icon from '@iconify/svelte';

	let friendNotification = false;

	// $: if ($notifications) {
	// 	friendNotification = $notifications.some((notif) => notif.channel_id?.includes('users'));
	// }
</script>

<li>
	<Button
		class={`h-[3.35rem] w-[3.35rem] relative`}
		size="icon"
		on:click={() => showFriends.set(!$showFriends)}
	>
		<Icon
			icon={!$showFriends ? 'solar:users-group-rounded-bold-duotone' : 'ph:arrow-left-bold'}
			height="24"
			width="24"
			class="text-zinc-500"
		/>
		{#if friendNotification}
			<div class="absolute h-2 w-2 bg-destructive -right-[0.15rem] -top-[0.15rem] rounded-lg" />
		{/if}
	</Button>
</li>
