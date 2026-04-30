import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { getLatestActivity } from 'lib/strava'
import { sendTelegramMessage } from 'lib/telegram'

const CRON_SECRET = process.env.CRON_SECRET
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'latest-run.json')

function isAuthorized(request: NextRequest): boolean {
	if (!CRON_SECRET) return false

	const authHeader = request.headers.get('authorization')
	return authHeader === `Bearer ${CRON_SECRET}`
}

function getTimestamp(): string {
	return new Date().toISOString()
}

export async function GET(request: NextRequest) {
	if (!CRON_SECRET) {
		return NextResponse.json(
			{ ok: false, error: 'Missing CRON_SECRET environment variable' },
			{ status: 500 },
		)
	}

	if (!isAuthorized(request)) {
		return NextResponse.json(
			{ ok: false, error: 'Unauthorized' },
			{ status: 401 },
		)
	}

	try {
		const latestRun = await getLatestActivity()
		await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true })
		await fs.writeFile(
			OUTPUT_FILE,
			`${JSON.stringify(latestRun, null, 2)}\n`,
			'utf-8',
		)

		const successMessage = [
			'*Strava refresh: SUCCESS*',
			`Activity: ${latestRun.name}`,
			`Distance: ${latestRun.distance} km | Pace: ${latestRun.pace}`,
			`Time: ${getTimestamp()}`,
		].join('\n')

		const telegramResult = await sendTelegramMessage(successMessage)
		if (!telegramResult.ok) {
			console.error('Telegram success notification failed:', telegramResult.error)
		}

		return NextResponse.json({
			ok: true,
			run: latestRun,
			telegramNotificationSent: telegramResult.ok,
		})
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Unexpected error'

		const failureMessage = [
			'*Strava refresh: FAILURE*',
			`Error: ${message}`,
			`Time: ${getTimestamp()}`,
		].join('\n')
		const telegramResult = await sendTelegramMessage(failureMessage)
		if (!telegramResult.ok) {
			console.error('Telegram failure notification failed:', telegramResult.error)
		}

		return NextResponse.json({ ok: false, error: message }, { status: 502 })
	}
}
