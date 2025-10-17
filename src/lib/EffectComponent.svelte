<script lang="ts">
	import { getLocations, getGridData } from '$lib/data.remote'
	import Grid from '$lib/Grid.svelte'
	import type { GridApi, GridOptions } from 'ag-grid-enterprise'

	console.log('🔵 EffectComponent: Script executing')

	// Using the same problematic pattern
	const locations = $derived(await getLocations())

	console.log('🟢 EffectComponent: Locations loaded', locations.length, 'items')

	let gridApi = $state<GridApi>()
	let effectRan = $state(false)
	let gridInDom = $state(false)

	// Create grid options
	const gridOptions = $derived<GridOptions>({
		rowModelType: 'clientSide',
		pagination: true,
		paginationPageSize: 10,
		rowData: await getGridData(),
		columnDefs: [
			{ field: 'id', headerName: 'ID', width: 100 },
			{ field: 'name', headerName: 'Name', width: 200 },
			{
				field: 'location',
				headerName: 'Location',
				width: 200,
				filter: 'agSetColumnFilter',
				filterParams: {
					values: locations.map(loc => loc.name)
				}
			},
			{ field: 'status', headerName: 'Status', width: 150 }
		],
		onGridReady: (params) => {
			console.log('🟢 Grid: onGridReady callback fired (via effect test)')
			gridApi = params.api
		}
	})

	// Using $effect instead of onMount
	$effect(() => {
		console.log('🟣 EffectComponent: $effect running')
		effectRan = true
		
		const gridEl = document.querySelector('.effect-grid-wrapper')
		gridInDom = !!gridEl
		console.log('🟣 Grid wrapper in DOM:', gridInDom)
		console.log('🟣 Grid wrapper children:', gridEl?.children.length)
		console.log('🟣 GridApi exists:', !!gridApi)
	})
</script>

<div class="container">
	<h2>Test Component with $effect (instead of onMount)</h2>
	<p>Testing if $effect behaves differently than onMount with $derived(await ...)</p>
	<p>Locations for filter: {locations.length} items</p>
	<p class="debug">$effect ran: {effectRan}</p>
	<p class="debug">Grid in DOM: {gridInDom}</p>
	<p class="debug">gridOptions exists: {!!gridOptions}</p>
	
	<div class="effect-grid-wrapper">
		<p>Before Grid component</p>
		<Grid {gridOptions} />
		<p>After Grid component</p>
	</div>
</div>

<style>
	.container {
		padding: 2rem;
		border: 2px solid #9C27B0;
		border-radius: 8px;
		margin: 1rem 0;
	}
	
	.effect-grid-wrapper {
		margin-top: 1rem;
		height: 400px;
		border: 2px dashed #9C27B0;
		padding: 1rem;
	}
	
	.debug {
		font-family: monospace;
		font-size: 0.9em;
		background: #f3e5f5;
		padding: 0.25rem;
	}
</style>
