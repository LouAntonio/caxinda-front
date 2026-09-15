import { useMemo } from 'react';
import {
	generateSeoTitle,
	generateSeoDescription,
	generateSeoUrl,
	generateSeoImage,
	generateJsonLd,
} from '../../lib/seo';

interface HeadProps {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
	type?:
		'website' | 'product' | 'local-business' | 'organization' | 'article';
	price?: number;
	currency?: 'AOA';
	rating?: { ratingValue: number; reviewCount: number };
	publishedTime?: string;
	modifiedTime?: string;
	author?: string;
	tags?: string[];
	entity?: any;
}

export function Head(props: HeadProps) {
	const {
		title,
		description,
		image,
		url,
		type = 'website',
		price,
		currency,
		rating,
		publishedTime,
		modifiedTime,
		author,
		tags,
		entity,
	} = props;

	const seoData = useMemo(() => {
		return {
			title: generateSeoTitle(title),
			description: generateSeoDescription(undefined, entity),
			image: image || generateSeoImage(type, entity),
			url: url || generateSeoUrl(window.location.pathname),
			type,
			price,
			currency,
			rating,
			publishedTime,
			modifiedTime,
			author,
			tags,
		};
	}, [
		title,
		description,
		image,
		url,
		type,
		price,
		currency,
		rating,
		publishedTime,
		modifiedTime,
		author,
		tags,
		entity,
	]);

	const jsonLd = useMemo(
		() =>
			generateJsonLd(
				seoData.type === 'website'
					? 'WebPage'
					: seoData.type === 'product'
						? 'Product'
						: seoData.type === 'local-business'
							? 'LocalBusiness'
							: seoData.type === 'organization'
								? 'Organization'
								: 'WebPage',
				seoData.title,
				seoData.description,
				seoData.url,
				entity,
				seoData.price,
				seoData.rating,
				seoData.publishedTime,
				seoData.modifiedTime,
				seoData.author,
				seoData.tags,
			),
		[seoData],
	);

	return (
		<>
			{/* Basic Meta Tags */}
			<title>{seoData.title}</title>
			<meta name="description" content={seoData.description} />
			<meta name="language" content="pt-AO" />
			<meta name="author" content="Caxinda Divulga" />
			<meta name="theme-color" content="#0E1733" />
			<link rel="canonical" href={seoData.url} />

			{/* OpenGraph / Facebook */}
			<meta property="og:type" content="website" />
			<meta property="og:title" content={seoData.title} />
			<meta property="og:description" content={seoData.description} />
			<meta property="og:url" content={seoData.url} />
			<meta property="og:image" content={seoData.image} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:locale" content="pt_AO" />
			<meta property="og:site_name" content="Caxinda Divulga" />

			{/* Twitter Card */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={seoData.title} />
			<meta name="twitter:description" content={seoData.description} />
			<meta name="twitter:image" content={seoData.image} />
			<meta name="twitter:site" content="@caxindadivulga" />
			<meta name="twitter:creator" content="@caxindadivulga" />

			{/* JSON-LD Structured Data */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>

			{/* Preconnect */}
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link
				rel="preconnect"
				href="https://fonts.gstatic.com"
				crossOrigin="anonymous"
			/>
		</>
	);
}
