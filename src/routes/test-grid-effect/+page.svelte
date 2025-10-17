<script lang="ts">
	import { getLocations, getGridData } from '$lib/data.remote'
	import GridEffect from '$lib/GridEffect.svelte'
	import type { ColDef } from 'ag-grid-enterprise'

	const locations = $derived(await getLocations())
	const data = $derived(await getGridData())

	console.log('🔵 GridEffectPage: Script executing')
	console.log('🟢 GridEffectPage: Locations loaded', locations?.length ?? 0, 'items')
	console.log('🟢 GridEffectPage: Data loaded', data?.length ?? 0, 'rows')

	const columnDefs: ColDef[] = [
		{ field: 'id', headerName: 'ID' },
		{ field: 'name', headerName: 'Name' },
		{ field: 'value', headerName: 'Value' }
	]

	const gridConfig = {
		columnDefs,
		rowData: data,
		defaultColDef: { flex: 1, minWidth: 100 }
	}
</script>

<div class="wrapper">
	<h1>Test 3: AG Grid with $effect (Attempted Workaround)</h1>
	
	<div class="instructions">
		<h2>Testing: AG Grid using $effect instead of onMount</h2>
		<p>
			This parent component uses <code>$derived(await remoteFunction())</code>.
		</p>
		<p>
			The child component (GridEffect) uses <code>$effect</code> with <code>browser</code> check 
			and tries to initialize AG Grid.
		</p>
		
		<h3>Expected Behavior:</h3>
		<ul>
			<li><strong>Dev mode:</strong> GridEffect $effect fires ✅, Grid initializes ✅</li>
			<li><strong>Production:</strong> GridEffect $effect fires ✅, but gridEl is Text node ❌, Grid never initializes ❌</li>
		</ul>

		<h3>Why this doesn't work:</h3>
		<p>
			Even though <code>$effect</code> runs (unlike <code>onMount</code>), 
			the <code>bind:this={gridEl}</code> is still bound to a Text/Comment node instead of 
			the actual HTMLDivElement. So AG Grid's <code>createGrid()</code> fails.
		</p>

		<h3>Check the console for:</h3>
		<ul>
			<li>🟣 GridEffect: $effect running, browser: true mounted: true</li>
			<li>🟣 GridEffect: gridEl type: Text ❌ (Should be HTMLDivElement)</li>
			<li>AG Grid initialization never happens because instanceof check fails</li>
		</ul>
	</div>

	<div class="grid-test">
		<svelte:boundary>
			{#snippet pending()}
				<p>Loading AG Grid with $effect...</p>
			{/snippet}
			<GridEffect {gridConfig} />
		</svelte:boundary>
	</div>

	<div class="navigation">
		<a href="/test-effect">← Previous: $effect Test</a>
		<a href="/">Back to Home</a>
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

	.grid-test {
		border: 3px solid #3b82f6;
		padding: 1rem;
		border-radius: 8px;
		background: #eff6ff;
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
