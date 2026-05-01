import { get } from '@vercel/blob'
import type { RunData } from 'lib/strava'

export const STRAVA_LATEST_RUN_PATHNAME = 'strava/latest-run.json'

export async function getCachedRunFromBlob(): Promise<RunData | null> {
	try {
		const result = await get(STRAVA_LATEST_RUN_PATHNAME, {
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
