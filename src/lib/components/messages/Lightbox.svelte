<script lang="ts">
	import { lightboxImages } from '$lib/stores';
	import { onDestroy, onMount } from 'svelte';
	import { closeLightbox } from '$lib/utils';

	let lightbox: HTMLElement;

	onMount(() => {
		lightbox.addEventListener('click', closeLightbox);
		document.addEventListener('keydown', handleClose);
	});

	onDestroy(() => {
		lightbox.removeEventListener('click', closeLightbox);
		document.removeEventListener('keydown', handleClose);
	});

	function handleClose(e: KeyboardEvent) {
		if (e.key === 'Escape' && lightbox.classList.contains('showLightBox')) {
			closeLightbox();
		}
	}
</script>

<dialog
	bind:this={lightbox}
	id="lightbox"
	class="pointer-events-none absolute bg-zinc-950/70 backdrop-blur-md left-0 top-0 h-full w-full z-50 opacity-0 transition-opacity flex justify-center items-center"
>
	<img
		src={$lightboxImages}
		alt="Lightbox"
		class="max-w-[70%] max-h-[70%] object-contain rounded-xl"
	/>
</dialog>

<style>
	:global(.showLightBox) {
		pointer-events: auto !important;
		opacity: 100% !important;
	}
</style>
