<script lang="ts">
	import SigninForm from '$lib/components/connection/signin-form.svelte';
	import type { PageData } from './$types.js';

	export let data: PageData;
</script>

<SigninForm data={data.form} />
