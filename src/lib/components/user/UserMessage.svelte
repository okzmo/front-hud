<script lang="ts">
	import { formatISODate } from '$lib/utils';

	export let sender: boolean = false;
	export let content: string;
	export let name: string;
	export let avatar: string;
	export let time: string;
	export let groupedWithPrevious: boolean;
	export let groupedWithAfter: boolean;
</script>

{#if sender}
	<div class="flex gap-x-3 max-w-3xl self-end" class:mt-6={!groupedWithPrevious}>
		<div class="flex flex-col">
			{#if !groupedWithPrevious}
				<span class="flex justify-end items-end gap-x-2">
					<time class="text-zinc-650 leading-5">{formatISODate(time)}</time>
					<p>{name}</p>
				</span>
			{/if}
			<p
				class="bg-accent rounded-3xl rounded-tr-sm px-5 py-4 mt-1 w-fit self-end"
				class:smaller_message={content.length < 75}
				class:groupMessagePreviousSender={groupedWithPrevious}
				class:groupMessageAfterSender={groupedWithAfter}
			>
				{content}
			</p>
		</div>
		{#if !groupedWithPrevious}
			<div class="flex-shrink-0 h-14 w-14 rounded-2xl overflow-hidden">
				<img class="w-full h-full object-cover" src={avatar} alt="" />
			</div>
		{/if}
	</div>
{:else}
	<div class="flex gap-x-3 max-w-3xl" class:mt-6={!groupedWithPrevious}>
		{#if !groupedWithPrevious}
			<div class="flex-shrink-0 h-14 w-14 rounded-2xl overflow-hidden">
				<img class="w-full h-full object-cover" src={avatar} alt="" />
			</div>
		{/if}
		<div class="flex flex-col">
			{#if !groupedWithPrevious}
				<span class="flex gap-x-2">
					<p>{name}</p>
					<time class="text-zinc-650 leading-5">{formatISODate(time)}</time>
				</span>
			{/if}
			<p
				class="bg-zinc-800 rounded-3xl rounded-tl-sm px-5 py-4 mt-1 w-fit"
				class:smaller_message={content.length < 75}
				class:groupMessagePrevious={groupedWithPrevious}
				class:groupMessageAfter={groupedWithAfter}
			>
				{content}
			</p>
		</div>
	</div>
{/if}

<style lang="postcss">
	.smaller_message {
		padding: 0.75rem 1.25rem;
	}

	.groupMessagePrevious {
		margin-left: calc(theme(margin.14) + theme(margin.3));
	}

	.groupMessagePreviousSender {
		margin-right: calc(theme(margin.14) + theme(margin.3));
	}

	.groupMessageAfter {
		border-bottom-left-radius: theme(borderRadius.sm);
	}

	.groupMessageAfterSender {
		border-bottom-right-radius: theme(borderRadius.sm);
	}
</style>
