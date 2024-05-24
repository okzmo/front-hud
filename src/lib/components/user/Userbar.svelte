<script lang="ts">
	import Icon from '@iconify/svelte';
	import Button from '../ui/button/button.svelte';
	import { user } from '$lib/stores';
</script>

<div class="absolute left-1/2 -translate-x-1/2 bottom-3 w-sidebar flex justify-center">
	<div class="flex gap-x-2">
		<div class="rounded-xl h-12 w-12 overflow-hidden">
			<img class="object-cover w-full h-full" src={$user?.avatar} alt="" />
		</div>
		<Button class="h-12 rounded-xl max-w-[6.5rem] text-sm">
			<span class="text-left truncate w-full">{$user?.display_name || 'User'}</span>
		</Button>
		<Button class="h-12 w-12 rounded-xl px-3">
			<Icon icon="ph:microphone-duotone" width="20" height="20" />
		</Button>
		<Button class="h-12 w-12 rounded-xl px-3">
			<Icon icon="ph:speaker-high-duotone" width="20" height="20" />
		</Button>
	</div>
</div>
