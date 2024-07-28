import { type VariantProps, tv } from 'tailwind-variants';
import type { Button as ButtonPrimitive } from 'bits-ui';
import Root from './button.svelte';

const buttonVariants = tv({
	base: 'flex items-center justify-center whitespace-nowrap rounded-[2rem] text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:rounded-[1rem]',
	variants: {
		variant: {
			default:
				'relative button-gradient-border bg-zinc-900 text-zinc-50 hover:bg-zinc-800 active:scale-[0.95] ',
			secondary:
				'bg-zinc-900 border border-zinc-800 rounded-lg hover:rounded-lg hover:bg-zinc-850 active:scale-[0.97]',
			altDefault:
				'relative button-gradient-border bg-zinc-900 text-zinc-50 hover:bg-zinc-800 active:scale-[0.95] hover:rounded-lg transition-opacity',
			destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
			outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			link: 'text-primary underline-offset-4 hover:underline'
		},
		size: {
			default: 'px-4 py-2',
			sm: 'h-9 rounded-md px-3',
			lg: 'h-11 rounded-md px-8',
			icon: 'h-10 w-10'
		},
		active: {
			true: '!text-zinc-50'
		}
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
		active: false
	}
});

type Variant = VariantProps<typeof buttonVariants>['variant'];
type Size = VariantProps<typeof buttonVariants>['size'];
type Active = VariantProps<typeof buttonVariants>['active'];

type Props = ButtonPrimitive.Props & {
	variant?: Variant;
	size?: Size;
	active?: Active;
};

type Events = ButtonPrimitive.Events;

export {
	Root,
	type Props,
	type Events,
	//
	Root as Button,
	type Props as ButtonProps,
	type Events as ButtonEvents,
	buttonVariants
};
