<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	let handleEscape: (event: KeyboardEvent) => void;

	onMount(() => {
		handleEscape = (event) => {
			if (event.key === 'Escape') {
				// Navigate back to the previous page
				window.history.back();
				// Remove the event listener to prevent further use
				window.removeEventListener('keydown', handleEscape);
			}
		};

		// Add the event listener for the Escape key
		window.addEventListener('keydown', handleEscape);
	});

	onDestroy(() => {
		// Clean up the event listener when the component is destroyed
		window.removeEventListener('keydown', handleEscape);
	});
</script>

<h1>settings</h1>
