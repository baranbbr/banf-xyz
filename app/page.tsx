import { BlogPosts } from 'app/components/posts'

export default function Page() {
	return (
		<section>
			<h1 className='mb-8 text-2xl font-semibold tracking-tighter'>
				banf.xyz
			</h1>
			<p className='mb-4'>
				{`I'm a Full-Stack Software Engineer at PlayStation in London.`}
			</p>
			<div className='my-8'>
				<BlogPosts />
			</div>
		</section>
	)
}
