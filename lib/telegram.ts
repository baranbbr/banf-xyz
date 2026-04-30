const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

interface TelegramResponse {
	ok: boolean
	description?: string
}

export interface TelegramSendResult {
	ok: boolean
	error?: string
}

function getTelegramConfig(): { token: string; chatId: string } {
	if (!TELEGRAM_BOT_TOKEN) {
		throw new Error(
			'Missing required environment variable: TELEGRAM_BOT_TOKEN',
		)
	}

	if (!TELEGRAM_CHAT_ID) {
		throw new Error(
			'Missing required environment variable: TELEGRAM_CHAT_ID',
		)
	}

	return { token: TELEGRAM_BOT_TOKEN, chatId: TELEGRAM_CHAT_ID }
}

export async function sendTelegramMessage(
	text: string,
): Promise<TelegramSendResult> {
	try {
		const { token, chatId } = getTelegramConfig()
		const response = await fetch(
			`https://api.telegram.org/bot${token}/sendMessage`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					chat_id: chatId,
					text,
					parse_mode: 'Markdown',
				}),
			},
		)

		if (!response.ok) {
			return {
				ok: false,
				error: `Telegram API request failed (${response.status})`,
			}
		}

		const payload = (await response.json()) as TelegramResponse
		if (!payload.ok) {
			return {
				ok: false,
				error: payload.description ?? 'Telegram API returned ok=false',
			}
		}

		return { ok: true }
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : 'Unexpected error',
		}
	}
}
