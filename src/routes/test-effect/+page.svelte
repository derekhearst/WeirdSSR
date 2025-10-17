<script lang="ts">
	import { getLocations } from '$lib/data.remote'
	import EffectComponent from '$lib/EffectComponent.svelte'

	const locations = $derived(await getLocations())

	console.log('🔵 EffectTestPage: Script executing')
	console.log('🟢 EffectTestPage: Locations loaded', locations?.length ?? 0, 'items')
</script>

<div class="wrapper">
	<h1>Test 2: Child $effect Test</h1>
	
	<div class="instructions">
		<h2>Testing: $effect lifecycle hook in child components</h2>
		<p>
			This parent component uses <code>$derived(await remoteFunction())</code>.
		</p>
		<p>
			The child component (EffectComponent) uses <code>$effect</code> instead of <code>onMount</code>.
		</p>
		
		<h3>Expected Behavior:</h3>
		<ul>
			<li><strong>Dev mode:</strong> Parent $effect fires ✅, Child $effect fires ✅</li>
			<li><strong>Production:</strong> Parent $effect fires ✅, Child $effect fires ✅</li>
		</ul>

		<h3>Key Finding:</h3>
		<p>
			✅ Child <code>$effect</code> DOES run (unlike onMount)<br>
			❌ But <code>bind:this</code> still binds to Text/Comment nodes, so it can't access real DOM elements
		</p>

		<h3>Check the console for:</h3>
		<ul>
			<li>🟣 EffectComponent: $effect running</li>
			<li>🟣 Grid wrapper in DOM: false - Even though $effect runs, Grid component still can't mount due to bind:this issue</li>
		</ul>
	</div>

	<svelte:boundary>
		{#snippet pending()}
			<p>Loading $effect component...</p>
		{/snippet}
		<EffectComponent />
	</svelte:boundary>

	<div class="navigation">
		<a href="/test-onmount">← Previous: onMount Test</a>
		<a href="/test-grid-effect">Next: Grid with $effect Test →</a>
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
