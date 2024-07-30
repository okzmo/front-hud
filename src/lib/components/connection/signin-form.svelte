<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm, setError, fail, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import Icon from '@iconify/svelte';
	import { signinFormSchema } from './schema-signin';
	import { fetch, Body } from '@tauri-apps/api/http';
	import { user } from '$lib/stores';
	import type { User } from '$lib/types';
	import { sessStore } from '$lib/stores';
	import { goto } from '$app/navigation';

	const data = defaults(zod(signinFormSchema));

	const form = superForm(data, {
		SPA: true,
		validators: zod(signinFormSchema),
		dataType: 'json',
		clearOnSubmit: 'errors-and-message',
		async onUpdate({ form }) {
			if (!form.valid) return;

			const endpoint = `${import.meta.env.VITE_API_URL}/auth/signin`;
			console.log(endpoint);

			try {
				const response = await fetch(endpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: Body.json(form.data)
				});
				console.log(response);
				const data = response.data as {
					message: string;
					name?: string;
					user: User;
					sessionId: string;
				};

				if (!response.ok) {
					return setError(form, data.name, data.message);
				}

				user.set(data.user);
				try {
					await sessStore.set('sessionId', data.sessionId);
					goto('/hudori/chat/friends');
				} catch (e) {
					console.error(e);
				}
			} catch (e) {
				return fail(500, { error: 'An unexpected error occured.' });
			}
		}
	});

	const { form: formData, enhance, errors } = form;
</script>

<div class="w-full h-full flex justify-center items-center">
	<form method="POST" use:enhance class="flex flex-col gap-5 min-w-[20rem]">
		<Form.Field {form} name="email" class="relative">
			<Form.Control let:attrs>
				<div class="flex space-x-2 items-end">
					<Form.Label
						class="text-zinc-500 after:content-['-'] gap-x-2 flex items-center after:opacity-0 data-[fs-error]:after:opacity-100 text-base leading-none"
						>Email</Form.Label
					>
					<Form.FieldErrors class="leading-none font-normal" />
				</div>
				<div class="relative">
					<Icon
						icon="ph:envelope-duotone"
						height={22}
						width={22}
						class="text-zinc-500 absolute top-1/2 -translate-y-1/2 left-3"
					/>
					<Input
						{...attrs}
						bind:value={$formData.email}
						class="pl-11 !mt-0 data-[fs-error]:border-destructive data-[fs-error]:ring-destructive"
					/>
				</div>
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="password" class="relative">
			<Form.Control let:attrs>
				<div class="flex space-x-2 items-center">
					<Form.Label
						class="text-zinc-500 after:content-['-'] gap-x-2 flex items-center after:opacity-0 data-[fs-error]:after:opacity-100 text-base leading-none"
						>Password</Form.Label
					>
					<Form.FieldErrors class="leading-none font-normal" />
				</div>
				<div class="relative">
					<Icon
						icon="ph:lock-key-duotone"
						height={22}
						width={22}
						class="text-zinc-500 absolute top-1/2 -translate-y-1/2 left-3"
					/>
					<Input
						{...attrs}
						bind:value={$formData.password}
						type="password"
						class="pl-11 !mt-0 data-[fs-error]:border-destructive data-[fs-error]:ring-destructive"
					/>
				</div>
			</Form.Control>
		</Form.Field>
		<Form.Button>Sign in</Form.Button>

		{#if $errors.unexpected}<span class="text-destructive">{$errors.unexpected}</span>{/if}
	</form>
</div>
