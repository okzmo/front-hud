<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import Cropper from 'svelte-easy-crop';
	import Button from '$lib/components/ui/button/button.svelte';
	import Dropzone from 'svelte-file-dropzone';
	import Icon from '@iconify/svelte';
	import { servers, user, sessStore } from '$lib/stores';
	import type { Writable } from 'svelte/store';
	import { cacheImage, removeCachedProfile } from '$lib/utils';
	import { page } from '$app/stores';
	import { fetch, Body } from '@tauri-apps/api/http';
	import { BaseDirectory, removeFile } from '@tauri-apps/api/fs';

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

	async function submitBanner() {
		if (!image || !file) return;

		uploading = true;
		const form = new FormData();
		const old_banner = $servers[`servers:${$page.params.serverId}`]?.banner?.split('/').pop();
		form.append('banner', file);
		form.append('cropY', croppingElements.pixels.y);
		form.append('cropX', croppingElements.pixels.x);
		form.append('cropWidth', croppingElements.pixels.width);
		form.append('cropHeight', croppingElements.pixels.height);
		form.append('old_banner', old_banner!);
		form.append('server_id', `servers:${$page.params.serverId}`);

		const sessionId = await sessStore.get('sessionId');
		const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/server/change_banner`, {
			method: 'POST',
			body: Body.form(form),
			headers: {
				'Content-type': 'multipart/form-data',
				'X-User-ID': $user?.id,
				Authorization: `Bearer ${sessionId}`
			}
		});

		if (!response.ok) {
			console.log(response.data);
			console.error('Image upload failed', response.status);
		}

		const data = response.data as { banner: string };

		if (old_banner) {
			await removeFile(`images/${old_banner}`, { dir: BaseDirectory.AppCache });
		}
		const new_banner = data.banner.split('/').pop();
		await cacheImage(data.banner, new_banner!);

		uploading = false;
		servers.update((server) => {
			const serverExist = server[`servers:${$page.params.serverId}`];
			if (serverExist) {
				serverExist.banner = data.banner;
			}
			return server;
		});
		dialogState.set(false);
		image = undefined;
		crop = { x: 0, y: 0 };
		zoom = 1;
		file = undefined;

		await removeCachedProfile($user?.id);
	}
</script>

<Dialog.Content class="max-w-auto">
	<Dialog.Header>
		<Dialog.Title>Change the server banner</Dialog.Title>
		<Dialog.Description
			>Click to choose an image or drag and drop then crop it and save!</Dialog.Description
		>
	</Dialog.Header>
	<div
		class={`relative w-full h-[17rem] aspect-[27/21] border border-zinc-800 ${image ? 'bg-zinc-800' : 'bg-zinc-925'}`}
	>
		{#if image}
			<Cropper
				on:cropcomplete={(e) => (croppingElements = e.detail)}
				{image}
				showGrid={false}
				aspect={27 / 21}
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
			on:click={submitBanner}>{uploading ? 'Uploading...' : 'Save'}</Button
		>
	</div>
</Dialog.Content>
