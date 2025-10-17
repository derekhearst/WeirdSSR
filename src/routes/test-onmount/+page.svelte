<script lang="ts">
	import { getLocations } from '$lib/data.remote'
	import TestComponent from '$lib/TestComponent.svelte'

	const locations = $derived(await getLocations())

	console.log('🔵 OnMountTestPage: Script executing')
	console.log('🟢 OnMountTestPage: Locations loaded', locations?.length ?? 0, 'items')
</script>

<div class="wrapper">
	<h1>Test 1: Child onMount Test</h1>
	
	<div class="instructions">
		<h2>Testing: onMount lifecycle hook in child components</h2>
		<p>
			This parent component uses <code>$derived(await remoteFunction())</code>.
		</p>
		<p>
			The child component (TestComponent) uses AG Grid which requires <code>onMount</code> to initialize.
		</p>
		
		<h3>Expected Behavior:</h3>
		<ul>
			<li><strong>Dev mode:</strong> Parent onMount fires ✅, Grid onMount fires ✅, Grid initializes ✅</li>
			<li><strong>Production:</strong> Parent onMount fires ✅, Grid onMount NEVER fires ❌, Grid never initializes ❌</li>
		</ul>

		<h3>Check the console for:</h3>
		<ul>
			<li>🟡 Component: onMount called - Parent's onMount</li>
			<li>🟡 Grid wrapper in DOM: false - Grid component never mounts</li>
		</ul>
	</div>

	<svelte:boundary>
		{#snippet pending()}
			<p>Loading onMount component...</p>
		{/snippet}
		<TestComponent />
	</svelte:boundary>

	<div class="navigation">
		<a href="/test-bind">← Previous: bind:this Test</a>
		<a href="/test-effect">Next: $effect Test →</a>
	</div>
</div>

<style>
	.wrapper {
		max-width: 1200px;
		margin: 2rem auto;
		padding: 1rem;
		font-family: system-ui, -apple-system, sans-serif;
	}
	
	.instructions {
		background: #f5f5f5;
		padding: 1.5rem;
		border-radius: 8px;
		margin-bottom: 2rem;
	}
	
	code {
		background: #e0e0e0;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: 'Courier New', monospace;
	}
	
	ul {
		margin: 0.5rem 0;
	}
	
	li {
		margin: 0.25rem 0;
	}

	.navigation {
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 2px solid #e0e0e0;
		display: flex;
		justify-content: space-between;
	}

	.navigation a {
		color: #2563eb;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border: 1px solid #2563eb;
		border-radius: 4px;
	}

	.navigation a:hover {
		background: #2563eb;
		color: white;
	}
</style>
