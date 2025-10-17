<script lang="ts">
	import { getLocations } from '$lib/data.remote'
	import BindTest from '$lib/BindTest.svelte'

	const locations = $derived(await getLocations())

	console.log('🔵 Page: Script executing')
	console.log('🟢 Page: Locations loaded', locations?.length ?? 0, 'items')
</script>

<div class="wrapper">
	<h1>Child Component DOM Creation Bug</h1>
	
	<div class="instructions">
		<h2>The Bug</h2>
		<p>
			When a parent uses <code>$derived(await remoteFunction())</code>, 
			child components fail to create DOM elements on reload/navigation.
		</p>
		
		<h3>⚠️ How to reproduce:</h3>
		<ol>
			<li><strong>First load:</strong> Works perfectly ✅</li>
			<li><strong>Press F5 to reload:</strong> Component crashes ❌</li>
		</ol>
		
		<h3>What happens:</h3>
		<ul>
			<li>Child element slot remains a Comment node</li>
			<li><code>bind:this</code> binds to Comment instead of HTMLDivElement</li>
			<li><code>onMount</code> never fires</li>
			<li>DOMException: Cannot add children to a Comment</li>
		</ul>

		<h3>Check console below for logs</h3>
	</div>

	<svelte:boundary>
		{#snippet pending()}
			<p>Loading...</p>
		{/snippet}

		<BindTest />
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

	.workarounds {
		background: #ecfdf5;
		border: 2px solid #10b981;
		padding: 1rem;
		border-radius: 8px;
		margin-top: 2rem;
	}

	.workarounds h3 {
		margin-top: 0;
		color: #065f46;
	}

	.workarounds p {
		margin: 0.5rem 0;
	}
	
	code {
		background: #e0e0e0;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: 'Courier New', monospace;
	}

	.workarounds code {
		background: #d1fae5;
	}
	
	ul, ol {
		margin: 0.5rem 0;
	}
	
	li {
		margin: 0.25rem 0;
	}
</style>
