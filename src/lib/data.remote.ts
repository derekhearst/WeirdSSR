import { query } from '$app/server'

/**
 * Simulates fetching locations/dropdown data from a database
 */
export const getLocations = query(async () => {
	// Simulate async database call
	await new Promise((resolve) => setTimeout(resolve, 100))

	return [
		{ id: 1, name: 'Location A' },
		{ id: 2, name: 'Location B' },
		{ id: 3, name: 'Location C' },
		{ id: 4, name: 'Location D' },
		{ id: 5, name: 'Location E' },
	]
})
