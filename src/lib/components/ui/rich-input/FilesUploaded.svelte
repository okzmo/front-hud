<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	export let file: File;

	const dispatch = createEventDispatcher();

	function deleteFile() {
		dispatch('delete', file);
	}

	function getFileIcon(type: string) {
		// Add more file type icons as needed
		const icons = {
			image: '🖼️',
			video: '🎥',
			text: '📄',
			default: '📁'
		};

		const fileType = type.split('/')[0];
		return icons[fileType] || icons.default;
	}
</script>

<div class="flex items-center relative">
	{#if file.type.startsWith('image/')}
		<img
			src={URL.createObjectURL(file)}
			alt={file.name}
			class="w-[3.125rem] h-[3.125rem] object-cover rounded-lg"
		/>
	{:else}
		<div
			class="w-[3.125rem] h-[3.125rem] object-cover rounded-lg flex justify-center items-center bg-zinc-500"
		>
			{getFileIcon(file.type)}
		</div>
	{/if}
	<button
		on:click={deleteFile}
		class="absolute h-4 w-4 p-[0.15rem] rounded-full -top-1 -right-1 flex justify-center items-center bg-red-500 border-white/0 border hover:border-white/100 transition-colors duration-75"
	>
		<Icon icon="radix-icons:cross-2" />
	</button>
</div>
