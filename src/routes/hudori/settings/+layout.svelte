<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import SettingsLink from '$lib/components/settings/SettingsLink.svelte';
	import { goto } from '$app/navigation';
	import { servers, settingsLastPage } from '$lib/stores';
	import { enhance } from '$app/forms';

	let handleEscape: (event: KeyboardEvent) => void;

	onMount(() => {
		handleEscape = (event) => {
			if (event.key === 'Escape') {
				// Navigate back to the previous page
				goto($settingsLastPage || '/hudori/chat/friends');
				// Remove the event listener to prevent further use
				window.removeEventListener('keydown', handleEscape);
			}
		};

		// Add the event listener for the Escape key
		if (browser) {
			window.addEventListener('keydown', handleEscape);
		}
	});

	onDestroy(() => {
		// Clean up the event listener when the component is destroyed
		if (browser) {
			window.removeEventListener('keydown', handleEscape);
		}
	});

	const firstSpace = Object.entries($servers)[0];
	const firstSpaceId = firstSpace[0]?.split(':')[1];
</script>

<div class="flex max-w-[70rem] mx-auto h-full">
	<div class="flex flex-col items-center w-fit text-zinc-700 group h-fit pt-[4rem]">
		<Button
			href={$settingsLastPage || `/hudori/chat/space/${firstSpaceId}`}
			size="icon"
			class="rounded-full text-zinc-700 group-hover:border-zinc-600 group-hover:text-zinc-600 bg-zinc-500/5 hover:bg-zinc-500/10 duration-75"
		>
			<Icon icon="ph:arrow-left-bold" />
		</Button>
		<span class="group-hover:text-zinc-600 transition-colors duraton-75">ESC</span>
	</div>
	<nav
		class="ml-10 w-[11rem] border-r border-r-zinc-800 pr-5 pt-[4rem] flex flex-col pb-[4rem] shrink-0"
	>
		<ul class="flex flex-col gap-y-2 flex-grow">
			<li>
				<SettingsLink href="/hudori/settings/account" icon="ph:fingerprint-simple-duotone"
					>Account</SettingsLink
				>
			</li>
			<li>
				<SettingsLink href="/hudori/settings/profile" icon="ph:user-duotone">Profile</SettingsLink>
			</li>
		</ul>
		<form method="POST" action="/hudori/settings/account?/logout" use:enhance>
			<Button
				type="submit"
				class="gap-x-3 bg-transparent border-none shadow-none rounded-lg py-1 pl-3 pr-0 w-full justify-start text-base text-destructive hover:bg-destructive hover:text-white duration-100"
				variant="secondary"
			>
				<Icon icon="ph:sign-out-duotone" />
				Log out
			</Button>
		</form>
	</nav>
	<div class="flex-grow pt-[4rem] w-full min-w-[40vw]">
		<slot />
	</div>
</div>
