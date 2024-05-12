<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { enhance } from '$app/forms';
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import type { ActionData } from '../../../routes/hudori/chat/friends/[id]/$types';
	import type { ActionResult } from '@sveltejs/kit';

	let username: string;
	let success: boolean = false;
	let failure: string | undefined;

	export let initiator_id: string;
	export let initiator_username: string;

	export let form: ActionData;

	function handleResult(
		result: ActionResult<Record<string, unknown> | undefined, Record<string, unknown> | undefined>
	) {
		success = result.type === 'success';

		switch (result.type) {
			case 'success':
				success = true;
				username = '';
				setTimeout(() => {
					success = false;
				}, 3000);
				break;
			case 'failure':
				const message = result.data?.message as String;
				failure = message[0].toUpperCase() + message.slice(1) + '.';
				setTimeout(() => {
					failure = undefined;
				}, 3000);
				break;
			default:
				console.log(result);
		}
	}
</script>

<Dialog.Content>
	<Dialog.Header>
		<Dialog.Title>Add a new friend!</Dialog.Title>
		<Dialog.Description>To add a friend you just have to enter their username.</Dialog.Description>
	</Dialog.Header>
	<form
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				handleResult(result);
			};
		}}
		class="flex flex-col gap-y-2"
		action="/hudori/chat/friends"
	>
		<Input name="initiator_id" type="hidden" value={initiator_id} />
		<Input name="initiator_username" type="hidden" value={initiator_username} />
		<div class="flex gap-x-2">
			<Input
				name="username"
				placeholder="batman"
				bind:value={username}
				class={`border-zinc-725 focus-visible:ring-zinc-500 
          ${success ? 'border-green-500 focus-visible:ring-green-500' : ''}
          ${failure ? 'border-destructive focus-visible:ring-destructive' : ''}
        `}
				autocomplete="off"
			/>
			<Button
				type="submit"
				class={`w-24 ${success ? 'bg-green-500 border-none hover:bg-green-600' : 'bg-zinc-850 border border-zinc-725 hover:bg-zinc-725'}`}
			>
				{success ? 'Sent!' : 'Submit'}
			</Button>
		</div>
		{#if failure}
			<p class="text-destructive">{failure}</p>
		{/if}
	</form>
</Dialog.Content>
