<script>
	import Icon from '@iconify/svelte';
	import Button from '../ui/button/button.svelte';

	async function acceptFriendRequest() {
		const body = {};

		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/friends/accept`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});

			if (!response.ok) {
				throw new Error(`error occured when accepting friend request ${response.status}`);
			}
		} catch (error) {
			console.log(error);
		}
	}

	function refuseFriendRequest() {}
</script>

<div class="flex gap-x-4 w-full bg-zinc-800 border border-zinc-700 flex-shrink-0 p-5 rounded-xl">
	<Icon icon="ph:user-plus-duotone" height={30} width={30} class="text-green-500" />
	<div class="flex flex-col gap-y-4">
		<span class="flex flex-col">
			<p class="leading-5">okzmo sent you a friend request.</p>
			<time class="text-zinc-500 leading-5">Today, 12:44pm</time>
		</span>
		<span class="flex gap-x-2">
			<Button
				on:click={acceptFriendRequest}
				class="rounded-lg text-zinc-50 bg-green-500 border-none hover:bg-green-600">Accept</Button
			>
			<Button
				on:click={refuseFriendRequest}
				class="rounded-lg text-zinc-50 bg-red-500 border-none hover:bg-red-600">Refuse</Button
			>
		</span>
	</div>
</div>
