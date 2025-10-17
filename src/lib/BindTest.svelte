<script lang="ts">
	import { onMount } from 'svelte'

	let divElement: HTMLDivElement | undefined = $state()
	let mounted = $state(false)

	console.log('🔵 BindTest: Script executing')

	// Try to inspect DOM even if template crashes
	setTimeout(() => {
		console.log('⏱️ BindTest: setTimeout fired (after potential crash)')
		const manualQuery = document.querySelector('.target-element')
		console.log('🔍 BindTest: Manual querySelector in setTimeout:', manualQuery)
		console.log('🔍 BindTest: Manual query type:', manualQuery?.constructor?.name)
		
		const bindTestContainer = document.querySelector('.bind-test')
		console.log('🔍 BindTest: Parent container:', bindTestContainer)
		if (bindTestContainer) {
			console.log('🔍 BindTest: Parent children count:', bindTestContainer.children.length)
			console.log('🔍 BindTest: Parent childNodes:', Array.from(bindTestContainer.childNodes).map(n => `${n.constructor.name}: "${n.textContent?.trim().substring(0, 30)}"`))
		}
	}, 100)

	onMount(() => {
		console.log('🟡 BindTest: onMount fired')
		console.log('🟡 BindTest: divElement exists:', !!divElement)
		console.log('🟡 BindTest: divElement type:', divElement?.constructor?.name)
		console.log('🟡 BindTest: divElement instanceof HTMLDivElement:', divElement instanceof HTMLDivElement)
		
		// Manual DOM query
		const manualQuery = document.querySelector('.target-element')
		console.log('🔍 BindTest: Manual querySelector(".target-element"):', manualQuery)
		console.log('🔍 BindTest: Manual query type:', manualQuery?.constructor?.name)
		
		mounted = true
	})

	// Also log in $effect to compare
	$effect(() => {
		console.log('🟣 BindTest: $effect running')
		console.log('🟣 BindTest: divElement exists:', !!divElement)
		console.log('🟣 BindTest: divElement type:', divElement?.constructor?.name)
		console.log('🟣 BindTest: divElement instanceof HTMLDivElement:', divElement instanceof HTMLDivElement)
		
		// Manual DOM query in effect
		const manualQuery = document.querySelector('.target-element')
		console.log('🔍 BindTest: Manual querySelector in $effect:', manualQuery)
		console.log('🔍 BindTest: Manual query type:', manualQuery?.constructor?.name)
		
		// Inspect parent container
		const bindTestContainer = document.querySelector('.bind-test')
		console.log('🔍 BindTest: Parent container:', bindTestContainer)
		if (bindTestContainer) {
			console.log('🔍 BindTest: Parent children count:', bindTestContainer.children.length)
			console.log('🔍 BindTest: Parent childNodes:', Array.from(bindTestContainer.childNodes).map(n => `${n.constructor.name}: "${n.textContent?.trim().substring(0, 30)}"`))
		}
	})
</script>

<div class="bind-test">
	<h3>Bind Test Component - Can you see this text?</h3>
	<div class="target-element">Target element with text</div>
	<div class="status">Status div with text</div>
</div>

<style>
	.bind-test {
		border: 2px solid #10b981;
		padding: 1rem;
		border-radius: 8px;
		background: #ecfdf5;
		margin: 1rem 0;
	}

	.target-element {
		background: white;
		border: 2px dashed #10b981;
		padding: 1rem;
		margin: 1rem 0;
		border-radius: 4px;
	}

	.status {
		background: #d1fae5;
		padding: 0.5rem;
		border-radius: 4px;
		font-family: monospace;
	}
</style>
