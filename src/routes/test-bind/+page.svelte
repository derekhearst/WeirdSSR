<script lang="ts">
	import { getLocations } from '$lib/data.remote'
	import BindTest from '$lib/BindTest.svelte'

	const locations = $derived(await getLocations())

	console.log('🔵 BindTestPage: Script executing')
	console.log('🟢 BindTestPage: Locations loaded', locations?.length ?? 0, 'items')
</script>

<div class="wrapper">
	<h1>Test 0: Simple bind:this Test</h1>
	
	<div class="instructions">
		<h2>Testing: bind:this binding in child components</h2>
		<p>
			This parent component uses <code>$derived(await remoteFunction())</code>.
		</p>
		<p>
			The child component (BindTest) uses <code>bind:this</code> to get a reference to a div element.
		</p>
		
		<h3>⚠️ Important - How to see the bug:</h3>
		<ol>
			<li><strong>First load:</strong> Everything works perfectly ✅</li>
			<li><strong>Reload the page (F5 or Ctrl+R):</strong> Component crashes with DOMException ❌</li>
		</ol>
		<p class="warning">
			The bug occurs on <strong>page reload or navigation</strong>, not the initial load!
		</p>

		<h3>Expected Behavior:</h3>
		<ul>
			<li><strong>Dev mode:</strong> Element Type should be "HTMLDivElement" on all loads ✅</li>
			<li><strong>Actual:</strong> First load works, reload crashes ❌</li>
		</ul>

		<h3>What this proves:</h3>
		<p>
			When parent uses <code>$derived(await...)</code>, child components fail to re-render 
			on client-side navigation. DOM nodes stay as Comment placeholders, causing crashes.
		</p>
	</div>

	<svelte:boundary>
		{#snippet pending()}
			<p>Loading bind test...</p>
		{/snippet}
		<BindTest />
	</svelte:boundary>

	<div class="navigation">
		<a href="/">← Back to Home</a>
		<a href="/test-onmount">Next: onMount Test →</a>
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

	.warning {
		background: #fef2f2;
		border-left: 4px solid #ef4444;
		padding: 1rem;
		margin: 1rem 0;
		border-radius: 4px;
		font-weight: 600;
		color: #991b1b;
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
