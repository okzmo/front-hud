<script lang="ts">
	import { browser } from '$app/environment';
	import Icon from '@iconify/svelte';

	export let usersTyping: any[];
</script>

{#if browser}
	<div class="flex gap-x-2 items-end mt-6">
		<div
			class="flex-shrink-0 h-10 w-10 rounded-xl overflow-hidden bg-zinc-850 flex justify-center items-center"
		>
			{usersTyping.length}
		</div>
		<div class="flex flex-col w-fit">
			<div
				class="bg-zinc-850 rounded-xl rounded-bl-sm px-3 py-1 mt-1 w-fit text-sm [&>p]:break-all flex flex-col gap-y-1 max-w-[45rem]"
			>
				<span class="[&>p>a]:text-blue-400 [&>p>a:hover]:underline break-all [&>p>span]:first:ml-0">
					<Icon icon="eos-icons:three-dots-loading" height={35} width={45} class="text-zinc-600" />
				</span>
			</div>
		</div>
	</div>
{/if}
