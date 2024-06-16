<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { type Events, type Props, buttonVariants } from './index.js';
	import { cn } from '$lib/utils.js';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	type $$Props = Props;
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';
	export let builders: $$Props['builders'] = [];
	export { className as class };
	export let href: string | null | undefined = '';
</script>

{#if !href}
	<ButtonPrimitive.Root
		{builders}
		class={cn(
			buttonVariants({
				variant,
				size,
				className
			})
		)}
		type="button"
		{...$$restProps}
		on:click
		on:keydown
	>
		<slot />
	</ButtonPrimitive.Root>
{:else if href}
	<button
		class={cn(
			buttonVariants({
				variant,
				size,
				className
			})
		)}
		class:active={$page.url.pathname.includes(href)}
		{...$$restProps}
		on:click={() => goto(href)}
	>
		<slot />
	</button>
{/if}

<style lang="postcss">
	.active {
		color: theme(colors.zinc.50);
		border: 1px solid theme(colors.zinc.50);
	}

	.activeAccent {
		color: theme(colors.zinc.50);
		border: 1px solid theme(colors.accent.DEFAULT);
		background-color: theme(colors.accent.DEFAULT);
	}

	.active:has(> img) {
		border: 3px solid theme(colors.zinc.50);
	}
</style>
