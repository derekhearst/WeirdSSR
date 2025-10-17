# SvelteKit Hydration Bug Reproduction

## Bug Description

Components using `$derived(await remoteFunction())` work correctly in development mode but fail to hydrate in production builds.

## Environment

- **Svelte**: 5.40.1
- **SvelteKit**: 2.47.0
- **Node**: 20+
- **Experimental Features**: `async: true`, `remoteFunctions: true`

## Steps to Reproduce

### 1. Install dependencies

```bash
bun install
```

### 2. Test in development mode (works ✅)

```bash
bun run dev
```

Open http://localhost:5173 and check the browser console:

- ✅ You should see: `🔵 Component: Script executing`
- ✅ You should see: `🟢 Component: Data loaded 5 items`
- ✅ You should see: `🟡 Component: onMount called`
- ✅ The component renders with a list of 5 items

### 3. Build for production

```bash
bun run build
```

### 4. Run production build (fails ❌)

```bash
bun run preview
```

Open http://localhost:4173 and check the browser console:

- ✅ You see: `🔵 Component: Script executing`
- ✅ You see: `🟢 Component: Data loaded 5 items`
- ❌ You DON'T see: `🟡 Component: onMount called`
- ❌ The component fails to hydrate
- ❌ The visual component may or may not render depending on timing

## Expected Behavior

The component should hydrate successfully in production just like it does in development, with `onMount` being called.

## Actual Behavior

In production builds:

1. Server renders the component with data successfully
2. Client receives the HTML
3. During hydration, `$derived(await getData())` is re-evaluated
4. Hydration fails, `onMount` never fires
5. Component becomes non-interactive or fails to render

## Root Cause

The issue is with using `$derived()` wrapper around `await remoteFunction()`:

```typescript
// ❌ This BREAKS hydration in production
const data = $derived(await getData())
```

The `$derived` rune makes the expression reactive, which causes it to be re-evaluated during client hydration. This interferes with the remote function's built-in serialization mechanism, causing a hydration mismatch.

## Workarounds

### Option 1: Remove $derived (for static data)

```typescript
// ✅ Works in both dev and production
const data = await getData()
```

### Option 2: Use onMount (client-side only)

```typescript
// ✅ Works in both dev and production
let data = $state([])

onMount(async () => {
	data = await getData()
})
```

## Related

- Remote Functions: https://svelte.dev/docs/kit/remote-functions
- Async SSR Discussion: https://github.com/sveltejs/svelte/discussions/16784

## Files

- `src/lib/data.remote.ts` - Simple remote function returning test data
- `src/lib/TestComponent.svelte` - Component demonstrating the bug
- `src/routes/+page.svelte` - Test page with instructions
- `svelte.config.js` - Configuration with experimental features enabled
