import { ImageResponse } from 'next/og'

export function GET(request: Request) {
	let url = new URL(request.url)
	let title = url.searchParams.get('title') || 'banf.xyz'

	return new ImageResponse(
		<div tw='flex relative w-full h-full items-center justify-center bg-[#242424]'>
			<div tw='flex flex-col w-full py-12 px-4 items-center justify-center p-8'>
				<h2 tw='flex flex-col text-4xl font-bold tracking-tight text-white text-left'>
					{title}
				</h2>
				<p tw='text-lg text-neutral-400'>
					Thoughts, projects, interests and more from @banf.
				</p>
			</div>
			<div tw='absolute bottom-8 right-8 text-xl text-neutral-500'>
				x.com/banf
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
		},
	)
}
