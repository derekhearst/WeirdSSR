<script>
	import TestComponent from '$lib/TestComponent.svelte'
</script>

<div class="wrapper">
	<h1>SvelteKit Hydration Bug Reproduction</h1>
	
	<div class="instructions">
		<h2>Bug Description</h2>
		<p>
			AG Grid component with <code>$derived(await remoteFunction())</code> for filter values 
			works in dev mode but fails to hydrate in production builds.
		</p>
		
		<h3>The Problematic Pattern:</h3>
		<pre><code>// ❌ Breaks hydration in production
const locations = $derived(await getLocations())

const gridOptions = $derived&lt;GridOptions&gt;(&#123;
  columnDefs: [&#123;
    field: 'location',
    filterParams: &#123;
      values: locations.map(loc => loc.name) // Using async data
    &#125;
  &#125;]
&#125;)</code></pre>
		
		<h3>Expected behavior:</h3>
		<ul>
			<li>Server renders component with grid and data</li>
			<li>Client hydrates successfully</li>
			<li>Grid initializes: "📊 Grid: Initializing AG Grid..."</li>
			<li><code>onGridReady</code> callback fires</li>
			<li><code>onMount</code> callback fires</li>
			<li>Grid is interactive</li>
		</ul>
		
		<h3>Actual behavior in production:</h3>
		<ul>
			<li>✅ Server renders with data</li>
			<li>✅ Console shows: "🔵 Component: Script executing"</li>
			<li>✅ Console shows: "🟢 Component: Locations loaded 5 items"</li>
			<li>✅ Console shows: "🟡 Component: onMount called"</li>
			<li>❌ **Child Grid component never mounts**</li>
			<li>❌ Grid never initializes (no "📊 Grid: Initializing" message)</li>
			<li>❌ Grid never visible on page</li>
		</ul>
	</div>

	<svelte:boundary>
		{#snippet pending()}
			<p>Loading component...</p>
		{/snippet}
		<TestComponent />
	</svelte:boundary>
</div>

<style>
	.wrapper {
		max-width: 800px;
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
</style>
