<script lang="ts">
	import { user } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import ProfileBannerDialog from '$lib/components/settings/ProfileBannerDialog.svelte';
	import { writable } from 'svelte/store';
	import ProfileAvatarDialog from '$lib/components/settings/ProfileAvatarDialog.svelte';

	let openBanner = writable<boolean>(false);
	let openAvatar = writable<boolean>(false);
</script>

<div class="flex flex-col w-fit mx-auto">
	<p class="w-fit text-zinc-400 max-w-[45rem]">
		This is your profile, everybody will see your username, name, about me, banner and avatar.
	</p>
	<div class="relative aspect-[40/25] w-full h-full mt-4">
		<Button
			class="right-4 top-4 z-[2] absolute rounded-xl bg-zinc-800/50 hover:bg-zinc-800/75 border-none shadow-none backdrop-blur-lg"
			size="icon"
			on:click={() => openBanner.set(true)}
		>
			<Icon icon="ph:pencil-simple-duotone" height={20} width={20} />
		</Button>
		<div class="rounded-[1.5rem] flex relative px-[1.45rem] py-3 h-full">
			<div class="w-full h-full absolute left-0 top-0 object-cover rounded-[1.1rem] bg-zinc-700" />
			<img
				class="w-full h-full absolute left-0 top-0 object-contain rounded-[1.6rem] transform-gpu"
				src={$user?.banner}
				alt=""
			/>
			<div class="flex flex-col justify-end gap-y-2 z-[2]">
				<span class="flex gap-x-3">
					<button on:click={() => openAvatar.set(true)}>
						<img class="w-20 h-20 object-cover rounded-2xl" src={$user?.avatar} alt="" />
					</button>
					<span class="flex flex-col justify-end mb-2">
						<p class="text-sm leading-3">{$user?.display_name}</p>
						<p class="text-sm leading-5 text-zinc-400">{$user?.username}</p>
					</span>
				</span>
				<p class="text-sm leading-[1.10rem]">{$user?.about_me}</p>
			</div>
			<div class="w-full absolute h-full progressive-blur rounded-[1.5rem]"></div>
		</div>
	</div>
</div>

<Dialog.Root open={$openBanner} onOpenChange={() => openBanner.set(!openBanner)}>
	<ProfileBannerDialog dialogState={openBanner} />
</Dialog.Root>

<Dialog.Root open={$openAvatar} onOpenChange={() => openAvatar.set(!openAvatar)}>
	<ProfileAvatarDialog dialogState={openAvatar} />
</Dialog.Root>

<style lang="postcss">
	.progressive-blur {
		backdrop-filter: blur(40px);
		-webkit-backdrop-filter: blur(40px);
		inset: 0;

		mask-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 85%, rgb(0, 0, 0));
		-webkit-mask-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 85%, rgb(0, 0, 0));
	}
</style>
