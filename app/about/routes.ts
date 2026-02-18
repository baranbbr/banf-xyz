import fs from 'fs'
import path from 'path'

// Your environment variables
const CLIENT_ID = process.env.STRAVA_CLIENT_ID
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET
const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN

async function getValidToken(): Promise<string> {
	const response = await fetch('https://www.strava.com/oauth/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET,
			refresh_token: REFRESH_TOKEN,
			grant_type: 'refresh_token',
		}),
	})

	const newTokenData = await response.json()
	return newTokenData.access_token
}

export async function getLatestActivity() {
	const accessToken = await getValidToken()

	const response = await fetch(
		'https://www.strava.com/api/v3/athlete/activities?per_page=1',
		{
			headers: { Authorization: `Bearer ${accessToken}` },
		},
	)

	const activities = await response.json()
	const run = activities[0]
	return {
		name: run.name,
		distance: (run.distance / 1000).toFixed(2), // convert from meters to km
		time: new Date(run.moving_time * 1000).toISOString().substring(11, 19),
		pace: calculatePace(run.distance, run.moving_time),
		date: new Date(run.start_date).toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		}),
		link: `https://www.strava.com/activities/${run.id}`,
	}
}

function calculatePace(
	distanceInMeters: number,
	timeInSeconds: number,
): string {
	if (distanceInMeters === 0) return '0:00'

	const secondsPerKm = timeInSeconds / (distanceInMeters / 1000)

	const minutes = Math.floor(secondsPerKm / 60)
	const seconds = Math.floor(secondsPerKm % 60)
	const paddedSeconds = seconds.toString().padStart(2, '0')

	return `${minutes}:${paddedSeconds}`
}
