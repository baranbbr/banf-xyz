import { BlogPosts } from 'app/components/posts'
import Experience from './components/experience'
import { RunCard } from './components/run-card'
import { getLatestActivity } from './about/routes'
import { getCachedRunFromBlob } from 'lib/strava-blob'

export default async function Page() {
	const run =
		(await getCachedRunFromBlob()) ?? (await getLatestActivity())
	return (
		<section>
			<h1 className='mb-8 text-2xl font-semibold tracking-tighter'>
				banf.xyz
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
