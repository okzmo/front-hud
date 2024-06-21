<script lang="ts">
	export let props;
	export let mentions: string[];
	let selectedIndex = 0;

	export function handleKeyDown({ event }) {
		if (event.key === 'ArrowUp') {
			handleArrowUp();
			return true;
		}

		if (event.key === 'ArrowDown') {
			handleArrowDown();
			return true;
		}

		if (event.key === 'Enter') {
			handleEnter();
			return true;
		}
	}

	function handleArrowUp() {
		selectedIndex = (selectedIndex + props.items.length - 1) % props.items.length;
	}

	function handleArrowDown() {
		selectedIndex = (selectedIndex + 1) % props.items.length;
	}

	function handleEnter() {
		selectItem(selectedIndex);
	}

	function selectItem(index) {
		const item = props.items[index];
		mentions.push(item.id);

		if (item) {
			props.command({ id: item.id, label: item.username });
		}
	}
</script>

{#if props.items.length > 0}
	<div
		class="absolute bg-zinc-850 left-3 -top-10 w-[calc(100%-1.5rem)] min-h-12 !py-1 !pb-5 !px-1 rounded-tr-lg rounded-tl-lg !z-[-1]"
	>
		{#each props.items as item, idx}
			<button
				class="!px-2 hover:!bg-zinc-700 rounded-md"
				on:click={() => selectedIndex(idx)}
				class:selected-item={idx === selectedIndex}
			>
				{item.username}
			</button>
		{/each}
	</div>
{/if}

<style lang="postcss">
	.selected-item {
		background-color: theme(colors.zinc.500);
	}
</style>
