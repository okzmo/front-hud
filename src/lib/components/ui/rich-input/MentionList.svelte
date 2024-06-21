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
		class="sticky bg-zinc-850 mx-3 top-3 w-[calc(100%-1.5rem)] min-h-12 !py-1 !px-1 rounded-tr-lg rounded-tl-lg !z-[-1] after:content-normal after:absolute after:-bottom-2 after:h-2 after:w-full after:bg-zinc-850 after:left-0"
	>
		{#each props.items as item, idx}
			<button
				class="!px-2 py-1 hover:!bg-zinc-700 rounded-md w-full text-left"
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
		background-color: theme(colors.zinc.750);
	}
</style>
