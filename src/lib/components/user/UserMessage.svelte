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
	{#if sender}
		<div class="flex gap-x-3 max-w-3xl self-end items-start" class:mt-6={!groupedWithPrevious}>
			<div class="flex flex-col">
				{#if !groupedWithPrevious}
					<span class="flex justify-end items-end gap-x-2">
						<time class="text-zinc-650 leading-2 text-xs">{formatISODate(time)}</time>
						<p class="text-sm">{author.display_name}</p>
					</span>
				{/if}
				<p
					class="bg-accent rounded-3xl rounded-tr-sm px-5 py-3 mt-1 w-fit self-end text-sm"
					class:smaller_message={content.length < 75}
					class:groupMessagePreviousSender={groupedWithPrevious}
					class:groupMessageAfterSender={groupedWithAfter}
				>
					{@html generateHTML(content, [StarterKit])}
				</p>
			</div>
			{#if !groupedWithPrevious}
				<Popover.Root>
					<Popover.Trigger>
						<button class="flex-shrink-0 h-12 w-12 rounded-2xl overflow-hidden">
							<img class="w-full h-full object-cover" src={author.avatar} alt="" />
						</button>
					</Popover.Trigger>
					<Profile
						display_name={author.display_name}
						username={author.username}
						banner={author.banner}
						avatar={author.avatar}
						about_me={author.about_me}
						side="left"
					/>
				</Popover.Root>
			{/if}
		</div>
	{:else}
		<div class="flex gap-x-3 max-w-3xl items-start" class:mt-6={!groupedWithPrevious}>
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
			<div class="flex flex-col">
				{#if !groupedWithPrevious}
					<span class="flex gap-x-2">
						<p class="text-sm">{author.display_name}</p>
						<time class="text-zinc-650 leading-2 text-xs">{formatISODate(time)}</time>
					</span>
				{/if}
				<p
					class="bg-zinc-800 rounded-3xl rounded-tl-sm px-5 py-3 mt-1 w-fit text-sm"
					class:smaller_message={content.length < 75}
					class:groupMessagePrevious={groupedWithPrevious}
					class:groupMessageAfter={groupedWithAfter}
				>
					{@html generateHTML(content, [StarterKit])}
				</p>
			</div>
		</div>
	{/if}
{/if}

<style lang="postcss">
	.smaller_message {
		padding: 0.45rem 1rem;
	}

	.groupMessagePrevious {
		margin-left: calc(theme(margin.12) + theme(margin.3));
	}

	.groupMessagePreviousSender {
		margin-right: calc(theme(margin.12) + theme(margin.3));
	}

	.groupMessageAfter {
		border-bottom-left-radius: theme(borderRadius.sm);
	}

	.groupMessageAfterSender {
		border-bottom-right-radius: theme(borderRadius.sm);
	}
</style>
