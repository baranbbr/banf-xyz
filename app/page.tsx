import { BlogPosts } from 'app/components/posts'
import Experience from './components/experience'
import { RunCard } from './components/run-card'
import { getLatestActivity } from './about/routes'
import { getCachedRunFromBlob } from 'lib/activity-blob'

// Cached until `/api/cron/activity` calls `revalidatePath('/')` after a successful Blob write.
export const revalidate = false

async function getRun() {
	const cachedRun = await getCachedRunFromBlob()
	if (cachedRun) return cachedRun

	try {
		return await getLatestActivity()
	} catch (error) {
		console.error('Failed to load latest activity:', error)
		return null
	}
}

export default async function Page() {
	const run = await getRun()

	return (
		<section>
			<h1 className='mb-8 text-2xl font-semibold tracking-tighter'>
				baran.live
			</h1>
			<div className='my-8'>
				<p className='text-neutral-600 dark:text-neutral-300 mb-6'>
					I'm currently a Full-Stack Software Engineer at PlayStation.
					<br />
					In my spare time I enjoy running, hacking on projects and
					travelling.
				</p>
				<RunCard run={run} />
				<Experience />
			</div>
			<div className='my-8'>
				<BlogPosts />
			</div>
		</section>
	)
}
