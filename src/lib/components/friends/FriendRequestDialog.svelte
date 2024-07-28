<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { friendRequestSchema } from './schema-friend-request';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { friendRequest } from '$lib/stores';
	import { formatError } from '$lib/utils';

	let success: boolean = false;

	export let initiator_id: string;
	export let initiator_username: string;

	const form = superForm($friendRequest, {
		validators: zodClient(friendRequestSchema),
		dataType: 'json',
		invalidateAll: false,
		validationMethod: 'submit-only',
		onSubmit({ formData }) {
			formData.set('initiator_id', initiator_id);
			formData.set('initiator_username', initiator_username);
		},
		onResult({ result }) {
			if (result.type === 'success') {
				success = true;
				setTimeout(() => {
					success = false;
					form.reset();
				}, 3000);
			} else if (result.type === 'failure') {
				setTimeout(() => {
					form.reset();
				}, 2000);
			}
		}
	});

	const { form: formData, enhance, errors } = form;
</script>

<Dialog.Content>
	<Dialog.Header>
		<Dialog.Title>Add a new friend!</Dialog.Title>
		<Dialog.Description>To add a friend you just have to enter their username.</Dialog.Description>
	</Dialog.Header>
	<form
		method="POST"
		use:enhance
		class="flex flex-col gap-y-2 relative"
		action="/hudori/chat/friends"
	>
		<Form.Field {form} name="username" class="w-full">
			<div class=" flex gap-x-2">
				<Form.Control let:attrs>
					<Input
						autocomplete="off"
						{...attrs}
						bind:value={$formData.username}
						class={`!mt-0 data-[fs-error]:border-destructive data-[fs-error]:ring-destructive 
                    ${success ? 'border-green-500 focus-visible:ring-green-600' : ''}
                    ${$errors.unexpected ? 'border-destructive focus-visible:ring-destructive' : ''}
                  `}
					/>
				</Form.Control>
				<Button
					type="submit"
					variant="secondary"
					class={`w-24 ${success ? 'bg-green-500 border-none hover:bg-green-600' : 'bg-zinc-850 border border-zinc-725 hover:bg-zinc-725'}`}
				>
					{success ? 'Sent!' : 'Submit'}
				</Button>
			</div>
			{#if $errors.unexpected}
				<div class="!mt-2 text-destructive">{formatError($errors.unexpected[0])}</div>
			{:else}
				<Form.FieldErrors class="mt-2 text-base" />
			{/if}
		</Form.Field>
	</form>
</Dialog.Content>
