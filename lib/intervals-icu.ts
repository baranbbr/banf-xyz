const API_KEY = process.env.INTERVALS_ICU_API_KEY
const ATHLETE_ID = process.env.INTERVALS_ICU_ATHLETE_ID ?? 'i691810'
const OLDEST_DATE = process.env.INTERVALS_ICU_OLDEST_DATE ?? '2020-01-01'

export interface RunData {
	name: string
	distance: string
	time: string
	date: string
	link: string
	pace: string
}

interface IntervalsIcuActivity {
	id: string
	name?: string
	type?: string
	distance?: number
	moving_time?: number
	start_date?: string
	start_date_local?: string
}

function assertEnv(name: string, value?: string): string {
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`)
	}

	return value
}

function getAuthHeader(): string {
	return `Basic ${Buffer.from(
		`API_KEY:${assertEnv('INTERVALS_ICU_API_KEY', API_KEY)}`,
	).toString('base64')}`
}

function calculatePace(distanceInMeters = 0, timeInSeconds = 0): string {
	if (distanceInMeters === 0 || timeInSeconds === 0) return '0:00'

	const secondsPerKm = timeInSeconds / (distanceInMeters / 1000)
	const minutes = Math.floor(secondsPerKm / 60)
	const seconds = Math.floor(secondsPerKm % 60)

	return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function formatDuration(timeInSeconds = 0): string {
	return new Date(timeInSeconds * 1000).toISOString().substring(11, 19)
}

function normalizeActivity(activity: IntervalsIcuActivity): RunData {
	const startedAt = activity.start_date_local ?? activity.start_date

	if (!startedAt) {
		throw new Error('Intervals.icu activity did not include a start date')
	}

	return {
		name: activity.name ?? activity.type ?? 'Activity',
		distance: ((activity.distance ?? 0) / 1000).toFixed(2),
		time: formatDuration(activity.moving_time),
		pace: calculatePace(activity.distance, activity.moving_time),
		date: new Date(startedAt).toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		}),
		link: `https://intervals.icu/activities/${activity.id}`,
	}
}

export async function getLatestActivity(): Promise<RunData> {
	const params = new URLSearchParams({
		oldest: OLDEST_DATE,
		limit: '1',
		fields: [
			'id',
			'name',
			'type',
			'distance',
			'moving_time',
			'start_date',
			'start_date_local',
		].join(','),
	})

	const response = await fetch(
		`https://intervals.icu/api/v1/athlete/${ATHLETE_ID}/activities?${params}`,
		{
			headers: { Authorization: getAuthHeader() },
			cache: 'no-store',
		},
	)

	if (!response.ok) {
		throw new Error(`Unable to fetch Intervals.icu activities (${response.status})`)
	}

	const activities = (await response.json()) as IntervalsIcuActivity[]
	const latestActivity = activities?.[0]

	if (!latestActivity) {
		throw new Error('No Intervals.icu activities returned for athlete')
	}

	return normalizeActivity(latestActivity)
}
