<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import Icon from '@iconify/svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { defaults, stringProxy, superForm, type Infer } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { channelCreationSchema } from '$lib/components/server/channels/schema-channel-request';
	import { server, servers } from '$lib/stores';
	import type { Channel, Server } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import { formatError } from '$lib/utils';

	export let open: Writable<boolean>;
	export let categoryName: string | undefined;
	const data = defaults(zod(channelCreationSchema));

	const { form, message, enhance, delayed } = superForm<
		Infer<typeof channelCreationSchema>,
		{ status: number; text: string } // Strongly typed status message
	>(data, {
		SPA: true,
		clearOnSubmit: 'errors-and-message',
		validators: zod(channelCreationSchema),
		invalidateAll: false,
		async onUpdate({ form }) {
			if (!form.valid) return;

			const endpoint = `${import.meta.env.VITE_API_URL}/api/v1/channels/create`;
			let body: any = {
				name: form.data.channelName,
				channel_type: form.data.type,
				category_name: categoryName,
				server_id: $server?.id
			};

			try {
				const response = await fetch(endpoint, {
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(body)
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message);
				}

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

	const channelName = stringProxy(form, 'channelName', { empty: 'null' });
	const type = stringProxy(form, 'type', { empty: 'null' });
</script>

<Dialog.Content>
	<Dialog.Header>
		<Dialog.Title>Create a new channel</Dialog.Title>
		<Dialog.Description>Choose what kind of channel you wish to create.</Dialog.Description>
	</Dialog.Header>
	<div class="flex flex-col gap-x-2">
		<form method="POST" use:enhance class="flex flex-col gap-y-2 relative">
			<RadioGroup.Root bind:value={$type}>
				<div
					class="flex items-center space-x-4 border bg-zinc-900 border-zinc-800 py-5 px-3 rounded-lg hover:bg-zinc-850 hover:border-zinc-750 transition-colors hover:cursor-pointer relative"
					class:active={$type === 'voice'}
				>
					<RadioGroup.Item value="voice" id="voice" class="absolute opacity-0" />
					<Icon icon="ph:speaker-simple-low-duotone" height="26" width="26" />
					<Label
						for="voice"
						class="after:content-normal after:absolute after:left-0 after:top-0 after:w-full after:h-full hover:cursor-pointer text-base"
						>Voice channel</Label
					>
				</div>
				<div
					class="flex items-center space-x-4 border bg-zinc-900 border-zinc-800 py-5 px-3 rounded-lg hover:bg-zinc-850 hover:border-zinc-750 transition-colors hover:cursor-pointer relative"
					class:active={$type === 'textual'}
				>
					<RadioGroup.Item value="textual" id="textual" class="absolute opacity-0" />
					<Icon icon="ph:chat-teardrop-text-duotone" height="26" width="26" />
					<Label
						for="textual"
						class="after:content-normal after:absolute after:left-0 after:top-0 after:w-full after:h-full hover:cursor-pointer text-base"
						>Text channel</Label
					>
				</div>
			</RadioGroup.Root>
			<div class="mt-1 relative">
				<Dialog.Description>Channel name</Dialog.Description>
				<Input bind:value={$channelName} placeholder="Memes" class="mt-2" />
				{#if $message}
					<p class="text-destructive mt-1">{$message.text}</p>
				{/if}
			</div>
			<Button type="submit" class="py-3 mt-0 w-full">
				{#if $delayed}
					Creating...
				{:else}
					Create
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
