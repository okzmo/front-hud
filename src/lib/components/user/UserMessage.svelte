<script lang="ts">
	import { formatISODate } from '$lib/utils';
	import * as Popover from '$lib/components/ui/popover';
	import Profile from './Profile.svelte';
	import type { User } from '$lib/types';
	import { generateHTML, type JSONContent } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { browser } from '$app/environment';

	export let author: User;
	export let sender: boolean = false;
	export let content: JSONContent;
	export let time: string;
	export let groupedWithPrevious: boolean;
	export let groupedWithAfter: boolean;
</script>

{#if browser}
	<div class="flex gap-x-3 items-start" class:mt-6={!groupedWithPrevious}>
		{#if !groupedWithPrevious}
			<Popover.Root>
				<Popover.Trigger>
					<div class="flex-shrink-0 h-12 w-12 rounded-2xl overflow-hidden">
						<img class="w-full h-full object-cover" src={author.avatar} alt="" />
					</div>
				</Popover.Trigger>
				<Profile
					display_name={author.display_name}
					username={author.username}
					banner={author.banner}
					avatar={author.avatar}
					about_me={author.about_me}
					side="right"
				/>
			</Popover.Root>
		{/if}
		<div class="flex flex-col w-fit">
			{#if !groupedWithPrevious}
				<span class="flex items-end gap-x-2 w-fit">
					<p class="text-sm leading-0">{author.display_name}</p>
					<time class="text-zinc-650 leading-2 text-xs">{formatISODate(time)}</time>
				</span>
			{/if}
			<p
				class="bg-zinc-800 rounded-3xl rounded-tl-sm px-5 py-2 mt-1 w-fit text-sm [&>p]:break-all"
				class:!bg-accent={sender}
				class:groupMessagePrevious={groupedWithPrevious}
				class:groupMessageAfter={groupedWithAfter}
			>
				{@html generateHTML(content, [StarterKit])}
			</p>
		</div>
	</div>
{/if}

<style lang="postcss">
	.groupMessagePrevious {
		margin-left: calc(theme(margin.12) + theme(margin.3));
	}

	.groupMessageAfter {
		border-bottom-left-radius: theme(borderRadius.sm);
	}
</style>
