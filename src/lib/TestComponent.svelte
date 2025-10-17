<script lang="ts">
	import { onMount } from 'svelte'
	import { getLocations, getGridData } from '$lib/data.remote'
	import Grid from '$lib/Grid.svelte'
	import type { GridApi, GridOptions } from 'ag-grid-enterprise'

	console.log('🔵 Component: Script executing')

	// ❌ THIS PATTERN CAUSES HYDRATION TO FAIL IN PRODUCTION
	// Using $derived with await on a remote function breaks hydration
	const locations = $derived(await getLocations())

	console.log('🟢 Component: Locations loaded', locations.length, 'items')

	let gridApi = $state<GridApi>()

	// Create grid options with the locations data for the filter
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
					// Using locations from $derived(await ...) here
					values: locations.map(loc => loc.name)
				}
			},
			{ field: 'status', headerName: 'Status', width: 150 }
		],
		onGridReady: (params) => {
			console.log('🟢 Grid: onGridReady callback fired')
			gridApi = params.api
		}
	})

	onMount(() => {
		console.log('🟡 Component: onMount called')
		console.log('🟡 GridApi exists:', !!gridApi)
		
		// Check if Grid element is in the DOM
		const gridEl = document.querySelector('.grid-wrapper')
		console.log('🟡 Grid wrapper in DOM:', !!gridEl)
		console.log('🟡 Grid wrapper children:', gridEl?.children.length)
		console.log('🟡 Grid wrapper innerHTML length:', gridEl?.innerHTML.length)
	})
</script>

<div class="container">
	<h2>Test Component with AG Grid</h2>
	<p>If you see the grid below and "onMount called" in console, hydration succeeded.</p>
	<p>Locations for filter: {locations.length} items</p>
	<p class="debug">gridOptions exists: {!!gridOptions}</p>
	<p class="debug">gridOptions has columnDefs: {!!gridOptions?.columnDefs}</p>
	
	<div class="grid-wrapper">
		<p>Before Grid component</p>
		<Grid {gridOptions} />
		<p>After Grid component</p>
	</div>
</div>

<style>
	.container {
		padding: 2rem;
		border: 2px solid #4CAF50;
		border-radius: 8px;
		margin: 1rem 0;
	}
	
	.grid-wrapper {
		margin-top: 1rem;
		height: 400px;
		border: 2px dashed #ccc;
		padding: 1rem;
	}
	
	.debug {
		font-family: monospace;
		font-size: 0.9em;
		background: #ffe;
		padding: 0.25rem;
	}
</style>
