<script>
	import TestComponent from '$lib/TestComponent.svelte'
	import EffectComponent from '$lib/EffectComponent.svelte'
</script>

<div class="wrapper">
	<h1>Lifecycle Hook Comparison</h1>
	
	<div class="instructions">
		<h2>Testing: onMount vs $effect</h2>
		<p>
			Both components use <code>$derived(await remoteFunction())</code> but one uses 
			<code>onMount</code> and the other uses <code>$effect</code>.
		</p>
		<p>
			This test will show if the issue affects all lifecycle hooks or just <code>onMount</code>.
		</p>
		
		<h3>What to check in console:</h3>
		<ul>
			<li><strong>Dev mode:</strong> Both should work</li>
			<li><strong>Production:</strong> Check if $effect runs when onMount doesn't</li>
		</ul>
	</div>

	<h2>Component 1: Using onMount (Green border)</h2>
	<svelte:boundary>
		{#snippet pending()}
			<p>Loading onMount component...</p>
		{/snippet}
		<TestComponent />
	</svelte:boundary>

	<h2>Component 2: Using $effect (Purple border)</h2>
	<svelte:boundary>
		{#snippet pending()}
			<p>Loading $effect component...</p>
		{/snippet}
		<EffectComponent />
	</svelte:boundary>
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
</style>
