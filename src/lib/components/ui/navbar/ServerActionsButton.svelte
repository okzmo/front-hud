<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import Icon from '@iconify/svelte';
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
				<Dialog.Title>Join or create a server!</Dialog.Title>
				<Dialog.Description
					>To add a friend you just have to enter their username.</Dialog.Description
				>
			</Dialog.Header>
			<div class="flex gap-x-2">
				<Input placeholder="batman" />
				<Button class="py-3">Submit</Button>
			</div>
		</Dialog.Content>
	</Dialog.Root>
</li>
