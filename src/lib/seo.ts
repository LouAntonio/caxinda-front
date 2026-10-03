const DEFAULT_IMAGE = '/images/og-default.jpg';
const DEFAULT_TITLE_SUFFIX = ' - Caxinda';
const SITE_URL = 'https://caxindadivulga.com';

export interface SeoUtils {
	generateTitle: (title?: string) => string;
	generateDescription: (page?: string, entity?: any) => string;
	generateUrl: (path: string) => string;
	generateImage: (type: string, entity?: any) => string;
	generateJsonLd: (
		type:
			| 'WebPage'
			| 'Product'
			| 'LocalBusiness'
			| 'Organization'
			| 'BreadcrumbList',
		title: string,
		description: string,
		url: string,
		entity?: any,
		price?: number,
		rating?: { ratingValue: number; reviewCount: number },
		publishedTime?: string,
		modifiedTime?: string,
		author?: string,
		tags?: string[],
	) => Record<string, any>;
}

export function generateSeoTitle(title?: string): string {
	return title
		? `${title}${DEFAULT_TITLE_SUFFIX}`
		: `Caxinda Divulga${DEFAULT_TITLE_SUFFIX}`;
}

export function generateSeoDescription(page?: string, entity?: any): string {
	const baseDescription =
		'Caxinda Divulga - a plataforma que leva o seu negócio a outro nível. Divulgue serviços, venda produtos e destaque o seu estabelecimento em Angola.';

	switch (page) {
		case 'ad-detail':
			return entity?.description
				? `${entity.title} - ${entity.description.substring(0, 150)}... Encontre este produto na Caxinda Divulga.`
				: `${entity?.title || 'Produto'} - Anúncio verificado na plataforma de Angola. Converse diretamente com o vendedor.`;
		case 'business-detail':
			return entity?.description
				? `${entity.name} - ${entity.description.substring(0, 150)}... Encontre esta empresa na Caxinda Divulga.`
				: `${entity?.name || 'Empresa'} - Negócio verificado em Angola. Entre em contato para saber mais.`;
		case 'ads-list':
			return `Encontre ${entity?.count || 'milhares'} de produtos em Angola. Desde o artesanato local até produtos importados.`;
		case 'businesses-list':
			return `Descubra centenas de empresas em Angola. Do artesanato local ao serviços profissionais.`;
		case 'about':
			return 'Saiba mais sobre a Caxinda Divulga - a plataforma que aproxima compradores e vendedores em Angola.';
		case 'terms':
			return 'Termos e condições da Caxinda Divulga. Entenda seus direitos e obrigações ao usar nossa plataforma.';
		case 'privacy':
			return 'Política de privacidade da Caxinda Divulga. Como protegemos seus dados pessoais e usamos suas informações.';
		case 'cookies':
			return 'Política de cookies da Caxinda Divulga. Como usamos cookies para melhorar sua experiência na plataforma.';
		case 'contact':
			return 'Fale com a Caxinda Divulga. Suporte 24/7 para perguntas sobre contas, anúncios e empresas.';
		case 'plans':
			return 'Planos da Caxinda Divulga. Desenvolvemos kwanza transparentes para destacar seu negócio em Angola.';
		default:
			return baseDescription;
	}
}

export function generateSeoUrl(path: string): string {
	const cleanPath = path.startsWith('/') ? path.slice(1) : path;
	return `${SITE_URL}/${cleanPath}`;
}

export function generateSeoImage(type: string, entity?: any): string {
	if (entity?.imageUrl) return entity.imageUrl;

	switch (type) {
		case 'product':
			return entity?.gallery?.[0]?.url || DEFAULT_IMAGE;
		case 'business':
			return entity?.logoUrl || DEFAULT_IMAGE;
		case 'website':
			return DEFAULT_IMAGE;
		default:
			return DEFAULT_IMAGE;
	}
}

export function generateJsonLd(
	type:
		| 'WebPage'
		| 'Product'
		| 'LocalBusiness'
		| 'Organization'
		| 'BreadcrumbList',
	title: string,
	description: string,
	url: string,
	entity?: any,
	price?: number,
	rating?: { ratingValue: number; reviewCount: number },
	publishedTime?: string,
	modifiedTime?: string,
	author?: string,
	tags?: string[],
): Record<string, any> {
	const jsonLd: Record<string, any> = {
		'@context': 'https://schema.org',
		name: title,
		description: description,
		url: url,
	};

	if (entity?.imageUrl) {
		jsonLd.image = entity.imageUrl;
	}

	switch (type) {
		case 'WebPage':
			jsonLd['@type'] = 'WebPage';
			jsonLd.datePublished = publishedTime;
			jsonLd.dateModified = modifiedTime;
			jsonLd.author = {
				'@type': 'Organization',
				name: author || 'Caxinda Divulga',
			};
			break;

		case 'Product':
			jsonLd['@type'] = 'Product';
			if (price) {
				jsonLd.offers = {
					'@type': 'Offer',
					price: price,
					priceCurrency: 'AOA',
					availability: 'https://schema.org/InStock',
				};
			}
			if (rating) {
				jsonLd.aggregateRating = {
					'@type': 'AggregateRating',
					ratingValue: rating.ratingValue,
					reviewCount: rating.reviewCount,
				};
			}
			break;

		case 'LocalBusiness':
			jsonLd['@type'] = 'LocalBusiness';
			jsonLd.telephone = '+244 923 000 000';
			jsonLd.address = {
				'@type': 'PostalAddress',
				addressCountry: 'AO',
				addressRegion: 'Luanda',
			};
			jsonLd.sameAs = [
				'https://www.facebook.com/share/1QQ4oB2nSv/?mibextid=wwXIfr',
				'https://www.instagram.com/caxinda_divulga?stkn=MTU1NGx2aWpnd3Fsdg%3D%3D&utm_source=qr',
				'https://www.linkedin.com/company/caxinda-divulga/',
				'https://www.tiktok.com/@caxindadivulga?_r=1&_t=ZS-99xI6ehfEay',
			];
			break;

		case 'Organization':
			jsonLd['@type'] = 'Organization';
			jsonLd.logo = `${SITE_URL}/images/logo/icon.png`;
			jsonLd.sameAs = [
				'https://www.facebook.com/share/1QQ4oB2nSv/?mibextid=wwXIfr',
				'https://www.instagram.com/caxinda_divulga?stkn=MTU1NGx2aWpnd3Fsdg%3D%3D&utm_source=qr',
				'https://www.linkedin.com/company/caxinda-divulga/',
				'https://www.tiktok.com/@caxindadivulga?_r=1&_t=ZS-99xI6ehfEay',
			];
			break;
	}

	if (tags?.length) {
		jsonLd.keywords = tags;
	}

	return jsonLd;
}

export const seoUtils: SeoUtils = {
	generateTitle: generateSeoTitle,
	generateDescription: generateSeoDescription,
	generateUrl: generateSeoUrl,
	generateImage: generateSeoImage,
	generateJsonLd: generateJsonLd,
};

export default seoUtils;
