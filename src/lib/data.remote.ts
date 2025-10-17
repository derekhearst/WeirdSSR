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

/**
 * Simulates fetching grid data
 */
export const getGridData = query(async () => {
	// Simulate async database call
	await new Promise((resolve) => setTimeout(resolve, 150))

	return [
		{ id: 1, name: 'John Doe', location: 'Location A', status: 'Active' },
		{ id: 2, name: 'Jane Smith', location: 'Location B', status: 'Active' },
		{ id: 3, name: 'Bob Johnson', location: 'Location A', status: 'Inactive' },
		{ id: 4, name: 'Alice Williams', location: 'Location C', status: 'Active' },
		{ id: 5, name: 'Charlie Brown', location: 'Location D', status: 'Active' },
	]
})
