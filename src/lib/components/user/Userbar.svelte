<script lang="ts">
	import Icon from '@iconify/svelte';
	import Button from '../ui/button/button.svelte';
	import { user } from '$lib/stores';
	import * as Popover from '$lib/components/ui/popover';
	import Profile from './Profile.svelte';
</script>

<div class="absolute left-1/2 -translate-x-1/2 bottom-3 flex justify-center gap-x-2">
	{#if $user}
		<Popover.Root>
			<Popover.Trigger class="max-w-[9rem] flex-shrink-0">
				<Button class="h-12 p-0 rounded-xl overflow-hidden pr-4 text-sm gap-x-3 ">
					<img class="object-cover w-12 h-12 aspect-square rounded-xl" src={$user.avatar} alt="" />
					<span class="text-left truncate w-full">{$user.display_name || 'User'}</span>
				</Button>
			</Popover.Trigger>
			<Profile
				username={$user.username}
				display_name={$user.display_name}
				side="top"
				banner={$user.banner}
				about_me={$user.about_me}
				avatar={$user.avatar}
			/>
		</Popover.Root>
	{/if}
	<Button class="h-12 w-12 rounded-xl px-3">
		<Icon icon="ph:microphone-duotone" width="20" height="20" />
	</Button>

	<Button class="h-12 w-12 rounded-xl px-3">
		<Icon icon="ph:speaker-high-duotone" width="20" height="20" />
	</Button>
</div>
