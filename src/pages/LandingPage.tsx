import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAds, useBusinesses } from '../hooks/queries';
import { AdCard } from '../components/ads/AdCard';
import { AdCardSkeletonGrid } from '../components/ads/AdCardSkeleton';
import { BusinessCard } from '../components/businesses/BusinessCard';
import { BusinessCardSkeletonGrid } from '../components/businesses/BusinessCardSkeleton';

const HERO_IMAGES = [
	'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1920&q=80',
	'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1920&q=80',
	'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
];

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

	useEffect(() => {
		const timer = setInterval(() => {
			setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	return (
		<div>
			{/* Hero */}
			<section className="relative flex min-h-screen -mt-16 items-center justify-center overflow-hidden">
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
					<p className="text-lg leading-relaxed text-white/80">
						Caxinda Divulga é a plataforma que leva o teu negócio a
						outro nível. Divulga serviços, vende produtos e destaca
						o teu estabelecimento em todo o país.
					</p>
					<div className="mt-8 flex flex-wrap justify-center gap-3">
						<Link
							to="/anuncios"
							className="btn-primary !bg-white !text-ink hover:!bg-white/90"
						>
							Explorar anúncios
						</Link>
						<Link
							to="/auth/registar"
							className="btn-outline !border-white/40 !text-white hover:!border-white/80"
						>
							Criar conta grátis
						</Link>
					</div>
				</div>
				<div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
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

			{/* Anúncios em destaque */}
			<section className="bg-white py-14">
				<div className="mx-auto max-w-6xl px-4">
					<div className="mb-6 flex items-end justify-between">
						<h2 className="font-display text-2xl font-black">
							Em destaque
						</h2>
						<Link
							to="/anuncios"
							className="text-sm font-bold text-red hover:underline"
						>
							Ver todos →
						</Link>
					</div>
					{adsLoading ? (
						<AdCardSkeletonGrid
							count={4}
							gridClassName="grid grid-cols-2 gap-4 md:grid-cols-4"
						/>
					) : (
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
							{(ads?.items ?? []).map((ad) => (
								<AdCard key={ad.id} ad={ad} />
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
							t: 'Cria a tua conta',
							d: 'Regista-te em segundos, com email ou via Google. Sem custos.',
						},
						{
							n: '2',
							t: 'Publica o teu anúncio ou empresa',
							d: 'Fotografa, descreve e cola o preço. O teu negócio online.',
						},
						{
							n: '3',
							t: 'Vende e destaca',
							d: 'Recebe mensagens dos compradores e sobe de nível com os planos.',
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

			{/* Empresas em destaque */}
			<section className="bg-white py-14">
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
							gridClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
						/>
					) : (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
							{(businesses?.items ?? []).map((b) => (
								<BusinessCard key={b.id} business={b} />
							))}
						</div>
					)}
				</div>
			</section>

			{/* CTA final */}
			<section className="bg-blue text-white">
				<div className="mx-auto max-w-6xl px-4 py-10 text-center">
					<h2 className="font-display text-3xl font-black">
						O teu negócio merece ser visto.
					</h2>
					<p className="mx-auto mt-3 max-w-xl text-blue-100">
						Junta-te milhares de vendedores e serviços em Angola que
						já usam a Caxinda Divulga para vender mais todos os
						dias.
					</p>
					<div className="mt-8 flex justify-center gap-3">
						<Link to="/auth/registar" className="btn-kwanza">
							Começar hoje — é grátis
						</Link>
						<Link
							to="/planos"
							className="btn-outline !border-white/40 !text-white hover:!border-white/80"
						>
							Ver planos
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
