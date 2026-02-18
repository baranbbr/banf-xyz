export default function About() {
	const experience = [
		{
			title: 'Software Engineer II',
			company: 'PlayStation',
			startDate: 'September 2025',
			endDate: 'Present',
			description:
				'Using TypeScript, React, Node.js, Java and AWS to allow partners and developers to have the best experience while developing their products.',
		},
		{
			title: 'Software Engineer',
			company: 'Sky TV',
			startDate: 'August 2022',
			endDate: 'September 2025',
			description:
				'Using C#, .NET Core, Jenkins and Kubernetes to process the metadata for all past, present and future content that flows through Sky.',
		},
	]
	return (
		<section>
			<h1 className='font-semibold text-2xl mb-8 tracking-tighter'>
				Experience
			</h1>
			<div>
				{experience.map((experience) => (
					<div key={experience.title}>
						<h3 className='font-semibold mb-4'>
							{experience.title} at {experience.company} (
							{experience.startDate} - {experience.endDate})
						</h3>
						<p className='text-neutral-600 dark:text-neutral-300 mb-8'>
							{experience.description}
						</p>
					</div>
				))}
			</div>
		</section>
	)
}
