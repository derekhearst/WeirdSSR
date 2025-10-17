# SvelteKit Child Component DOM Creation Bug

Minimal reproduction for a bug where child component DOM elements are never created during client-side navigation when the parent uses `$derived(await remoteFunction())`.

## The Bug

When a parent component uses `$derived(await remoteFunction())`:

- ✅ **First load**: Everything works perfectly
- ❌ **Reload/navigation**: Child component DOM never gets created
  - Child element slots remain as Comment nodes
  - `bind:this` binds to Comment instead of actual elements
  - `onMount` never fires
  - Causes `DOMException: Node.appendChild: Cannot add children to a Comment`

## How to Reproduce

```bash
bun install
bun run dev  # or: bun run build && bun run preview
```

1. Open http://localhost:5173 (or :4173 for preview)
2. **First load works ✅**
3. **Press F5 to reload** - Component crashes ❌

## Check Console

The console will show:

- First load: `divElement type: HTMLDivElement` ✅
- After reload: `DOMException: Node.appendChild: Cannot add children to a Comment` ❌

## Environment

- **Svelte**: 5.40.1
- **SvelteKit**: 2.47.0
- **Bun**: 1.2.22
- **Experimental**: `async: true`, `remoteFunctions: true`
- **Adapter**: @sveltejs/adapter-node 5.4.0

**Console on reload:**

```
🔵 BindTestPage: Script executing
🟢 BindTestPage: Locations loaded 5 items
🔵 BindTest: Script executing
Uncaught DOMException: Node.appendChild: Cannot add children to a Comment
[Component never mounts, onMount never fires]
```

## File Structure

```
src/
  lib/
    BindTest.svelte         # Simple child component with bind:this
    data.remote.ts          # Remote function using query()
  routes/
    +page.svelte            # Home page with test links
    test-bind/
      +page.svelte          # Test showing bind:this failure
    test-onmount/
      +page.svelte          # Test showing onMount not firing
```

## Expected Behavior

- First load: Component renders, bind:this works, onMount fires ✅
- Reload/Navigation: Component renders, bind:this works, onMount fires ✅

## Actual Behavior

- First load: Everything works perfectly ✅
- Reload/Navigation: Child DOM never created, bind:this → Comment, onMount never fires, crashes ❌

## Root Cause

When parent uses `$derived(await remoteFunction())`, Svelte fails to properly create child component DOM elements during client-side navigation. The child component slots remain as Comment placeholder nodes, preventing proper mounting.

## Workarounds

### Option 1: Remove $derived (recommended)

```typescript
// ✅ Works in both dev and production
const data = await getData()
```

### Option 2: Use onMount (client-side only)

```typescript
// ✅ Works but loses SSR benefits
let data = $state([])

onMount(async () => {
	data = await getData()
})
```

## Related Links

- [Remote Functions Docs](https://svelte.dev/docs/kit/remote-functions)
- [GitHub Issue](GITHUB_ISSUE.md)

## Files

- `src/lib/data.remote.ts` - Simple remote function returning test data
- `src/lib/TestComponent.svelte` - Component demonstrating the bug
- `src/routes/+page.svelte` - Test page with instructions
- `svelte.config.js` - Configuration with experimental features enabled
