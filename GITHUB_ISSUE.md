# GitHub Issue Template - Filled Out

## Title

Child component `onMount` never fires when parent uses `$derived(await remoteFunction())` in production builds

## Description

When a parent component uses `$derived(await remoteFunction())`, **child component `onMount` lifecycle hooks never fire in production builds**, while all other lifecycle hooks work normally.

### The Issue

When using the pattern `const data = $derived(await remoteFunction())` in a parent component:

- ✅ Parent component renders successfully
- ✅ Parent `onMount` fires
- ✅ Parent `$effect` fires
- ✅ Child components are in the DOM
- ❌ **Child component `onMount` hooks never fire**
- ✅ Child component `$effect` DOES fire (if used)

This is **very specific**: Only child `onMount` is affected. Parent lifecycle hooks and child `$effect` work fine.

**This is NOT a hydration mismatch** - the DOM is correct, and most lifecycle hooks work.

### Minimal Reproduction

Repository: This project (WeirdSSR)

### Steps to Reproduce

1. `bun install`
2. `bun run dev` - Works correctly ✅
3. `bun run build && bun run preview` - Fails to hydrate ❌

### Expected Behavior

- Component renders on server with data
- Client hydrates successfully
- `onMount` fires
- AG Grid initializes

### Actual Behavior (Production)

- ✅ Component renders on server with data
- ✅ Console: "🔵 Component: Script executing"
- ✅ Console: "🟢 Component: Locations loaded 5 items"
- ✅ Console: "🟡 Component: onMount called"
- ✅ Console: "🟡 GridApi exists: false"
- ❌ **AG Grid's `onMount` never fires** - No "📊 Grid: Initializing" message
- ❌ **Child component (Grid) fails to mount**
- ❌ Grid never becomes visible

### Console Logs in Development (Works)

```
🔵 Component: Script executing
🟢 Component: Locations loaded 5 items
🟡 Component: onMount called
🟡 GridApi exists: false
📊 Grid: Initializing AG Grid...
✅ Grid: Initialized with server-side data source
🟢 Grid: onGridReady callback fired
```

### Console Logs in Production (Fails)

```
🔵 Component: Script executing
🟢 Component: Locations loaded 5 items
🟡 Component: onMount called                    ✅ Parent onMount works
🟡 Grid wrapper in DOM: true                    ✅ Child in DOM
🟡 Grid wrapper children: 3
� EffectComponent: $effect running             ✅ Parent $effect works
🟣 Grid wrapper in DOM: true                    ✅ Child visible to $effect
🟣 Grid wrapper children: 3
[Grid IS in the DOM, parent lifecycle works, but child onMount never fires]
```

**Critical Discovery**: 
- ✅ Parent `onMount` works
- ✅ Parent `$effect` works (runs twice!)
- ✅ Child components are in DOM
- ❌ **Only child `onMount` is broken**

If child uses `$effect` instead of `onMount`, it would work. But libraries like AG Grid require `onMount`.

### Root Cause

The `$derived` rune with `await` in the parent component appears to prevent child component lifecycle hooks from executing in production builds. The components render correctly in the DOM, but their `onMount` callbacks never fire.

This suggests the issue is with **lifecycle management** rather than hydration mismatch.

### Workaround 1: Remove $derived

```typescript
// ✅ Works in production
const locations = await getLocations()
```

### Workaround 2: Use onMount

```typescript
// ✅ Works in production
let locations = $state([])

onMount(async () => {
	locations = await getLocations()
})
```

### System Info

```
Output of: bunx envinfo --system --binaries --browsers --npmPackages "{svelte,@sveltejs/*,vite}"

System:
  OS: Windows 11
  CPU: (12) x64
  Memory: 32 GB

Binaries:
  Node: 20.x.x
  Bun: 1.2.22

npmPackages:
  @sveltejs/adapter-node: 5.4.0
  @sveltejs/kit: 2.47.0
  @sveltejs/vite-plugin-svelte: 6.2.1
  svelte: 5.40.1
  vite: 7.1.10
```

### Severity

**Annoying** - It has a workaround but the current pattern is intuitive and should work

### Related

- Remote Functions Docs: https://svelte.dev/docs/kit/remote-functions
- Async SSR Discussion: https://github.com/sveltejs/svelte/discussions/16784

### Additional Context

This issue particularly affects components using AG Grid or similar libraries that need to initialize in `onMount`. The pattern `$derived(await remoteFunction())` seems like the natural way to handle async data with Svelte 5 runes, but it breaks hydration in production.
