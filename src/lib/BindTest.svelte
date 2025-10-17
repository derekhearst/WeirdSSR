<script lang="ts">
	import { onMount } from 'svelte'

	let divElement: HTMLDivElement | undefined = $state()
	let mounted = $state(false)

	console.log('🔵 BindTest: Script executing')

	onMount(() => {
		console.log('🟡 BindTest: onMount fired')
		console.log('🟡 BindTest: divElement exists:', !!divElement)
		console.log('🟡 BindTest: divElement type:', divElement?.constructor?.name)
		console.log('🟡 BindTest: divElement instanceof HTMLDivElement:', divElement instanceof HTMLDivElement)
		mounted = true
	})

	// Also log in $effect to compare
	$effect(() => {
		console.log('🟣 BindTest: $effect running')
		console.log('🟣 BindTest: divElement exists:', !!divElement)
		console.log('🟣 BindTest: divElement type:', divElement?.constructor?.name)
		console.log('🟣 BindTest: divElement instanceof HTMLDivElement:', divElement instanceof HTMLDivElement)
	})
</script>

<div class="bind-test">
	<h3>Bind Test Component</h3>
	<div bind:this={divElement} class="target-element">
		This is the target element that should be bound
	</div>
	<div class="status">
		<p>Mounted: {mounted ? '✅' : '❌'}</p>
		<p>Element Type: {divElement?.constructor?.name ?? 'undefined'}</p>
		<p>Is HTMLDivElement: {divElement instanceof HTMLDivElement ? '✅' : '❌'}</p>
	</div>
</div>

<style>
	.bind-test {
		border: 2px solid #10b981;
		padding: 1rem;
		border-radius: 8px;
		background: #ecfdf5;
		margin: 1rem 0;
	}

	.target-element {
		background: white;
		border: 2px dashed #10b981;
		padding: 1rem;
		margin: 1rem 0;
		border-radius: 4px;
	}

	.status {
		background: #d1fae5;
		padding: 0.5rem;
		border-radius: 4px;
		font-family: monospace;
	}

	.status p {
		margin: 0.25rem 0;
	}
</style>
