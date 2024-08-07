<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import Cropper from 'svelte-easy-crop';
	import Button from '../ui/button/button.svelte';
	import Dropzone from 'svelte-file-dropzone';
	import Icon from '@iconify/svelte';
	import { friends, servers, user } from '$lib/stores';
	import type { Writable } from 'svelte/store';
	import { removeCachedProfile } from '$lib/utils';
	import { page } from '$app/stores';
	let crop = { x: 0, y: 0 };
	let zoom = 1;
	let image: string | undefined = undefined;
	let file: Blob | string | undefined;
	let croppingElements: any;

	export let dialogState: Writable<boolean>;

	let uploading = false;

	function handleFilesSelect(e) {
		const { acceptedFiles } = e.detail;
		if (acceptedFiles.length > 0) {
			const image = acceptedFiles[0];
			file = acceptedFiles[0];
			readImage(image);
		}
	}
	function readImage(imageFile: any) {
		const reader = new FileReader();
		reader.onload = (e) => {
			image = e.target?.result as string | undefined;
		};
		reader.readAsDataURL(imageFile);
	}

	async function submitAvatar() {
		if (!image || !file) return;

		uploading = true;
		const form = new FormData();
		const old_avatar = $user?.avatar.split('/').at(-1);
		form.append('avatar', file);
		form.append('cropY', croppingElements.pixels.y);
		form.append('cropX', croppingElements.pixels.x);
		form.append('cropWidth', croppingElements.pixels.width);
		form.append('cropHeight', croppingElements.pixels.height);
		form.append('old_avatar', old_avatar!);
		if ($servers[`servers:${$page.params.serverId}`]) {
			form.append('server_id', `servers:${$page.params.serverId}`);
		}
		if ($friends) {
			form.append('friends', JSON.stringify($friends.map((friend) => friend.id)));
		}

		const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/change_avatar`, {
			method: 'POST',
			credentials: 'include',
			body: form,
			headers: {
				'X-User-Agent': navigator.userAgent,
				'X-User-ID': $user?.id
			}
		});

		if (!response.ok) {
			console.error('Image upload failed', response.status);
		}

		const data = await response.json();
		uploading = false;
		user.update((user) => {
			user.avatar = data.avatar;
			return user;
		});

		dialogState.set(false);
		image = undefined;
		crop = { x: 0, y: 0 };
		zoom = 1;
		file = undefined;

		await removeCachedProfile($user?.id);
	}
</script>

<Dialog.Content class="max-w-[30rem] aspect-square">
	<Dialog.Header>
		<Dialog.Title>Change your avatar</Dialog.Title>
		<Dialog.Description
			>Click to choose an image or drag and drop then crop it and save!</Dialog.Description
		>
	</Dialog.Header>
	<div
		class={`relative w-full h-[20rem] border border-zinc-800 ${image ? 'bg-zinc-800' : 'bg-zinc-925'}`}
	>
		{#if image}
			<Cropper
				on:cropcomplete={(e) => (croppingElements = e.detail)}
				{image}
				showGrid={false}
				aspect={40 / 40}
				bind:zoom
				bind:crop
				zoomSpeed={0.2}
			/>
		{:else}
			<Dropzone
				on:drop={handleFilesSelect}
				containerClasses="h-full justify-center !bg-transparent !text-zinc-700"
				accept={['image/*']}
			>
				<Icon icon="ph:image-duotone" height={100} width={100} />
				Choose an image and crop it!
			</Dropzone>
		{/if}
	</div>
	<div class="flex w-full gap-x-2">
		{#if image}
			<Button
				size="icon"
				on:click={() => (image = undefined)}
				class="shadow-none border-none bg-destructive hover:bg-red-600"
				variant="secondary"
			>
				<Icon icon="ph:trash-duotone" height={20} width={20} />
			</Button>
		{/if}
		<Button
			variant="secondary"
			class="flex-1"
			disabled={!image || uploading}
			on:click={submitAvatar}>{uploading ? 'Uploading...' : 'Save'}</Button
		>
	</div>
</Dialog.Content>
