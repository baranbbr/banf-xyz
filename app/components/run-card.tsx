import Link from 'next/link'

interface RunData {
	name: string
	distance: string // "5.21"
	time: string // "00:45:12"
	date: string // "Feb 18, 2026"
	link: string
	pace: string // "00:05:00"
}

export const RunCard = ({ run }: { run: RunData }) => {
	if (!run) return null

	return (
		<div className='block max-w-sm p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 mb-12'>
			<div className='flex items-center justify-between mb-3'>
				<span className='text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-500'>
					Latest Activity
				</span>
				<span className='text-xs text-zinc-500'>{run.date}</span>
			</div>

			<h3 className='text-lg font-bold text-zinc-900 dark:text-zinc-100'>
				{run.name}
			</h3>

			<div className='mt-4 grid grid-cols-2 gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-4'>
				<div>
					<p className='text-[10px] uppercase text-zinc-500 font-medium'>
						Distance
					</p>
					<p className='text-lg font-semibold text-zinc-800 dark:text-zinc-200'>
						{run.distance}{' '}
						<span className='text-sm font-normal text-zinc-500'>
							km
						</span>
					</p>
				</div>
				<div>
					<p className='text-[10px] uppercase text-zinc-500 font-medium'>
						Moving Time
					</p>
					<p className='text-lg font-semibold text-zinc-800 dark:text-zinc-200'>
						{run.time}
					</p>
				</div>
				<div>
					<p className='text-[10px] uppercase text-zinc-500 font-medium'>
						Pace
					</p>
					<p className='text-lg font-semibold text-zinc-800 dark:text-zinc-200'>
						{run.pace}{' '}
						<span className='text-sm font-normal text-zinc-500'>
							min/km
						</span>
					</p>
				</div>
				<div className='mt-4 flex items-center text-xs font-medium text-orange-600 dark:text-orange-400'>
					<Link
						href={run.link}
						target='_blank'
						rel='noopener noreferrer'
						className='group flex items-center'>
						View on Strava
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M9 5l7 7-7 7'
							/>
						</svg>
					</Link>
				</div>
			</div>
		</div>
	)
}
