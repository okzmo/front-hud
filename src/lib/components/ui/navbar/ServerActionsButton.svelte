<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Icon from '@iconify/svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import Label from '../label/label.svelte';
	import Input from '../input/input.svelte';

	let radio: string = 'join';
</script>

<li>
	<Dialog.Root>
		<Dialog.Trigger>
			<Button class="h-14 w-14 rounded-xl text-zinc-500" size="icon">
				<Icon icon="ph:plus-light" height="26" width="26" />
			</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Join or create a community!</Dialog.Title>
				<Dialog.Description
					>A community is a way to gather your friends or a group of people in a single place.</Dialog.Description
				>
			</Dialog.Header>
			<div class="flex flex-col gap-x-2">
				<RadioGroup.Root bind:value={radio}>
					<div
						class="flex items-center space-x-4 border bg-zinc-900 border-zinc-800 py-5 px-3 rounded-lg hover:bg-zinc-850 hover:border-zinc-750 transition-colors hover:cursor-pointer relative"
						class:active={radio === 'create'}
					>
						<RadioGroup.Item value="create" id="create" class="absolute opacity-0" />
						<Icon icon="ph:plus" height="26" width="26" />
						<Label
							for="create"
							class="after:content-normal after:absolute after:left-0 after:top-0 after:w-full after:h-full hover:cursor-pointer text-base"
							>Create a community</Label
						>
					</div>
					<div
						class="flex items-center space-x-4 border bg-zinc-900 border-zinc-800 py-5 px-3 rounded-lg hover:bg-zinc-850 hover:border-zinc-750 transition-colors hover:cursor-pointer relative"
						class:active={radio === 'join'}
					>
						<RadioGroup.Item value="join" id="join" class="absolute opacity-0" />
						<Icon icon="ph:users-four-duotone" height="26" width="26" />
						<Label
							for="join"
							class="after:content-normal after:absolute after:left-0 after:top-0 after:w-full after:h-full hover:cursor-pointer text-base"
							>Join a community</Label
						>
					</div>
				</RadioGroup.Root>
				<div class="mt-5">
					{#if radio === 'create'}
						<Dialog.Description
							>To create a community you just need to enter its name.</Dialog.Description
						>
						<Input name="id" placeholder="Name of your new community" class="mt-2" />
					{:else if radio === 'join'}
						<Dialog.Description
							>To join a community you just need to enter the invite you've been given.</Dialog.Description
						>
						<Input name="id" placeholder="https://hudori.app/Je8dkeU" class="mt-2" />
					{/if}
				</div>
				<Button type="submit" class="py-3 mt-4">{radio === 'create' ? 'Create' : 'Join'}</Button>
			</div>
		</Dialog.Content>
	</Dialog.Root>
</li>

<style lang="postcss">
	.active {
		background-color: theme(colors.zinc.850);
		border-color: theme(colors.zinc.750);
	}
</style>
