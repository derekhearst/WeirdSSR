<script lang="ts">
	import { onMount } from 'svelte'
	import {
		AllEnterpriseModule,
		createGrid,
		ModuleRegistry,
		themeQuartz,
		type GridApi,
		type GridOptions,
	} from 'ag-grid-enterprise'

	type Props = {
		gridEl?: HTMLDivElement
		gridOptions: GridOptions
		class?: string
	}
	let { gridEl = $bindable(), gridOptions, class: gridClass = 'grow' }: Props = $props()

	let gridApi: GridApi | undefined

	onMount(() => {
		if (gridEl) {
			console.log('📊 Grid: Initializing AG Grid...')
			ModuleRegistry.registerModules([AllEnterpriseModule])

			const gridConfig = {
				...gridOptions,
				theme: themeQuartz,
			}

			gridApi = createGrid(gridEl, gridConfig)
			console.log('✅ Grid: Initialized with server-side data source')
		}

		return () => {
			if (gridApi) {
				console.log('🧹 Grid: Cleaning up and destroying grid instance')
				gridApi.destroy()
				gridApi = undefined
			}
		}
	})
</script>

<div bind:this={gridEl} class={gridClass}></div>

<style>
	div {
		height: 400px;
		width: 100%;
	}
</style>
