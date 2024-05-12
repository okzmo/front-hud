<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	export let href: string = '';
	export let type: string = 'text';
	export let channelName: string = 'Channel';
</script>

<a
	{href}
	class="flex gap-x-3 hover:bg-zinc-800/75 py-[0.55rem] text-zinc-500 px-3 rounded-xl transition duration-75 active:scale-[0.97] items-center w-full"
	class:active={$page.url.pathname.includes(href)}
>
	{#if type === 'textual'}
		<Icon icon="ph:chat-teardrop-text-duotone" height="22" width="22" />
	{:else if type === 'voice'}
		<Icon icon="ph:speaker-simple-low-duotone" height="22" width="22" />
	{/if}
	<p class="text-lg leading-none">{channelName}</p>
</a>

<style lang="postcss">
	.active {
		background-color: rgba(39, 39, 42, 0.75);
		color: theme(colors.zinc.50);
	}
</style>
