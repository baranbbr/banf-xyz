import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { assertCronBearer } from 'lib/cron-secret-auth'
import { getLatestActivity } from 'lib/strava'
import { STRAVA_LATEST_RUN_PATHNAME } from 'lib/strava-blob'
import { sendTelegramMessage } from 'lib/telegram'

function getTimestamp(): string {
	return new Date().toISOString()
}

export async function GET(request: NextRequest): Promise<NextResponse> {
	const authResponse = assertCronBearer(request)
	if (authResponse) return authResponse

	try {
		const latestRun = await getLatestActivity()
		const blob = await put(
			STRAVA_LATEST_RUN_PATHNAME,
			JSON.stringify(latestRun, null, 2),
			{
				access: 'private',
				allowOverwrite: true,
				contentType: 'application/json; charset=utf-8',
			},
		)

		if (!blob.url) {
			throw new Error('Failed to write to blob')
		}

		const successMessage = [
			'*Strava refresh: SUCCESS*',
			`Activity: ${latestRun.name}`,
			`Distance: ${latestRun.distance} km | Pace: ${latestRun.pace}`,
			`Time: ${getTimestamp()}`,
		].join('\n')

		const telegramResult = await sendTelegramMessage(successMessage)
		if (!telegramResult.ok) {
			console.error(
				'Telegram success notification failed:',
				telegramResult.error,
			)
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
			console.error(
				'Telegram failure notification failed:',
				telegramResult.error,
			)
		}

		return NextResponse.json({ ok: false, error: message }, { status: 502 })
	}
}
