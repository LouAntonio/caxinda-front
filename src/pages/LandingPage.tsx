import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import {
	useCategories,
	useAds,
	useBusinesses,
	usePlans,
} from '../hooks/queries';
import { AdCard } from '../components/ads/AdCard';
import { BusinessCard } from '../components/businesses/BusinessCard';
import { PageLoader } from '../components/ui/Spinner';
import { formatKz } from '../lib/format';

const STATS = [
	{ value: '18', label: 'Províncias' },
	{ value: '00', label: 'Centavos para começar' },
	{ value: '24/7', label: 'A divulgar Angola' },
];

export default function LandingPage() {
	usePageTitle('Caxinda Divulga');
	const { data: categories } = useCategories();
	const { data: ads, isLoading: adsLoading } = useAds({
		limit: 8,
		featured: true,
	});
	const { data: businesses, isLoading: businessesLoading } = useBusinesses({
		limit: 4,
		sortBy: 'newest',
	});
	const { data: plans } = usePlans();

	return (
		<div>
			{/* Hero */}
			<section className="relative overflow-hidden bg-ink text-snow">
				<div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-red/20 blur-3xl" />
				<div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue/20 blur-3xl" />
				<div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center md:py-28">
					<div>
						<span className="tag tag-kwanza mb-5">
							O caxinda digital 🇦🇴
						</span>
						<h1 className="font-display text-4xl font-black leading-tight md:text-5xl">
							Do teu barraco na{' '}
							<span className="text-red">boca do tema</span> ao
							<span className="text-kwanza">
								{' '}
								bingk e grande escala
							</span>
							.
						</h1>
						<p className="mt-4 max-w-lg text-snow/70">
							Caxinda Divulga é a plataforma que leva o teu
							negócio a outro nível. Divulga serviços, vende
							produtos e destaca o teu estabelecimento em todo o
							país.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<Link to="/anuncios" className="btn-primary">
								Explorar anúncios
							</Link>
							<Link
								to="/auth/registar"
								className="btn-outline !border-snow/30 !text-snow hover:!border-snow/60"
							>
								Criar conta grátis
							</Link>
						</div>
					</div>
					<div className="relative grid gap-4">
						<div className="card !border-ink/20 bg-white/5 !bg-white !p-0">
							<AdCard ad={sampleAd()} />
						</div>
						<div className="rounded-2xl border border-kwanza/40 bg-kwanza p-4">
							<p className="font-mono text-xs font-bold uppercase tracking-widest text-ink/60">
								Vende mais com planos
							</p>
							<p className="mt-1 font-display text-xl font-black text-ink">
								Destaques por{' '}
								{plans?.plans?.[0]
									? formatKz(plans.plans[0].price)
									: 'pouco'}
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Stats */}
			<section className="border-b border-ink/10 bg-white">
				<div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3">
					{STATS.map((s) => (
						<div key={s.label} className="text-center">
							<p className="font-mono text-3xl font-bold text-red">
								{s.value}
							</p>
							<p className="text-sm font-bold text-ink/60">
								{s.label}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Categorias */}
			<section className="mx-auto max-w-6xl px-4 py-14">
				<div className="mb-6 flex items-end justify-between">
					<h2 className="font-display text-2xl font-black">
						Navega por categoria
					</h2>
					<Link
						to="/anuncios"
						className="text-sm font-bold text-red hover:underline"
					>
						Ver tudo →
					</Link>
				</div>
				<div className="flex flex-wrap gap-3">
					{(categories ?? []).map((cat) => (
						<Link
							key={cat.id}
							to={`/anuncios?categoryIds=${cat.id}`}
							className="rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:border-red hover:text-red"
						>
							{cat.name}
							<span className="ml-2 font-mono text-xs text-ink/40">
								{cat.adCount}
							</span>
						</Link>
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
						<PageLoader />
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

			{/* Empresas recém-chegadas */}
			<section className="bg-white py-14">
				<div className="mx-auto max-w-6xl px-4">
					<div className="mb-6 flex items-end justify-between">
						<h2 className="font-display text-2xl font-black">
							Empresas recém-chegadas
						</h2>
						<Link
							to="/empresas"
							className="text-sm font-bold text-blue hover:underline"
						>
							Ver todas →
						</Link>
					</div>
					{businessesLoading ? (
						<PageLoader />
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
				<div className="mx-auto max-w-6xl px-4 py-16 text-center">
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

function sampleAd() {
	return {
		id: 'hero',
		slug: 'exemplo',
		title: 'Fato kizomba do Cunene',
		description: '',
		price: 15000,
		status: 'ACTIVE' as const,
		visibility: 'VISIBLE' as const,
		verified: true,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		image: null,
		imageId: null,
		gallery: [],
		userId: 'x',
		averageRating: 4.5,
		reviewCount: 12,
		featured: true,
		featuredUntil: null,
		views: 0,
		location: null,
		user: {
			id: 'x',
			name: 'Carla',
			surname: 'Kissanga',
			image: null,
			trustScore: 90,
			isVerified: true,
			verifiedAt: null,
			createdAt: '',
		},
	};
}
