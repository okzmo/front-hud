<script lang="ts">
	import SignupForm from '$lib/components/connection/signup-form.svelte';
	import type { PageData } from './$types.js';

	export let data: PageData;
</script>

<SignupForm data={data.form} />
