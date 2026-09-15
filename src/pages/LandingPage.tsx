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
			className="group relative block overflow-hidden rounded-2xl border border-ink/10 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
		>
			<div className="relative aspect-[4/3] overflow-hidden bg-snow-dark">
				{category.imageUrl ? (
					<img
						src={category.imageUrl}
						alt={category.name}
						loading="lazy"
						className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-dark/10 to-snow-dark font-display text-3xl font-black text-ink/20">
						{category.name}
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
			</div>
			<div className="absolute inset-x-0 bottom-0 p-4">
				<h3 className="font-display text-base font-black text-white drop-shadow-sm">
					{category.name}
				</h3>
				<p className="mt-0.5 text-xs font-semibold text-white/80">
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
					className="animate-pulse overflow-hidden rounded-2xl border border-ink/10 bg-white"
				>
					<div className="aspect-[4/3] bg-ink/10" />
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
				className="w-full rounded-2xl border border-ink/10 object-cover shadow-sm"
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
				<div className="absolute inset-0 bg-ink/60" />
				<div className="relative z-10 mx-auto max-w-2xl px-4 pt-16 text-center text-white">
					<p className="text-base leading-relaxed text-white/80 md:text-lg">
						Caxinda Divulga é a plataforma que leva o teu negócio a
						outro nível. Divulga serviços, vende produtos e destaca
						o teu estabelecimento em todo o país.
					</p>
					<div className="mt-6 flex flex-wrap justify-center gap-3">
						<Link
							to="/produtos"
							className="btn-primary !bg-white !text-ink hover:!bg-white/90"
						>
							Explorar produtos
						</Link>
						<Link
							to="/auth/registar"
							className="btn-outline !border-white/40 !text-white hover:!border-white/80"
						>
							Criar conta grátis
						</Link>
					</div>
				</div>
				<div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
					{HERO_IMAGES.map((_, idx) => (
						<button
							key={idx}
							type="button"
							onClick={() => setHeroIndex(idx)}
							className={`h-2 rounded-full transition-all ${
								idx === heroIndex
									? 'w-6 bg-white'
									: 'w-2 bg-white/50 hover:bg-white/80'
							}`}
							aria-label={`Imagem ${idx + 1}`}
						/>
					))}
				</div>
			</section>

			{/* Produtos em destaque */}
			<section className="py-12">
				<div className="mx-auto max-w-6xl px-4">
					<div className="mb-6 flex items-end justify-between">
						<h2 className="font-display text-2xl font-black">
							Produtos em destaque
						</h2>
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
							gridClassName="grid grid-cols-2 gap-4 md:grid-cols-4 lg:items-start"
						/>
					) : (
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:items-start">
							{(ads?.items ?? []).map((a) => (
								<AdCard key={a.id} ad={a} />
							))}
						</div>
					)}
				</div>
			</section>

			{/* Banner superior */}
			<AdBanner src={AD_BANNER_TOP} alt="Publicidade" />

			{/* Categorias de Produtos */}
			<section className="bg-white py-14">
				<div className="mx-auto max-w-6xl px-4">
					<div className="mb-6 flex items-end justify-between">
						<h2 className="font-display text-2xl font-black">
							Categorias de Produtos
						</h2>
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
							gridClassName="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
						/>
					) : (productCategories ?? []).length === 0 ? null : (
						<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
			<section className="mx-auto max-w-6xl px-4 py-14">
				<h2 className="mb-8 text-center font-display text-2xl font-black">
					Como funciona
				</h2>
				<div className="grid gap-4 md:grid-cols-3">
					{[
						{
							n: '1',
							t: 'Regista a tua empresa',
							d: 'Cria uma conta grátis e adiciona os dados da tua empresa em poucos minutos.',
						},
						{
							n: '2',
							t: 'Escolhe o teu plano',
							d: 'Seleciona o plano ideal para ganhar mais visibilidade e alcançar mais clientes.',
						},
						{
							n: '3',
							t: 'Recebe clientes',
							d: 'Os clientes encontram a tua empresa, contactam-te e o teu negócio cresce.',
						},
					].map((s) => (
						<div key={s.n} className="card p-6">
							<span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red font-mono text-lg font-bold text-white">
								{s.n}
							</span>
							<h3 className="font-display text-sm font-bold">
								{s.t}
							</h3>
							<p className="mt-1 text-sm text-ink/60">{s.d}</p>
						</div>
					))}
				</div>
			</section>

			{/* Banner intermédio */}
			<AdBanner src={AD_BANNER_MIDDLE} alt="Publicidade" />

			{/* Categorias de Empresas */}
			<section className="bg-white py-14">
				<div className="mx-auto max-w-6xl px-4">
					<div className="mb-6 flex items-end justify-between">
						<h2 className="font-display text-2xl font-black">
							Categorias de Empresas
						</h2>
						<Link
							to="/empresas"
							className="text-sm font-bold text-blue hover:underline"
						>
							Ver tudo →
						</Link>
					</div>
					{businessCategoriesLoading ? (
						<CategoryCardSkeletonGrid
							count={4}
							gridClassName="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
						/>
					) : (businessCategories ?? []).length === 0 ? null : (
						<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
			<section className="py-14">
				<div className="mx-auto max-w-6xl px-4">
					<div className="mb-6 flex items-end justify-between">
						<h2 className="font-display text-2xl font-black">
							Empresas em destaque
						</h2>
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
							gridClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:items-start"
						/>
					) : (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:items-start">
							{(businesses?.items ?? []).map((b) => (
								<BusinessCard key={b.id} business={b} />
							))}
						</div>
					)}
				</div>
			</section>

			{/* CTA final */}
			<section className="mx-4 max-w-6xl overflow-hidden rounded-2xl border border-blue-light/30 bg-blue shadow-[0_18px_40px_rgba(14,23,51,0.16)] md:mx-auto">
				<div className="px-5 py-12 text-center sm:px-8">
					<h2 className="text-balance font-display text-3xl font-black text-white">
						Faça a sua empresa ser vista.
					</h2>
					<p className="mx-auto mt-4 max-w-xl text-blue-100/85">
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
			</section>
		</div>
	);
}
