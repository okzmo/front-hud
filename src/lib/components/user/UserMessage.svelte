<script lang="ts">
	import { formatISODate } from '$lib/utils';
	import * as Popover from '$lib/components/ui/popover';
	import Profile from './Profile.svelte';
	import type { User } from '$lib/types';
	import { generateHTML, type JSONContent } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { browser } from '$app/environment';
	import { writable, type Writable } from 'svelte/store';
	import { user } from '$lib/stores';
	import { getProfile } from '$lib/utils';

	export let author: User;
	export let content: JSONContent;
	export let time: string;
	export let groupedWithPrevious: boolean;
	export let groupedWithAfter: boolean;

	let open = writable<boolean>(false);
	let user_profile: User | undefined;

	async function getUserProfile() {
		open.set(!$open);
		if (!$open) return;

		user_profile = await getProfile($user?.id, author.id);
	}
</script>

{#if browser}
	<div class="flex gap-x-2 items-end" class:mt-6={!groupedWithPrevious}>
		{#if !groupedWithAfter}
			<Popover.Root onOpenChange={() => getUserProfile()}>
				<Popover.Trigger>
					<div class="flex-shrink-0 h-10 w-10 rounded-xl overflow-hidden">
						<img class="w-full h-full object-cover" src={author.avatar} alt="" />
					</div>
				</Popover.Trigger>
				<Profile user={user_profile} side="right" />
			</Popover.Root>
		{/if}
		<div class="flex flex-col w-fit">
			<div
				class="bg-zinc-850 rounded-xl rounded-bl-sm px-5 py-3 mt-1 w-fit text-sm [&>p]:break-all flex flex-col gap-y-1 max-w-[45rem]"
				class:groupMessagePrevious={groupedWithPrevious}
				class:groupMessageAfter={groupedWithAfter}
			>
				{#if !groupedWithPrevious}
					<span class="flex items-end gap-x-2 w-fit">
						<p class={`text-sm leading-0`} style="color: {author.username_color || '#fff'};">
							{author.display_name}
						</p>
						<time class="text-zinc-400 leading-[1.08rem] text-xs">{formatISODate(time)}</time>
					</span>
				{/if}
				{@html generateHTML(content, [StarterKit])}
			</div>
		</div>
	</div>
{/if}

<!-- margin-left: calc(theme(margin.10) + theme(margin.2)); -->

<style lang="postcss">
	.groupMessagePrevious {
		border-top-left-radius: theme(borderRadius.sm);
	}

	.groupMessageAfter {
		margin-left: calc(theme(margin.10) + theme(margin.2));
	}
</style>
