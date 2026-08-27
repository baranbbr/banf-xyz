import { get } from '@vercel/blob'
import type { RunData } from 'lib/intervals-icu'

export const LATEST_ACTIVITY_PATHNAME = 'activities/latest-run.json'

export async function getCachedRunFromBlob(): Promise<RunData | null> {
	try {
		const result = await get(LATEST_ACTIVITY_PATHNAME, {
			access: 'private',
		})

		if (!result || result.statusCode !== 200 || !result.stream) {
			return null
		}

		const text = await new Response(result.stream).text()
		return JSON.parse(text) as RunData
	} catch {
		return null
	}
}
