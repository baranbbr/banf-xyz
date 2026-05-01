import { NextRequest, NextResponse } from 'next/server'

/**
 * Validates `Authorization: Bearer <CRON_SECRET>` for cron and privileged API routes.
 * Returns `null` when authorized; otherwise a JSON `NextResponse` (401 or 500).
 */
export function assertCronBearer(request: NextRequest): NextResponse | null {
	const CRON_SECRET = process.env.CRON_SECRET

	if (!CRON_SECRET) {
		return NextResponse.json(
			{ ok: false, error: 'Missing CRON_SECRET environment variable' },
			{ status: 500 },
		)
	}

	const authHeader = request.headers.get('authorization')
	if (authHeader !== `Bearer ${CRON_SECRET}`) {
		return NextResponse.json(
			{ ok: false, error: 'Unauthorized' },
			{ status: 401 },
		)
	}

	return null
}
