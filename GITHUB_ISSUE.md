# GitHub Issue Template - Filled Out

## Title

Child component hydration broken when parent uses `$derived(await remoteFunction())` - `onMount` never fires, `bind:this` binds to wrong nodes

## Description

When a parent component uses `$derived(await remoteFunction())`, **child components fail to properly hydrate in production builds**: `onMount` never fires and `bind:this` binds to Text/Comment nodes instead of actual DOM elements.

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
2. `bun run build && bun run preview` (or even `bun run dev`)
3. Navigate to `/test-bind`
4. **First load**: Works correctly ✅
5. **Reload page or navigate away and back**: Fails ❌

**Critical Finding**: The bug occurs on **client-side navigation/reload**, not just initial SSR hydration!

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

**First Load** (Works):

```
🔵 BindTestPage: Script executing
🟢 BindTestPage: Locations loaded 5 items
� BindTest: Script executing
🟡 BindTest: onMount fired                          ✅
🟡 BindTest: divElement type: HTMLDivElement        ✅
🟣 BindTest: $effect running                        ✅
🟣 BindTest: divElement type: HTMLDivElement        ✅
```

**Reload/Navigation** (Fails):

```
🔵 BindTestPage: Script executing
� BindTestPage: Locations loaded 5 items
🔵 BindTest: Script executing
Uncaught DOMException: Node.appendChild: Cannot add children to a Comment
[onMount never fires, $effect never fires, component crashes]
```

**Critical Discovery**:

- ✅ **First page load works perfectly**
- ❌ **Reload or client-side navigation breaks everything**
- ❌ Child `onMount` never fires on reload
- ❌ Child `$effect` never fires on reload (crashes before it can run)
- ❌ **Child `bind:this` binds to Comment nodes, causing DOMException**
- ❌ **Happens in both dev AND production**

The error:

```
DOMException: Node.appendChild: Cannot add children to a Comment
```

This proves the issue is with **client-side navigation/reload when parent has async derived state**, not initial SSR hydration.

### Root Cause

When a parent component uses `$derived(await remoteFunction())`, child components fail to properly render on **client-side navigation or page reload**:

1. **First load**: Everything works perfectly
2. **Reload/Navigation**: Child components crash with `DOMException: Node.appendChild: Cannot add children to a Comment`
3. Child component DOM nodes remain as Comment placeholders instead of being replaced with actual elements
4. Any attempt to append children to these Comment nodes causes a crash

This suggests the issue is with how Svelte handles **re-rendering of async components** during client-side navigation, not initial SSR.

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
