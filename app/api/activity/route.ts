import { get } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { assertCronBearer } from 'lib/cron-secret-auth'
import { LATEST_ACTIVITY_PATHNAME } from 'lib/activity-blob'

export async function GET(request: NextRequest): Promise<NextResponse> {
	const authResponse = assertCronBearer(request)
	if (authResponse) return authResponse

	const result = await get(LATEST_ACTIVITY_PATHNAME, {
		access: 'private',
	})

	if (!result || result.statusCode !== 200 || !result.stream) {
		return NextResponse.json(
			{ error: 'Failed to get latest activity' },
			{ status: 404 },
		)
	}

	const text = await new Response(result.stream).text()
	return new NextResponse(text, {
		status: 200,
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	})
}
