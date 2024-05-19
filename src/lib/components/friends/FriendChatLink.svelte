<script lang="ts">
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import FriendsContextMenu from './FriendsContextMenu.svelte';
	export let href: string = '';
	export let username: string;
	export let about_me: string = '';
	export let avatar: string = '';
	export let status: string = 'bg-offline';
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<button
			on:click={() => goto(href)}
			class="flex gap-x-3 hover:bg-zinc-800/75 p-3 rounded-2xl active:scale-[0.97] items-center w-full"
			class:active={$page.url.pathname.includes(href)}
			id="friend-link"
		>
			<div
				id="friend-avatar"
				class={`h-12 w-12 relative before:block before:h-3 before:w-3 before:border-2 before:border-zinc-900 before:absolute before:-bottom-2 before:rounded-xl before:left-1/2 before:-translate-x-1/2 before:z-10 before:transition-[width] before:duration-200 before:ease-bounce-hard`}
				class:before:bg-online={status === 'online'}
				class:before:bg-dontdisturb={status === 'dontdisturb'}
				class:before:bg-absent={status === 'absent'}
				class:before:bg-offline={status === 'offline'}
			>
				<img class="w-full rounded-xl h-full object-cover" src={avatar} alt="" />
			</div>
			<div class="text-left">
				<p class="text-lg leading-none font-medium">{username}</p>
				{#if about_me}
					<p class="text-zinc-500 leading-none mt-1 font-light">{about_me}</p>
				{/if}
			</div>
		</button>
	</ContextMenu.Trigger>
	<FriendsContextMenu />
</ContextMenu.Root>

<style lang="postcss">
	.active {
		background-color: theme(colors.zinc.800);
		border-color: theme(colors.zinc.800);
	}

	.active:hover {
		background-color: theme(colors.zinc.850);
	}

	.active > #friend-avatar::before {
		width: 1.5rem !important;
	}

	#friend-link {
		transition:
			transform 75ms ease-out,
			background-color 75ms ease-out;
	}
</style>
