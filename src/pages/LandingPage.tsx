import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import {
	useAds,
	useBusinesses,
	useCategories,
	useTrendingAds,
} from '../hooks/queries';
import { BusinessCard } from '../components/businesses/BusinessCard';
import { BusinessCardSkeletonGrid } from '../components/businesses/BusinessCardSkeleton';
import { CategoryMarquee } from '../components/ui/CategoryMarquee';
import { PartnerMarquee } from '../components/ui/PartnerMarquee';
import { ProductShelf } from '../components/ui/ProductShelf';

const HERO_IMAGES = Array.from(
	{ length: 9 },
	(_, i) => `/images/hero/${i + 1}.png`,
);

const AD_BANNER_TOP = 'https://kuvangana.com/images/ads/3.png';
const AD_BANNER_MIDDLE = 'https://kuvangana.com/images/ads/2.png';

const SHELF_COUNT = 8;

function CategoryCardSkeletonGrid({
	count,
	gridClassName,
}: {
	count: number;
	gridClassName: string;
}) {
	return (
		<div className={gridClassName}>
			{Array.from({ length: count }).map((_, i) => (
				<div
					key={i}
					className="animate-pulse overflow-hidden rounded-2xl bg-ink/5"
				>
					<div className="aspect-[4/3] bg-ink/5" />
					<div className="space-y-2 p-4">
						<div className="h-4 w-2/3 rounded bg-ink/10" />
						<div className="h-3 w-1/3 rounded bg-ink/5" />
					</div>
				</div>
			))}
		</div>
	);
}

function AdBanner({ src, alt }: { src: string; alt: string }) {
	return (
		<section className="mx-auto max-w-6xl px-4">
			<img
				src={src}
				alt={alt}
				loading="lazy"
				className="w-full rounded-2xl object-cover shadow-md"
			/>
		</section>
	);
}

export default function LandingPage() {
	usePageTitle('Caxinda Divulga');
	const [heroIndex, setHeroIndex] = useState(0);
	const { data: featuredAds, isLoading: featuredAdsLoading } = useAds({
		limit: SHELF_COUNT,
		featured: true,
	});
	const { data: trendingAds, isLoading: trendingAdsLoading } =
		useTrendingAds(SHELF_COUNT);
	const { data: newestAds, isLoading: newestAdsLoading } = useAds({
		limit: SHELF_COUNT,
		sortBy: 'newest',
	});
	const { data: businesses, isLoading: businessesLoading } = useBusinesses({
		limit: 4,
		sortBy: 'newest',
	});
	const { data: productCategories, isLoading: productCategoriesLoading } =
		useCategories('AD');

	useEffect(() => {
		const timer = setInterval(() => {
			setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	return (
		<div>
			{/* Hero */}
			<section className="relative flex min-h-[50vh] -mt-16 items-center justify-center overflow-hidden">
				{HERO_IMAGES.map((src, idx) => (
					<img
						key={src}
						src={src}
						alt=""
						className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
							idx === heroIndex ? 'opacity-100' : 'opacity-0'
						}`}
					/>
				))}
				<div className="absolute inset-0 bg-ink/70" />
				<div className="relative z-10 mx-auto max-w-3xl px-4 pt-16 text-center">
					<h1 className="font-display text-4xl leading-tight font-black text-white text-balance md:text-5xl">
						O marketplace de Angola
					</h1>
					<p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
						Divulga serviços, vende produtos e destaca o teu
						estabelecimento em todo o país.
					</p>
				</div>
				<div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
					{HERO_IMAGES.map((_, idx) => (
						<button
							key={idx}
							type="button"
							onClick={() => setHeroIndex(idx)}
							className={`h-2 rounded-full transition-all ${
								idx === heroIndex
									? 'w-6 bg-blue'
									: 'w-2 bg-white/40 hover:bg-white/70'
							}`}
							aria-label={`Imagem ${idx + 1}`}
						/>
					))}
				</div>
			</section>

			{/* Kwanza strip */}
			<div className="h-1.5 bg-blue" />

			{/* Categorias de Produtos */}
			<section className="bg-white py-16">
				<div className="mx-auto max-w-6xl px-4">
					<div className="mb-8 flex items-end justify-between">
						<div>
							<h2 className="mt-2 font-display text-2xl font-black text-ink">
								Categorias de Produtos
							</h2>
						</div>
						<Link
							to="/produtos"
							className="text-sm font-bold text-red hover:underline"
						>
							Ver tudo →
						</Link>
					</div>
					{productCategoriesLoading ? (
						<CategoryCardSkeletonGrid
							count={8}
							gridClassName="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4"
						/>
					) : (productCategories ?? []).length === 0 ? null : (
						<CategoryMarquee
							categories={productCategories ?? []}
							baseTo="/produtos"
						/>
					)}
				</div>
			</section>

			{/* Produtos em destaque */}
			<ProductShelf
				kicker="Produtos"
				title="Em destaque"
				to="/produtos"
				items={featuredAds?.items ?? []}
				isLoading={featuredAdsLoading}
				loadingCount={SHELF_COUNT}
			/>

			{/* Mais vistos nos últimos 7 dias */}
			<ProductShelf
				kicker="Produtos"
				title="Mais vistos"
				to="/produtos"
				items={trendingAds?.items ?? []}
				isLoading={trendingAdsLoading}
				loadingCount={SHELF_COUNT}
				sectionClassName="bg-white"
			/>

			{/* Novidades */}
			<ProductShelf
				kicker="Produtos"
				title="Novidades"
				to="/produtos"
				items={newestAds?.items ?? []}
				isLoading={newestAdsLoading}
				loadingCount={SHELF_COUNT}
			/>

			{/* Banner superior */}
			<section className="py-16">
				<AdBanner src={AD_BANNER_TOP} alt="Publicidade" />
			</section>

			{/* Como funciona */}
			<section className="py-16">
				<div className="mx-auto max-w-6xl px-4">
					<div className="mb-10 text-center">
						<span className="kicker">Passo a passo</span>
						<h2 className="mt-2 font-display text-2xl font-black">
							Como funciona
						</h2>
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						{[
							{
								n: '01',
								t: 'Regista a tua empresa',
								d: 'Cria uma conta grátis e adiciona os dados da tua empresa em poucos minutos.',
							},
							{
								n: '02',
								t: 'Escolhe o teu plano',
								d: 'Seleciona o plano ideal para ganhar mais visibilidade e alcançar mais clientes.',
							},
							{
								n: '03',
								t: 'Recebe clientes',
								d: 'Os clientes encontram a tua empresa, contactam-te e o teu negócio cresce.',
							},
						].map((s) => (
							<div key={s.n} className="card-elevated p-6">
								<span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-red font-mono text-sm font-bold text-white">
									{s.n}
								</span>
								<h3 className="font-display text-sm font-bold">
									{s.t}
								</h3>
								<p className="mt-1.5 text-sm leading-relaxed text-ink/60">
									{s.d}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Banner intermédio */}
			<section className="pb-16">
				<AdBanner src={AD_BANNER_MIDDLE} alt="Publicidade" />
			</section>

			{/* Empresas em destaque */}
			<section className="py-16">
				<div className="mx-auto max-w-6xl px-4">
					<div className="mb-8 flex items-end justify-between">
						<div>
							<h2 className="mt-2 font-display text-2xl font-black">
								Empresas Em destaque
							</h2>
						</div>
						<Link
							to="/empresas"
							className="text-sm font-bold text-blue hover:underline"
						>
							Ver todas →
						</Link>
					</div>
					{businessesLoading ? (
						<BusinessCardSkeletonGrid
							count={4}
							gridClassName="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 lg:items-start"
						/>
					) : (
						<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 lg:items-start">
							{(businesses?.items ?? []).map((b) => (
								<BusinessCard key={b.id} business={b} />
							))}
						</div>
					)}
				</div>
			</section>

			{/* Parceiros */}
			<section className="border-t border-ink/5 py-14">
				<div className="mx-auto max-w-6xl px-4">
					<div className="mb-8 text-center">
						<span className="kicker">Parceiros</span>
						<h2 className="mt-2 font-display text-2xl font-black">
							Empresas que confiam na Caxinda
						</h2>
					</div>
					<PartnerMarquee />
				</div>
			</section>

			{/* CTA final */}
			<section className="mx-auto max-w-6xl px-4">
				<div className="overflow-hidden rounded-2xl bg-blue shadow-[0_20px_50px_rgba(14,23,51,0.2)]">
					<div className="px-6 py-16 text-center sm:px-10">
						<h2 className="mt-3 text-balance font-display text-3xl font-black text-white md:text-4xl">
							Faça a sua empresa ser vista.
						</h2>
						<p className="mx-auto mt-4 max-w-xl text-base text-white/65">
							Regista a tua empresa na Caxinda Divulga e junta-te
							a milhares de negócios em toda a Angola que ganham
							novos clientes todos os dias.
						</p>
						<div className="mt-8 flex flex-wrap justify-center gap-3">
							<Link
								to="/area/empresas"
								className="btn-primary shadow-[0_8px_18px_rgba(14,23,51,0.18)]"
							>
								Registar empresa grátis
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
