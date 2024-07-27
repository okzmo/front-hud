<script lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	type $$Props = ContextMenuPrimitive.ItemProps & {
		inset?: boolean;
	};
	type $$Events = ContextMenuPrimitive.ItemEvents;

	let className: $$Props['class'] = undefined;
	export let inset: $$Props['inset'] = undefined;
	export { className as class };
</script>

<ContextMenuPrimitive.Item
	class={cn(
		'context-item relative flex first:mt-0 cursor-pointer select-none items-center rounded-lg pl-2 pr-5 py-2 text-base outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-50015 data-[highlighted]:transition-colors data-[highlighted]:duration-75 data-[disabled]:opacity-50 hover:text-zinc-50',
		inset && 'pl-8',
		className
	)}
	{...$$restProps}
	on:click
	on:keydown
	on:focusin
	on:focusout
	on:pointerdown
	on:pointerleave
	on:pointermove
>
	<slot />
</ContextMenuPrimitive.Item>

<style>
	:global(.context-item:hover::before) {
		opacity: 100;
	}

	:global(.context-item::before) {
		content: '';
		position: absolute;
		opacity: 0;
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
