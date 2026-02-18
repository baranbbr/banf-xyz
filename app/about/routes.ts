import fs from 'fs'
import path from 'path'

const TOKEN_PATH = path.join(process.cwd(), 'strava-token.json')

// Your environment variables
const CLIENT_ID = process.env.STRAVA_CLIENT_ID
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET
const REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN

async function getValidToken(): Promise<string> {
	let cachedToken

	// 1. Try to read the existing file
	if (fs.existsSync(TOKEN_PATH)) {
		const fileData = fs.readFileSync(TOKEN_PATH, 'utf8')
		cachedToken = JSON.parse(fileData)

		const nowInSeconds = Math.floor(Date.now() / 1000)

		// 2. Check if it's still valid (with a 5-minute safety buffer)
		if (cachedToken.expires_at > nowInSeconds + 300) {
			console.log('Using cached token.')
			return cachedToken.access_token
		}
	}

	// 3. Token is missing or expired -> Refresh it
	console.log('Token expired or missing. Refreshing from Strava...')
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

	// 4. Save the new data back to the file for next time
	// Note: Strava sometimes rotates the refresh_token, so we save the whole object
	fs.writeFileSync(TOKEN_PATH, JSON.stringify(newTokenData, null, 2))

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

	// 1. Calculate how many seconds it takes to cover 1km (1000m)
	const secondsPerKm = timeInSeconds / (distanceInMeters / 1000)

	// 2. Extract whole minutes
	const minutes = Math.floor(secondsPerKm / 60)

	// 3. Extract remaining seconds
	const seconds = Math.floor(secondsPerKm % 60)

	// 4. Pad seconds with a leading zero if needed (e.g., 4:05 instead of 4:5)
	const paddedSeconds = seconds.toString().padStart(2, '0')

	return `${minutes}:${paddedSeconds}`
}
