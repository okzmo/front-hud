<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { type Events, type Props, buttonVariants } from './index.js';
	import { cn } from '$lib/utils.js';
	import { page } from '$app/stores';
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
			'transition-buttons',
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
	<a
		class={cn(
			'transition-buttons',
			buttonVariants({
				variant,
				size,
				className
			})
		)}
		class:active={$page.url.pathname.includes(href)}
		{...$$restProps}
		{href}
	>
		<slot />
	</a>
{/if}

<style lang="postcss">
	.active {
		color: theme(colors.zinc.50);
		border-radius: 1rem;
	}

	.active::after {
		border-radius: 0.8rem;
	}

	.active:has(> img) {
		border: 0px solid theme(colors.zinc.50);
	}

	:global(.transition-buttons) {
		transition:
			border-radius 250ms ease-out,
			background-color 150ms ease-out,
			transform 150ms ease-out,
			opacity 75ms ease-out;
	}

	:global(.button-gradient-border::before) {
		content: '';
		position: absolute;
		opacity: 100%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: inherit;
		padding: 1px; /* This determines the border thickness */
		background: linear-gradient(to bottom, rgba(113, 113, 122, 0.3) 0%, rgba(113, 113, 122, 0) 35%);
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		transition: opacity 75ms ease-out;
	}
</style>
