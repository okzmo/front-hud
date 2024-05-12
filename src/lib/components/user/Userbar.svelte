<script lang="ts">
	import Icon from '@iconify/svelte';
	import Button from '../ui/button/button.svelte';
	import { getUserState } from '$lib/stores';

	const user = getUserState();
</script>

<div class="absolute left-1/2 -translate-x-1/2 bottom-3 w-sidebar flex justify-center">
	<div class="flex gap-x-2">
		<div class="rounded-xl h-14 w-14 overflow-hidden">
			<img class="object-cover w-full h-full" src={$user?.avatar} alt="" />
		</div>
		<Button class="h-14 rounded-xl max-w-[6.5rem]">
			<span class="text-left truncate w-full">{$user?.display_name || 'Hello'}</span>
		</Button>
		<Button class="h-14 w-14 rounded-xl">
			<Icon icon="ph:microphone-duotone" width="26" height="26" />
		</Button>
		<Button class="h-14 w-14 rounded-xl">
			<Icon icon="ph:speaker-high-duotone" width="26" height="26" />
		</Button>
	</div>
</div>
