import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAds, useBusinesses, useCategories } from '../hooks/queries';
import { AdCard } from '../components/ads/AdCard';
import { AdCardSkeletonGrid } from '../components/ads/AdCardSkeleton';
import { BusinessCard } from '../components/businesses/BusinessCard';
import { BusinessCardSkeletonGrid } from '../components/businesses/BusinessCardSkeleton';
import type { Category } from '../types/api';

const HERO_IMAGES = [
	'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1920&q=80',
	'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1920&q=80',
	'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
];

const AD_BANNER_TOP = 'https://kuvangana.com/images/ads/3.png';
const AD_BANNER_MIDDLE = 'https://kuvangana.com/images/ads/2.png';

function CategoryCard({ category, to }: { category: Category; to: string }) {
	const count =
		category.type === 'AD' ? category.adCount : category.businessCount;
	const countLabel =
		category.type === 'AD'
			? count === 1
				? 'produto'
				: 'produtos'
			: count === 1
				? 'empresa'
				: 'empresas';

	return (
		<Link
			to={to}
			className="group relative block overflow-hidden rounded-2xl border border-white/10 transition hover:-translate-y-0.5 hover:shadow-lg"
		>
			<div className="relative aspect-[4/3] overflow-hidden bg-white/5">
				{category.imageUrl ? (
					<img
						src={category.imageUrl}
						alt={category.name}
						loading="lazy"
						className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full items-center justify-center bg-gradient-to-br from-white/5 to-white/10 font-display text-3xl font-black text-white/15">
						{category.name}
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
			</div>
			<div className="absolute inset-x-0 bottom-0 p-4">
				<h3 className="font-display text-base font-black text-white drop-shadow-sm">
					{category.name}
				</h3>
				<p className="mt-0.5 text-xs font-semibold text-white/60">
					{count} {countLabel}
				</p>
			</div>
		</Link>
	);
}

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
					className="animate-pulse overflow-hidden rounded-2xl bg-white/5"
				>
					<div className="aspect-[4/3] bg-white/5" />
					<div className="space-y-2 p-4">
						<div className="h-4 w-2/3 rounded bg-white/10" />
						<div className="h-3 w-1/3 rounded bg-white/5" />
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
	const { data: ads, isLoading: adsLoading } = useAds({
		limit: 8,
		featured: true,
	});
	const { data: businesses, isLoading: businessesLoading } = useBusinesses({
		limit: 4,
		sortBy: 'newest',
	});
	const { data: productCategories, isLoading: productCategoriesLoading } =
		useCategories('AD');
	const { data: businessCategories, isLoading: businessCategoriesLoading } =
		useCategories('BUSINESS');

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
									? 'w-6 bg-kwanza'
									: 'w-2 bg-white/40 hover:bg-white/70'
							}`}
							aria-label={`Imagem ${idx + 1}`}
						/>
					))}
				</div>
			</section>

			{/* Kwanza strip */}
			<div className="h-1.5 bg-kwanza" />

			{/* Produtos em destaque */}
			<section className="py-16">
				<div className="mx-auto max-w-6xl px-4">
					<div className="mb-8 flex items-end justify-between">
						<div>
							<span className="kicker">Produtos</span>
							<h2 className="mt-2 font-display text-2xl font-black">
								Em destaque
							</h2>
						</div>
						<Link
							to="/produtos"
							className="text-sm font-bold text-red hover:underline"
						>
							Ver todos →
						</Link>
					</div>
					{adsLoading ? (
						<AdCardSkeletonGrid
							count={4}
							gridClassName="grid grid-cols-2 gap-5 md:grid-cols-4 lg:items-start"
						/>
					) : (
						<div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:items-start">
							{(ads?.items ?? []).map((a) => (
								<AdCard key={a.id} ad={a} />
							))}
						</div>
					)}
				</div>
			</section>

			{/* Banner superior */}
			<section className="pb-16">
				<AdBanner src={AD_BANNER_TOP} alt="Publicidade" />
			</section>

			{/* Categorias de Produtos — dark section */}
			<section className="bg-ink py-16">
				<div className="mx-auto max-w-6xl px-4">
					<div className="mb-8 flex items-end justify-between">
						<div>
							<span className="kicker text-kwanza">
								Categorias
							</span>
							<h2 className="mt-2 font-display text-2xl font-black text-white">
								Produtos
							</h2>
						</div>
						<Link
							to="/produtos"
							className="text-sm font-bold text-kwanza hover:underline"
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
						<div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
							{(productCategories ?? []).map((cat) => (
								<CategoryCard
									key={cat.id}
									category={cat}
									to={`/produtos?categoryIds=${cat.id}`}
								/>
							))}
						</div>
					)}
				</div>
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
								<span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-kwanza font-mono text-sm font-bold text-ink">
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

			{/* Categorias de Empresas — dark variant */}
			<section className="bg-ink-soft py-16">
				<div className="mx-auto max-w-6xl px-4">
					<div className="mb-8 flex items-end justify-between">
						<div>
							<span className="kicker text-kwanza">
								Categorias
							</span>
							<h2 className="mt-2 font-display text-2xl font-black text-white">
								Empresas
							</h2>
						</div>
						<Link
							to="/empresas"
							className="text-sm font-bold text-kwanza hover:underline"
						>
							Ver tudo →
						</Link>
					</div>
					{businessCategoriesLoading ? (
						<CategoryCardSkeletonGrid
							count={4}
							gridClassName="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4"
						/>
					) : (businessCategories ?? []).length === 0 ? null : (
						<div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
							{(businessCategories ?? []).map((cat) => (
								<CategoryCard
									key={cat.id}
									category={cat}
									to={`/empresas?categoryIds=${cat.id}`}
								/>
							))}
						</div>
					)}
				</div>
			</section>

			{/* Empresas em destaque */}
			<section className="py-16">
				<div className="mx-auto max-w-6xl px-4">
					<div className="mb-8 flex items-end justify-between">
						<div>
							<span className="kicker">Empresas</span>
							<h2 className="mt-2 font-display text-2xl font-black">
								Em destaque
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

			{/* CTA final */}
			<section className="mx-auto max-w-6xl px-4">
				<div className="overflow-hidden rounded-2xl bg-blue shadow-[0_20px_50px_rgba(14,23,51,0.2)]">
					<div className="px-6 py-16 text-center sm:px-10">
						<span className="block kicker text-kwanza">Caxinda Divulga</span>
					<h2 className="mt-3 text-balance font-display text-3xl font-black text-white md:text-4xl">
						Faça a sua empresa ser vista.
					</h2>
					<p className="mx-auto mt-4 max-w-xl text-base text-white/65">
						Regista a tua empresa na Caxinda Divulga e junta-te a
						milhares de negócios em toda a Angola que ganham novos
						clientes todos os dias.
					</p>
					<div className="mt-8 flex flex-wrap justify-center gap-3">
						<Link
							to="/auth/registar"
							className="btn-kwanza shadow-[0_8px_18px_rgba(14,23,51,0.18)]"
						>
							Registar empresa grátis
						</Link>
						<Link
							to="/planos"
							className="btn-outline !border-white/45 !text-white hover:!border-white/85"
						>
							Ver planos
					</Link>
					</div>
				</div>
				</div>
			</section>
		</div>
	);
}
