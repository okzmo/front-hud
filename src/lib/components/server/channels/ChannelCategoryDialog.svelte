<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { defaults, stringProxy, superForm, type Infer } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { categoryCreationSchema } from '$lib/components/server/channels/schema-category-request';
	import { server, user } from '$lib/stores';
	import type { Writable } from 'svelte/store';
	import { formatError } from '$lib/utils';

	export let open: Writable<boolean>;
	const data = defaults(zod(categoryCreationSchema));

	const { form, message, enhance, delayed } = superForm<
		Infer<typeof categoryCreationSchema>,
		{ status: number; text: string } // Strongly typed status message
	>(data, {
		SPA: true,
		clearOnSubmit: 'errors-and-message',
		validators: zod(categoryCreationSchema),
		invalidateAll: false,
		async onUpdate({ form }) {
			if (!form.valid) return;

			const endpoint = `${import.meta.env.VITE_API_URL}/api/v1/category/create`;
			let body: any = {
				server_id: $server?.id,
				category_name: form.data.categoryName
			};

			try {
				const response = await fetch(endpoint, {
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						'X-User-Agent': navigator.userAgent,
						'X-User-ID': $user?.id
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

	const categoryName = stringProxy(form, 'categoryName', { empty: 'null' });
</script>

<Dialog.Content>
	<Dialog.Header>
		<Dialog.Title>Create a new category</Dialog.Title>
		<Dialog.Description>A great way to organize your channels.</Dialog.Description>
	</Dialog.Header>
	<div class="flex flex-col gap-x-2">
		<form method="POST" use:enhance class="flex flex-col gap-y-2 relative">
			<div class="relative">
				<Dialog.Description>Category name</Dialog.Description>
				<Input bind:value={$categoryName} placeholder="Memes" class="mt-2" />
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
