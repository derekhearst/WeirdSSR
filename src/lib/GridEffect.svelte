<script lang="ts">
	import { createGrid, type GridApi, type GridOptions } from 'ag-grid-enterprise'
	import { browser } from '$app/environment'
	import { tick } from 'svelte'

	interface Props {
		gridConfig: GridOptions
	}

	let { gridConfig }: Props = $props()

	let gridEl: HTMLDivElement | undefined = $state()
	let gridApi: GridApi | undefined = $state()
	let mounted = $state(false)

	console.log('🔵 GridEffect: Script executing')

	// Set mounted flag after hydration
	$effect(() => {
		if (browser) {
			tick().then(() => {
				mounted = true
			})
		}
	})

	// Initialize grid only after mounted
	$effect(() => {
		console.log('🟣 GridEffect: $effect running, browser:', browser, 'mounted:', mounted)
		console.log('🟣 GridEffect: gridEl exists:', !!gridEl)
		console.log('🟣 GridEffect: gridEl type:', gridEl?.constructor?.name)
		
		// Only run in browser, after mount, when gridEl is a proper HTMLDivElement
		if (browser && mounted && gridEl && gridEl instanceof HTMLDivElement && !gridApi) {
			console.log('🟢 GridEffect: Initializing AG Grid')
			try {
				gridApi = createGrid(gridEl, gridConfig)
				console.log('🟢 GridEffect: AG Grid initialized successfully')
			} catch (err) {
				console.error('❌ GridEffect: Failed to initialize AG Grid:', err)
			}
		}

		// Cleanup function
		return () => {
			if (gridApi) {
				console.log('🔴 GridEffect: Destroying AG Grid')
				gridApi.destroy()
				gridApi = undefined
			}
		}
	})
</script>

<div bind:this={gridEl} class="ag-theme-quartz" style="height: 500px; width: 100%;"></div>

