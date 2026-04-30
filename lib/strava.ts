const CLIENT_ID = process.env.STRAVA_CLIENT_ID
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET
const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN

export interface RunData {
	name: string
	distance: string
	time: string
	date: string
	link: string
	pace: string
}

interface StravaActivity {
	id: number
	name: string
	distance: number
	moving_time: number
	start_date: string
}

function assertEnv(name: string, value?: string): string {
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`)
	}

	return value
}

async function getValidToken(): Promise<string> {
	const response = await fetch('https://www.strava.com/oauth/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			client_id: assertEnv('STRAVA_CLIENT_ID', CLIENT_ID),
			client_secret: assertEnv('STRAVA_CLIENT_SECRET', CLIENT_SECRET),
			refresh_token: assertEnv('STRAVA_REFRESH_TOKEN', REFRESH_TOKEN),
			grant_type: 'refresh_token',
		}),
	})

	if (!response.ok) {
		throw new Error(`Unable to refresh Strava token (${response.status})`)
	}

	const tokenData = await response.json()
	if (!tokenData?.access_token) {
		throw new Error('Strava token response did not include access_token')
	}

	return tokenData.access_token
}

function calculatePace(distanceInMeters: number, timeInSeconds: number): string {
	if (distanceInMeters === 0) return '0:00'

	const secondsPerKm = timeInSeconds / (distanceInMeters / 1000)
	const minutes = Math.floor(secondsPerKm / 60)
	const seconds = Math.floor(secondsPerKm % 60)

	return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function normalizeRun(activity: StravaActivity): RunData {
	return {
		name: activity.name,
		distance: (activity.distance / 1000).toFixed(2),
		time: new Date(activity.moving_time * 1000).toISOString().substring(11, 19),
		pace: calculatePace(activity.distance, activity.moving_time),
		date: new Date(activity.start_date).toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		}),
		link: `https://www.strava.com/activities/${activity.id}`,
	}
}

export async function getLatestActivity(): Promise<RunData> {
	const accessToken = await getValidToken()
	const response = await fetch(
		'https://www.strava.com/api/v3/athlete/activities?per_page=1',
		{
			headers: { Authorization: `Bearer ${accessToken}` },
			cache: 'no-store',
		},
	)

	if (!response.ok) {
		throw new Error(`Unable to fetch Strava activities (${response.status})`)
	}

	const activities = (await response.json()) as StravaActivity[]
	const latestRun = activities?.[0]

	if (!latestRun) {
		throw new Error('No Strava activities returned for athlete')
	}

	return normalizeRun(latestRun)
}
