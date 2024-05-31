<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';

	export let avatar: string;
	export let banner: string;
	export let display_name: string;
	export let username: string;
	export let about_me: string;
	export let side: 'top' | 'left' | 'bottom' | 'right' | undefined = 'right';
</script>

<Popover.Content
	{side}
	class="w-[22rem] h-[15rem] p-0 bg-transparent border-none shadow-none"
	sideOffset={10}
	align="start"
>
	<img
		class="w-full max-w-none h-full absolute left-0 top-0 object-cover rounded-2xl blur-xl transform-gpu"
		src={banner}
		alt=""
	/>
	<div class="rounded-2xl flex relative px-5 py-4 h-full">
		<img
			class="w-full h-full absolute left-0 top-0 object-cover rounded-[1.1rem]"
			src={banner}
			alt=""
		/>
		<div class="flex flex-col justify-end gap-y-2 z-[2]">
			<span class="flex gap-x-3">
				<img class="w-14 h-14 object-cover rounded-2xl" src={avatar} alt="" />
				<span class="flex flex-col justify-end mb-2">
					<p class="text-sm leading-3">{display_name}</p>
					<p class="text-sm leading-5 text-zinc-400">{username}</p>
				</span>
			</span>
			<p class="text-sm leading-[1.10rem]">{about_me}</p>
		</div>
		<div class="w-full absolute h-full progressive-blur rounded-2xl"></div>
	</div>
</Popover.Content>

<style lang="postcss">
	.progressive-blur {
		backdrop-filter: blur(40px);
		-webkit-backdrop-filter: blur(40px);
		inset: 0;

		mask-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 75%, rgb(0, 0, 0));
		-webkit-mask-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 75%, rgb(0, 0, 0));
	}
</style>
