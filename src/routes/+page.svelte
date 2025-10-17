<script>
</script>

<div class="wrapper">
	<h1>SvelteKit Child Component Hydration Bug</h1>
	
	<div class="instructions">
		<h2>Bug Description</h2>
		<p>
			When a parent component uses <code>$derived(await remoteFunction())</code>, 
			child components fail to properly hydrate in production builds:
		</p>
		<ul>
			<li>❌ Child component <code>onMount</code> never fires</li>
			<li>❌ Child component <code>bind:this</code> binds to Text/Comment nodes instead of actual DOM elements</li>
			<li>✅ Parent lifecycle hooks work normally</li>
			<li>✅ Child <code>$effect</code> runs (but can't access real DOM elements)</li>
		</ul>
		
		<h3>The Problematic Pattern:</h3>
		<pre><code>// Parent component
const data = $derived(await remoteFunction())

// Child component uses:
let element: HTMLDivElement
onMount(() => &#123;
  // ❌ Never fires in production
  initializeLibrary(element) // ❌ element is Text node, not HTMLDivElement
&#125;)</code></pre>
		
		<h2>Test Suite</h2>
		<p>
			Navigate through these tests to see each aspect of the bug. 
			Check your browser console for detailed logs.
		</p>
		<p>
			<strong>Important:</strong> Run <code>bun run build && bun run preview</code> to see the bug. 
			It works fine in <code>bun run dev</code>.
		</p>
	</div>

	<div class="test-links">
		<a href="/test-bind" class="test-card">
			<h3>Test 0: bind:this Test</h3>
			<p>Simple test showing <code>bind:this</code> binds to Text nodes instead of HTMLDivElement</p>
			<span class="severity">🔴 Core Issue</span>
		</a>

		<a href="/test-onmount" class="test-card">
			<h3>Test 1: onMount Test</h3>
			<p>Shows child component <code>onMount</code> never fires with AG Grid</p>
			<span class="severity">🔴 Breaks Libraries</span>
		</a>

		<a href="/test-effect" class="test-card">
			<h3>Test 2: $effect Test</h3>
			<p>Child <code>$effect</code> runs but still can't access real DOM elements</p>
			<span class="severity">🟡 Partial Workaround</span>
		</a>

		<a href="/test-grid-effect" class="test-card">
			<h3>Test 3: Grid with $effect</h3>
			<p>AG Grid using <code>$effect</code> still fails due to <code>bind:this</code> issue</p>
			<span class="severity">🔴 Workaround Fails</span>
		</a>
	</div>

	<div class="workarounds">
		<h2>Working Workarounds</h2>
		<div class="workaround-card">
			<h3>Workaround 1: Remove $derived</h3>
			<pre><code>// ✅ Works in production
const locations = await getLocations()</code></pre>
		</div>

		<div class="workaround-card">
			<h3>Workaround 2: Use onMount</h3>
			<pre><code>// ✅ Works in production
let locations = $state([])

onMount(async () => &#123;
  locations = await getLocations()
&#125;)</code></pre>
		</div>
	</div>
</div>

<style>
	.wrapper {
		max-width: 900px;
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

	pre {
		background: #1e293b;
		color: #e2e8f0;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
	}

	pre code {
		background: transparent;
		color: inherit;
	}
	
	ul {
		margin: 0.5rem 0;
	}
	
	li {
		margin: 0.25rem 0;
	}

	.test-links {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
		margin: 2rem 0;
	}

	.test-card {
		display: block;
		padding: 1.5rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
	}

	.test-card:hover {
		border-color: #2563eb;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.test-card h3 {
		margin: 0 0 0.5rem 0;
		color: #1e293b;
	}

	.test-card p {
		margin: 0 0 1rem 0;
		color: #64748b;
		font-size: 0.9rem;
	}

	.severity {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.8rem;
		font-weight: 600;
		background: #fee2e2;
		color: #991b1b;
	}

	.workarounds {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 2px solid #e0e0e0;
	}

	.workaround-card {
		background: #ecfdf5;
		border: 2px solid #10b981;
		padding: 1rem;
		border-radius: 8px;
		margin: 1rem 0;
	}

	.workaround-card h3 {
		margin: 0 0 0.5rem 0;
		color: #065f46;
	}
</style>
