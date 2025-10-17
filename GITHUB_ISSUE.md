# Child component DOM elements not created on page reload when parent uses `$derived(await remoteFunction())`

## Description

When a parent component uses `const data = $derived(await remoteFunction())`, child component DOM elements are **never created** during full page reload (F5) or client-side navigation:

- ✅ **Initial SSR load**: Works perfectly
- ✅ **Hot Module Reload (HMR)**: Works perfectly
- ❌ **Full page reload (F5)**: Child DOM never created
- ❌ **Client-side navigation**: Child DOM never created

The child component's script executes and `onMount` fires, but the template never renders into actual DOM elements. Element slots remain as Comment placeholder nodes, causing:

- `bind:this` to crash when trying to bind to Comment nodes
- DOM manipulation to fail with `DOMException: Node.appendChild: Cannot add children to a Comment`
- Manual `querySelector()` to return `null` for child elements

## Reproduction

**Repository:** https://github.com/derekhearst/WeirdSSR

### Steps to Reproduce:

1. Clone and install:

   ```bash
   git clone https://github.com/derekhearst/WeirdSSR
   cd WeirdSSR
   bun install
   bun run dev
   ```

2. Open http://localhost:5173
3. **First load works perfectly** ✅
4. **Press F5 to reload** → Child DOM never created ❌

### Expected Behavior

Child components should render their DOM elements on page reload, just like they do on initial SSR load and HMR.

### Actual Behavior

On full page reload:

- Child component script executes ✅
- `onMount` fires ✅
- But DOM elements are never created ❌
- `document.querySelector('.target-element')` returns `null`
- Element slots remain as Comment nodes
- Any attempt to append children crashes with `DOMException`

## Console Output

### On Full Page Reload (F5) - BROKEN:

```
🔵 Page: Script executing
🟢 Page: Locations loaded 5 items
🔵 BindTest: Script executing
🟡 BindTest: onMount fired
🔍 BindTest: Manual querySelector(".target-element"): null ❌
🔍 BindTest: Parent container: null ❌
```

### After Hot Module Reload (file save) - WORKS:

```
🔵 Page: Script executing
🟢 Page: Locations loaded 5 items
🔵 BindTest: Script executing
🟡 BindTest: onMount fired
🔍 BindTest: Manual querySelector in $effect: <div class="target-element"> ✅
🔍 BindTest: Manual query type: HTMLDivElement ✅
🔍 BindTest: Parent children count: 3 ✅
```

## Code Patterns

### Parent Component (Triggers the Bug):

```svelte
<script lang="ts">
  import { getLocations } from '$lib/data.remote'
  import BindTest from '$lib/BindTest.svelte'

  const locations = $derived(await getLocations())  // ← This triggers the bug
</script>

<BindTest />
```

### Remote Function:

```typescript
import { query } from '$app/server'

export const getLocations = query(async () => {
	return [
		{ id: 1, name: 'Location 1' },
		{ id: 2, name: 'Location 2' },
		// ...
	]
})
```

### Child Component (DOM Never Created):

```svelte
<script lang="ts">
  import { onMount } from 'svelte'

  onMount(() => {
    // This fires, but querySelector finds nothing!
    const el = document.querySelector('.target-element')
    console.log(el) // null ❌
  })
</script>

<div class="target-element">
  This text never appears on page reload
</div>
```

## Workarounds

### Option 1: Remove `$derived` wrapper

```svelte
const locations = await getLocations()  // Works ✅
```

### Option 2: Load data in `onMount`

```svelte
let locations = $state([])

onMount(async () => {
  locations = await getLocations()  // Works ✅
})
```

### Option 3: Use `+page.ts` loader

```typescript
// +page.ts
export async function load() {
	return {
		locations: await getLocations(),
	}
}
```

## Environment

```
System:
    OS: Windows 11 10.0.26200
    CPU: (16) x64 AMD Ryzen 7 7800X3D 8-Core Processor
    Memory: 8.71 GB / 31.16 GB
  Binaries:
    Node: 24.5.0
    Bun: 1.2.22
  npmPackages:
    @sveltejs/adapter-node: ^5.4.0 => 5.4.0
    @sveltejs/kit: ^2.43.2 => 2.47.0
    @sveltejs/vite-plugin-svelte: ^6.2.0 => 6.2.1
    svelte: ^5.39.5 => 5.40.1
    vite: ^7.1.7 => 7.1.10
  svelte.config.js:
    experimental.async: true
    experimental.remoteFunctions: true
```

## Impact

**Severity: Blocking**

This prevents using the `$derived(await remoteFunction())` pattern with any child components that have DOM elements, which is a recommended pattern in SvelteKit's experimental remote functions feature.

## Additional Notes

- The bug is **NOT** an SSR hydration mismatch (happens in dev mode too)
- The bug is **NOT** production-specific (happens in both dev and production)
- The bug is **specifically triggered by full page reload**, not HMR
- Manual DOM inspection proves elements literally don't exist (not just binding issue)
- `onMount` fires but has no DOM to work with
