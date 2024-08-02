<script>
	import '../app.css';
</script>

<div class="absolute h-[28px] top-0 w-screen z-50" data-tauri-drag-region></div>

<slot />

<style lang="postcss">
	:global(body) {
		background-color: theme(colors.zinc.950);
		color: theme(colors.zinc.50);
		height: 100vh;
		font-family: 'Outfit';
	}
</style>
