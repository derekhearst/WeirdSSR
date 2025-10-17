<script lang="ts">
	import TestComponent from '$lib/TestComponent.svelte'
	import EffectComponent from '$lib/EffectComponent.svelte'
	import BindTest from '$lib/BindTest.svelte'
	import { getLocations, getGridData } from '$lib/data.remote'
	import GridEffect from '$lib/GridEffect.svelte'
	import type { ColDef } from 'ag-grid-enterprise'

	const locations = $derived(await getLocations())
	const data = $derived(await getGridData())

	console.log('🔵 ComparePage: Script executing')
	console.log('🟢 ComparePage: Locations loaded', locations?.length ?? 0, 'items')
	console.log('🟢 ComparePage: Data loaded', data?.length ?? 0, 'rows')

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
	<h1>Lifecycle Hook Comparison</h1>
	
	<div class="instructions">
		<h2>Testing: Child component hydration with parent using `$derived(await...)`</h2>
		<p>
			This parent component uses <code>$derived(await remoteFunction())</code>.
		</p>
		<p>
			<strong>Test 0:</strong> Simple <code>bind:this</code> test - No external libraries<br>
			<strong>Test 1 & 2:</strong> Child components that just log lifecycle hooks<br>
			<strong>Test 3:</strong> AG Grid using <code>$effect</code> instead of <code>onMount</code>
		</p>
		
		<h3>What to check in console:</h3>
		<ul>
			<li><strong>Dev mode:</strong> All should work</li>
			<li><strong>Production:</strong> 
				<ul>
					<li>❌ Child onMount won't fire</li>
					<li>❌ Child bind:this binds to Text/Comment nodes</li>
					<li>✅ Child $effect WILL fire</li>
					<li>❌ AG Grid with $effect still can't initialize (no real DOM element)</li>
				</ul>
			</li>
		</ul>
	</div>

	<h2>Test 0: Simple bind:this Test (No AG Grid)</h2>
	<svelte:boundary>
		{#snippet pending()}
			<p>Loading bind test...</p>
		{/snippet}
		<BindTest />
	</svelte:boundary>

	<h2>Test 1: Using onMount (Green border)</h2>
	<svelte:boundary>
		{#snippet pending()}
			<p>Loading onMount component...</p>
		{/snippet}
		<TestComponent />
	</svelte:boundary>

	<h2>Test 2: Using $effect (Purple border)</h2>
	<svelte:boundary>
		{#snippet pending()}
			<p>Loading $effect component...</p>
		{/snippet}
		<EffectComponent />
	</svelte:boundary>

	<h2>Test 3: AG Grid with $effect (Blue border - THE WORKAROUND)</h2>
	<div class="grid-test">
		<svelte:boundary>
			{#snippet pending()}
				<p>Loading AG Grid with $effect...</p>
			{/snippet}
			<GridEffect {gridConfig} />
		</svelte:boundary>
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
	
	h2 {
		margin-top: 2rem;
	}

	.grid-test {
		border: 3px solid #3b82f6;
		padding: 1rem;
		border-radius: 8px;
		background: #eff6ff;
	}
</style>
