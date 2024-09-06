<script>
	import '../app.css';
</script>

<div class="absolute h-[28px] top-0 w-screen z-50" data-tauri-drag-region></div>

<slot />

<style lang="postcss">
	:global(body) {
		overflow: hidden;
		background-color: theme(colors.zinc.950);
		color: theme(colors.zinc.50);
		height: 100vh;
		font-family: 'Outfit';
		-webkit-user-select: none; /* Safari */
		-ms-user-select: none; /* IE 10 and IE 11 */
		user-select: none; /* Standard syntax */
	}

	:global(::-webkit-scrollbar) {
		width: 8px;
		margin-right: 5px;
	}

	:global(::-webkit-scrollbar-track) {
		background: transparent;
		margin-right: 5px;
	}

	:global(::-webkit-scrollbar-thumb) {
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 25px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background-color: rgba(255, 255, 255, 0.2);
	}

	:global(*) {
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
		-ms-overflow-style: none;
	}

	:global(*::-ms-scrollbar) {
		width: 8px;
	}

	:global(*::-ms-scrollbar-thumb) {
		background-color: rgba(255, 255, 255, 0.15);
		border-radius: 25px;
	}
</style>
