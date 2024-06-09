<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import Profile from '$lib/components/user/Profile.svelte';
	import type { User } from '$lib/types';
	import Icon from '@iconify/svelte';

	export let user: User;
</script>

<Popover.Root>
	<Popover.Trigger>
		<div
			class="flex gap-x-3 hover:bg-zinc-800/75 py-[0.45rem] text-zinc-500 px-3 rounded-[0.6rem] transition duration-75 active:scale-[0.97] items-center ml-[calc(10px_+_0.75rem)] justify-between"
		>
			<div class="flex gap-x-4 items-center w-fit">
				<img
					src={user.avatar}
					class="h-7 w-7 rounded-lg object-cover flex-shrink-0 transition-shadow"
					style="box-shadow: {user.talking
						? '0px 0px 11px rgba(69, 222, 94, 1)'
						: '0px 0px 11px rgba(69, 222, 94, 0)'};"
					alt={`${user.display_name}'s avatar`}
				/>
				<p class="overflow-hidden text-ellipsis w-full text-nowrap">
					{user.display_name}
				</p>
			</div>

			<div class="flex gap-x-1 items-center">
				{#if user.muted}
					<Icon icon="ph:microphone-slash-duotone" class="text-zinc-600" width="18" height="18" />
				{/if}
				{#if user.deafen}
					<Icon icon="ph:speaker-x-duotone" class="text-zinc-600" width="18" height="18" />
				{/if}
			</div>
		</div>
	</Popover.Trigger>
	<Profile
		display_name={user.display_name}
		username={user.username}
		banner={user.banner}
		avatar={user.avatar}
		about_me={user.about_me}
		side="right"
	/>
</Popover.Root>
