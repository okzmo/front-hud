<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import Icon from '@iconify/svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { defaults, stringProxy, superForm, type Infer } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { serverCreationSchema } from '$lib/components/server/schema-server-request';
	import { servers, sessStore, user } from '$lib/stores';
	import type { Server } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import { formatError } from '$lib/utils';
	import { fetch, Body } from '@tauri-apps/api/http';

	export let open: Writable<boolean>;
	const data = defaults(zod(serverCreationSchema));

	const { form, message, enhance, delayed } = superForm<
		Infer<typeof serverCreationSchema>,
		{ status: number; text: string } // Strongly typed status message
	>(data, {
		SPA: true,
		clearOnSubmit: 'errors-and-message',
		validators: zod(serverCreationSchema),
		invalidateAll: false,
		async onUpdate({ form }) {
			if (!form.valid) return;

			const endpoint = `${import.meta.env.VITE_API_URL}/api/v1/server/${form.data.type}`;
			let body: any = {};

			if (form.data.type === 'create') {
				body['user_id'] = $user.id;
				body['name'] = form.data.id;
			} else {
				body['user'] = $user;
				body['invite_id'] = form.data.id;
			}

			const sessId = await sessStore.get('sessionId');
			try {
				const response = await fetch(endpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-User-ID': $user?.id,
						Authorization: `Bearer ${sessId}`
					},
					body: Body.json(body)
				});
				const data = response.data as { message: string; server: Server };

				if (!response.ok) {
					throw new Error(data.message);
				}

				const server = data.server;
				servers.update((servers) => {
					if (form.data.type === 'create') {
						server.roles = ['owner'];
					}
					servers[server.id] = server;
					return servers;
				});
				open.set(false);
				message.set(undefined);
			} catch (e) {
				form.message = { status: 500, text: formatError(e.message) };
			}
		}
	});

	$: if ($open === false) {
		message.set(undefined);
	}

	const id = stringProxy(form, 'id', { empty: 'null' });
	const type = stringProxy(form, 'type', { empty: 'null' });
</script>

<Dialog.Content>
	<Dialog.Header>
		<Dialog.Title>Join or create a space!</Dialog.Title>
		<Dialog.Description>
			A space is a way to gather your friends or a group of people in a single place.
		</Dialog.Description>
	</Dialog.Header>
	<div class="flex flex-col gap-x-2">
		<form method="POST" use:enhance class="flex flex-col gap-y-2 relative">
			<RadioGroup.Root bind:value={$type}>
				<div
					class="flex items-center space-x-4 border bg-zinc-900 border-zinc-800 py-5 px-3 rounded-lg hover:bg-zinc-850 hover:border-zinc-750 transition-colors hover:cursor-pointer relative"
					class:active={$type === 'create'}
				>
					<RadioGroup.Item value="create" id="create" class="absolute opacity-0" />
					<Icon icon="solar:add-circle-bold-duotone" height="26" width="26" />
					<Label
						for="create"
						class="after:content-normal after:absolute after:left-0 after:top-0 after:w-full after:h-full hover:cursor-pointer text-base"
						>Create a space</Label
					>
				</div>
				<div
					class="flex items-center space-x-4 border bg-zinc-900 border-zinc-800 py-5 px-3 rounded-lg hover:bg-zinc-850 hover:border-zinc-750 transition-colors hover:cursor-pointer relative"
					class:active={$type === 'join'}
				>
					<RadioGroup.Item value="join" id="join" class="absolute opacity-0" />
					<Icon icon="solar:users-group-rounded-bold-duotone" height="26" width="26" />
					<Label
						for="join"
						class="after:content-normal after:absolute after:left-0 after:top-0 after:w-full after:h-full hover:cursor-pointer text-base"
						>Join a space</Label
					>
				</div>
			</RadioGroup.Root>
			<div class="mt-5 relative">
				<Dialog.Description>
					{#if $type === 'create'}
						To create a space you just need to enter its name.
					{:else}
						To join a space you just need to enter the invite you've been given.
					{/if}
				</Dialog.Description>
				<Input
					bind:value={$id}
					placeholder={$type === 'create' ? 'Name of your new space' : 'https://hudori.app/Je8dkeU'}
					class="mt-2"
				/>
				{#if $message}
					<p class="text-destructive mt-1">{$message.text}</p>
				{/if}
			</div>
			<Button type="submit" class="py-3 mt-0 w-full" variant="secondary">
				{#if $type === 'create'}
					{#if $delayed}
						Creating...
					{:else}
						Create
					{/if}
				{:else if $delayed}
					Joining...
				{:else}
					Join
				{/if}
			</Button>
		</form>
	</div>
</Dialog.Content>

<style lang="postcss">
	.active {
		background-color: theme(colors.zinc.850);
		border-color: theme(colors.zinc.750);
	}
</style>
