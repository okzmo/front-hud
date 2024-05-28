<script lang="ts">
	import Icon from '@iconify/svelte';
	import Button from '../ui/button/button.svelte';
	import { user } from '$lib/stores';
</script>

<div class="absolute left-1/2 -translate-x-1/2 bottom-3 flex justify-center gap-x-2">
	<Button
		class="h-12 p-0 rounded-xl overflow-hidden pr-4 text-sm gap-x-3 flex-shrink-0 max-w-[9rem]"
	>
		<img class="object-cover w-12 h-12 aspect-square rounded-xl" src={$user?.avatar} alt="" />
		<span class="text-left truncate w-full">{$user?.display_name || 'User'}</span>
	</Button>
	<Button class="h-12 w-12 rounded-xl px-3">
		<Icon icon="ph:microphone-duotone" width="20" height="20" />
	</Button>
	<Button class="h-12 w-12 rounded-xl px-3">
		<Icon icon="ph:speaker-high-duotone" width="20" height="20" />
	</Button>
</div>
