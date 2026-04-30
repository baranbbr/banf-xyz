import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { getLatestActivity } from 'lib/strava'

const CRON_SECRET = process.env.CRON_SECRET
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'latest-run.json')

function isAuthorized(request: NextRequest): boolean {
	if (!CRON_SECRET) return false

	const authHeader = request.headers.get('authorization')
	return authHeader === `Bearer ${CRON_SECRET}`
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

		return NextResponse.json({ ok: true, run: latestRun })
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Unexpected error'
		return NextResponse.json({ ok: false, error: message }, { status: 502 })
	}
}
