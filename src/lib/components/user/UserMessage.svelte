<script lang="ts">
	import { formatISODate } from '$lib/utils';
	import * as Popover from '$lib/components/ui/popover';
	import Profile from './Profile.svelte';
	import type { User } from '$lib/types';
	import { type JSONContent } from '@tiptap/core';
	import { browser } from '$app/environment';
	import { writable, type Writable } from 'svelte/store';
	import { friends, loadingMessages, server, user } from '$lib/stores';
	import { getProfile } from '$lib/utils';
	import GridImages from './GridImages.svelte';
	import { Skeleton } from '../ui/skeleton';

	export let author: string;
	export let content: JSONContent;
	export let images: string[];
	export let mentions: string[];
	export let time: string;
	export let groupedWithPrevious: boolean;
	export let groupedWithAfter: boolean;
	export let friend_chatbox: boolean;

	let open = writable<boolean>(false);
	let user_profile: User | undefined;
	let user_informations: User = !friend_chatbox
		? $server?.members.find((u) => u.id === author)
		: author === $user.id
			? $user
			: $friends.find((u) => u.id === author);

	async function getUserProfile() {
		open.set(!$open);
		if (!$open) return;

		user_profile = await getProfile($user?.id, author);
	}
</script>

{#if browser}
	<div class="flex gap-x-2 items-end" class:mt-6={!groupedWithPrevious}>
		{#if !groupedWithAfter}
			<Popover.Root onOpenChange={() => getUserProfile()}>
				<Popover.Trigger>
					<div class="flex-shrink-0 h-10 w-10 rounded-xl overflow-hidden">
						{#if $loadingMessages}
							<Skeleton class="w-full h-full" />
						{/if}
						<img class="w-full h-full object-cover" src={user_informations.avatar} alt="" />
					</div>
				</Popover.Trigger>
				<Profile user={user_profile} side="right" />
			</Popover.Root>
		{/if}
		<div class="flex flex-col w-fit">
			{#if images && images.length > 0}
				<div
					class="flex gap-2 max-w-[30rem] [&+div]:rounded-tl-sm overflow-hidden flex-wrap"
					class:ml-[3rem]={groupedWithAfter}
				>
					<GridImages {images} />
				</div>
			{/if}

			{#if content}
				<div
					class="bg-zinc-850 rounded-xl rounded-bl-sm px-5 py-3 mt-1 w-fit text-sm [&>p]:break-all flex flex-col gap-y-1 max-w-[45rem]"
					class:groupMessagePrevious={groupedWithPrevious}
					class:groupMessageAfter={groupedWithAfter}
					class:mentioned={mentions && mentions.includes($user?.id)}
				>
					{#if !groupedWithPrevious}
						<span class="flex items-end gap-x-2 w-fit">
							<p
								style={`
                  color: ${user_informations.username_color?.includes('linear-gradient') ? 'transparent' : user_informations.username_color};
                  background: ${user_informations.username_color?.includes('linear-gradient') ? user_informations.username_color : ''};
                  background-clip: ${user_informations.username_color?.includes('linear-gradient') ? 'text' : ''};
                `}
								class={`text-sm leading-0`}
							>
								{user_informations.display_name}
							</p>
							<time class="text-zinc-400 leading-[1.08rem] text-xs">{formatISODate(time)}</time>
						</span>
					{/if}
					<span
						class="[&>p>a]:text-blue-400 [&>p>a:hover]:underline break-all [&>p>span]:first:ml-0"
					>
						{@html content}
					</span>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="postcss">
	.groupMessagePrevious {
		border-top-left-radius: theme(borderRadius.sm);
	}

	.groupMessageAfter {
		margin-left: calc(theme(margin.10) + theme(margin.2));
	}

	:global([data-type='mention']) {
		color: theme(colors.accent.DEFAULT);
		margin: 0rem 0.2rem;
		border-radius: theme(borderRadius.md);
	}

	.mentioned {
		background-color: #f7b14a2a;
		border: 1px solid #f7b14a;
	}
</style>
