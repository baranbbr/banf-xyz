import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/links'
import { baseUrl } from './sitemap'
import Links from './components/links'
import Licence from './components/licence'

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title: {
		default: 'Thoughts, projects, interests and more from @banf.',
		template: '%s | banf.xyz',
	},
	description: 'The thoughts, projects, interests and more from @banf.',
	openGraph: {
		title: 'Thoughts, projects, interests and more from @banf.',
		description:
			'London based Full-Stack Software Engineer trying to make things better than they were before.',
		url: baseUrl,
		siteName: 'banf.xyz',
		locale: 'en_US',
		type: 'website',
		images: [
			{
				url: '/og',
				width: 1200,
				height: 630,
			},
		],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			'index': true,
			'follow': true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html
			lang='en'
			className={cx(
				'text-black bg-white dark:text-white dark:bg-black',
				GeistSans.variable,
				GeistMono.variable,
			)}>
			<body className='antialiased max-w-xl mx-4 mt-8 lg:mx-auto'>
				<main className='flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0'>
					<Links />
					{/* <Navbar /> */}
					{children}
					<Analytics />
					<Licence />
					<SpeedInsights />
				</main>
			</body>
		</html>
	)
}
