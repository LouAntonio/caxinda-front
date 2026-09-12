import { useEffect, useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import {
	Link,
	useNavigate,
	useParams,
	useSearchParams,
} from 'react-router-dom';
import toast from 'react-hot-toast';
import { getApiError } from '../lib/api';
import {
	useAdBySlug,
	useAds,
	useBusinessBySlug,
	useBusinesses,
	useCategories,
	useGlobalSearch,
	usePlans,
	useReviews,
} from '../hooks/queries';
import {
	useAddToWishlist,
	useRemoveFromWishlist,
	useOpenConversation,
	useCreateReview,
	useCreateReport,
	useTrackBusinessClick,
} from '../hooks/mutations';
import { AdCard } from '../components/ads/AdCard';
import { AdCardSkeletonGrid } from '../components/ads/AdCardSkeleton';
import { BusinessCard } from '../components/businesses/BusinessCard';
import { BusinessCardSkeletonGrid } from '../components/businesses/BusinessCardSkeleton';
import { AdDetailSkeleton } from '../components/skeletons/AdDetailSkeleton';
import { BusinessDetailSkeleton } from '../components/skeletons/BusinessDetailSkeleton';
import { Pagination } from '../components/ui/Pagination';
import { ButtonLoader } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Stars } from '../components/ui/Stars';
import { Avatar } from '../components/ui/Avatar';
import { FilterPills } from '../components/ui/FilterPills';
import { MobileFilterDrawer } from '../components/ui/FilterDrawer';
import { Divider } from '../components/ui/Divider';
import { Skeleton } from '../components/ui/Skeleton';
import { Lightbox } from '../components/ui/Lightbox';
import {
	ChatSVG,
	CheckSVG,
	GlobeSVG,
	PhoneSVG,
	PinSVG,
} from '../components/ui/icons/ExtrasSVG';
import { EnvelopeSVG } from '../components/ui/icons/EnvelopeSVG';
import { WhatsAppSVG } from '../components/ui/icons/WhatsAppSVG';
import { useSession } from '../hooks/useSession';
import {
	formatDate,
	formatKz,
	fullName,
	PROVINCE_LABELS,
	timeAgo,
} from '../lib/format';
import {
	PROVINCES,
	REPORT_REASONS,
	type AdSort,
	type BusinessSort,
	type ReportReason,
	type ReportTarget,
	type SearchItem,
	type SearchSort,
	type SearchType,
} from '../types/api';
import { useWishlistCheck } from '../hooks/queries';

// ================= Anúncios (lista) =================

export function AdsPage() {
	usePageTitle('Anúncios');
	const [searchParams, setSearchParams] = useSearchParams();
	const { data: categories } = useCategories('AD');
	const q = searchParams.get('q') ?? '';
	const selectedCategoryIds =
		searchParams.get('categoryIds')?.split(',').filter(Boolean) ?? [];
	const sortBy = searchParams.get('sortBy') ?? 'newest';
	const onlyFeatured = searchParams.get('featured') === 'true';
	const selectedProvinces =
		searchParams.get('provinces')?.split(',').filter(Boolean) ?? [];
	const minPrice = searchParams.get('minPrice')
		? Number(searchParams.get('minPrice'))
		: undefined;
	const maxPrice = searchParams.get('maxPrice')
		? Number(searchParams.get('maxPrice'))
		: undefined;
	const page = Math.max(1, Number(searchParams.get('page')) || 1);

	const [draftQ, setDraftQ] = useState(q);
	const [draftCategories, setDraftCategories] =
		useState<string[]>(selectedCategoryIds);
	const [draftProvinces, setDraftProvinces] =
		useState<string[]>(selectedProvinces);
	const [draftFeatured, setDraftFeatured] = useState(onlyFeatured);
	const [filtersOpen, setFiltersOpen] = useState(false);

	useEffect(() => {
		setDraftQ(q);
		setDraftCategories(selectedCategoryIds);
		setDraftProvinces(selectedProvinces);
		setDraftFeatured(onlyFeatured);
	}, [searchParams]);

	const toggleCategory = (id: string) => {
		setDraftCategories((prev) =>
			prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
		);
	};

	const toggleProvince = (id: string) => {
		setDraftProvinces((prev) =>
			prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
		);
	};

	const commit = () => {
		const next = new URLSearchParams(searchParams);
		if (draftQ) next.set('q', draftQ);
		else next.delete('q');
		if (draftCategories.length > 0)
			next.set('categoryIds', draftCategories.join(','));
		else next.delete('categoryIds');
		if (draftProvinces.length > 0)
			next.set('provinces', draftProvinces.join(','));
		else next.delete('provinces');
		if (draftFeatured) next.set('featured', 'true');
		else next.delete('featured');
		next.delete('page');
		setSearchParams(next);
	};

	const clearFilters = () => {
		setDraftQ('');
		setDraftCategories([]);
		setDraftProvinces([]);
		setDraftFeatured(false);
		setSearchParams(new URLSearchParams());
	};

	const setParam = (key: string, value?: string) => {
		const next = new URLSearchParams(searchParams);
		if (!value) {
			next.delete(key);
		} else {
			next.set(key, value);
		}
		next.delete('page');
		setSearchParams(next);
	};

	const hasActiveFilters =
		draftQ !== '' ||
		draftCategories.length > 0 ||
		draftProvinces.length > 0 ||
		draftFeatured ||
		sortBy !== 'newest';

	const { data, isFetching } = useAds({
		page,
		limit: 15,
		q: q || undefined,
		categoryIds:
			selectedCategoryIds.length > 0
				? selectedCategoryIds.join(',')
				: undefined,
		featured: onlyFeatured || undefined,
		provinces:
			selectedProvinces.length > 0
				? selectedProvinces.join(',')
				: undefined,
		minPrice,
		maxPrice,
		sortBy: sortBy as AdSort,
	});

	const filtersPanel = (
		<>
			<input
				className="input"
				placeholder="Pesquisar anúncios…"
				value={draftQ}
				onChange={(e) => setDraftQ(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						commit();
					}
				}}
			/>
			<button
				type="button"
				onClick={() => setDraftFeatured((prev) => !prev)}
				className={`w-full rounded-xl border-2 px-3 py-2 text-xs font-bold transition ${
					draftFeatured
						? 'border-kwanza bg-kwanza/15 text-ink'
						: 'border-ink/15 text-ink/50 hover:border-ink/30'
				}`}
			>
				★ Apenas destaque
			</button>
			{(categories ?? []).length > 0 && (
				<FilterPills
					label="Categorias"
					items={(categories ?? []).map((c) => ({
						id: c.id,
						name: c.name,
						count: c.adCount,
					}))}
					selected={draftCategories}
					onToggle={toggleCategory}
				/>
			)}
			<FilterPills
				label="Províncias"
				items={PROVINCES.map((p) => ({
					id: p,
					name: PROVINCE_LABELS[p] ?? p,
				}))}
				selected={draftProvinces}
				onToggle={toggleProvince}
			/>
			<div className="flex gap-2">
				<button
					type="button"
					onClick={commit}
					className="flex-1 rounded-xl bg-blue px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
				>
					Pesquisar
				</button>
				{hasActiveFilters && (
					<button
						type="button"
						onClick={clearFilters}
						className="flex items-center justify-center rounded-xl border-2 border-ink/15 px-3 py-2 text-xs text-ink/50 transition hover:border-red/30 hover:text-red"
						title="Limpar filtros"
					>
						✕
					</button>
				)}
			</div>
		</>
	);

	return (
		<div className="mx-auto max-w-6xl px-4 py-10">
			<h1 className="mb-6 font-display text-3xl font-black">Anúncios</h1>

			<div className="flex gap-6 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
				<aside className="nice-scroll hidden w-64 shrink-0 flex-col gap-5 rounded-2xl border border-ink/10 bg-white p-4 lg:sticky lg:top-24 lg:flex lg:max-h-[calc(100vh-6rem)] lg:w-auto lg:overflow-y-auto lg:self-start">
					{filtersPanel}
				</aside>

				<div className="min-w-0 flex-1">
					<div className="mb-4 flex flex-wrap items-center gap-2 lg:hidden">
						<input
							className="input flex-1"
							placeholder="Pesquisar anúncios…"
							value={draftQ}
							onChange={(e) => setDraftQ(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									commit();
								}
							}}
						/>
						<button
							type="button"
							onClick={() => setFiltersOpen(true)}
							className="flex shrink-0 items-center justify-center rounded-xl border-2 border-ink/15 px-3 py-2 text-xs font-bold text-ink/60 transition hover:border-ink/40"
						>
							☰ Filtros
						</button>
						<button
							type="button"
							onClick={commit}
							className="shrink-0 rounded-xl bg-blue px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
						>
							Pesquisar
						</button>
						{hasActiveFilters && (
							<button
								type="button"
								onClick={clearFilters}
								className="flex shrink-0 items-center justify-center rounded-xl border-2 border-ink/15 px-3 py-2 text-xs text-ink/50 transition hover:border-red/30 hover:text-red"
								title="Limpar filtros"
							>
								✕
							</button>
						)}
					</div>

					<div className="mb-4 flex flex-wrap items-center justify-between gap-2">
						<p className="text-sm font-medium text-ink/50">
							A mostrar{' '}
							<span className="font-bold text-ink">
								{data?.items.length ?? 0}
							</span>{' '}
							anúncios de{' '}
							<span className="font-bold text-ink">
								{data?.total ?? 0}
							</span>
						</p>
						<select
							className="input max-w-[200px]"
							value={sortBy}
							onChange={(e) => setParam('sortBy', e.target.value)}
						>
							<option value="newest">Mais recentes</option>
							<option value="oldest">Mais antigos</option>
							<option value="price_asc">
								Preço: menor → maior
							</option>
							<option value="price_desc">
								Preço: maior → menor
							</option>
						</select>
					</div>

					{isFetching ? (
						<AdCardSkeletonGrid count={6} />
					) : (data?.items.length ?? 0) === 0 ? (
						<EmptyState
							title="Sem anúncios encontrados"
							description="Tenta mudar os filtros ou pesquisa noutra província."
						/>
					) : (
						<>
							<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
								{(data?.items ?? []).map((ad) => (
									<AdCard key={ad.id} ad={ad} />
								))}
							</div>
							<Pagination
								page={page}
								totalPages={data?.totalPages ?? 1}
								basePath="/anuncios"
							/>
						</>
					)}
				</div>
			</div>

			<MobileFilterDrawer
				open={filtersOpen}
				onClose={() => setFiltersOpen(false)}
			>
				{filtersPanel}
			</MobileFilterDrawer>
		</div>
	);
}

// ================= Anúncio (detalhe) =================

export function AdDetailPage() {
	const { slug } = useParams();
	usePageTitle('Anúncio');
	const { data: ad, isLoading } = useAdBySlug(slug);
	const navigate = useNavigate();
	const { isAuthenticated } = useSession();
	const openConversation = useOpenConversation();
	const { data: wishlistSaved } = useWishlistCheck(ad?.id);
	const [activeImg, setActiveImg] = useState<string | null>(null);
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
	useEffect(() => {
		setActiveImg(null);
		setLightboxIndex(null);
	}, [slug]);

	if (isLoading) {
		return <AdDetailSkeleton />;
	}
	if (!ad) {
		return (
			<EmptyState
				title="Anúncio não encontrado"
				action={
					<Link to="/anuncios" className="btn-primary">
						Ver anúncios
					</Link>
				}
			/>
		);
	}

	const gallery = ad.gallery ?? [];
	const adImages = [ad.image, ...gallery.map((g) => g.url)].filter(
		(u): u is string => Boolean(u),
	);
	const currentImg = activeImg ?? adImages[0] ?? null;

	const contactCaxinda = () => {
		if (!isAuthenticated) {
			void navigate('/auth/entrar', {
				state: { from: `/anuncios/${ad.slug}` },
			});
			return;
		}
		void toast
			.promise(
				openConversation.mutateAsync({ type: 'SUPPORT', adId: ad.id }),
				{
					loading: 'A abrir conversa com a Caxinda…',
					success: 'Conversa aberta.',
					error: (err) => getApiError(err),
				},
			)
			.then((conv) => navigate(`/area/mensagens?id=${conv.id}`));
	};

	const specRows: { label: string; value: string }[] = [
		{ label: 'Categoria', value: ad.category?.name ?? 'Geral' },
		{
			label: 'Província',
			value: ad.province
				? (PROVINCE_LABELS[ad.province] ?? ad.province)
				: 'Angola',
		},
		{ label: 'Publicado', value: timeAgo(ad.createdAt) },
	];

	return (
		<div className="mx-auto max-w-6xl px-4 py-10">
			<nav className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-ink/50">
				<Link to="/anuncios" className="font-bold hover:text-red">
					Anúncios
				</Link>
				<span className="text-xs text-kwanza">▸</span>
				<span className="truncate text-ink/80">{ad.title}</span>
			</nav>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
				<div className="flex min-w-0 flex-col gap-6">
					<div className="card overflow-hidden">
						<button
							type="button"
							onClick={() => setLightboxIndex(0)}
							className="relative block aspect-[16/10] w-full bg-snow-dark"
							disabled={adImages.length === 0}
							aria-label="Ampliar fotografia"
						>
							{currentImg ? (
								<img
									src={currentImg}
									alt={ad.title}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="flex h-full items-center justify-center bg-snow-dark font-display text-4xl font-black text-ink/20">
									CX
								</div>
							)}
							{adImages.length > 1 && (
								<span className="absolute right-3 bottom-3 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[10px] font-bold text-white backdrop-blur">
									{adImages.length} fotos
								</span>
							)}
						</button>
						{adImages.length > 1 && (
							<div className="grid grid-cols-3 gap-2 border-t border-ink/10 bg-snow p-3 sm:grid-cols-4 md:grid-cols-6">
								{adImages.map((url, idx) => (
									<button
										type="button"
										key={`${url}-${idx}`}
										onClick={() => {
											setActiveImg(url);
											setLightboxIndex(idx);
										}}
										className={`aspect-[4/3] overflow-hidden rounded-lg border-2 transition ${
											currentImg === url
												? 'border-blue'
												: 'border-transparent hover:border-ink/20'
										}`}
									>
										<img
											src={url}
											alt=""
											className="h-full w-full object-cover"
										/>
									</button>
								))}
							</div>
						)}
					</div>

					<div className="card p-6">
						<h2 className="kicker">Detalhes</h2>
						<dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
							{specRows.map((row) => (
								<div key={row.label}>
									<dt className="kicker">{row.label}</dt>
									<dd className="mt-1 text-sm font-bold text-ink">
										{row.value}
									</dd>
								</div>
							))}
						</dl>
					</div>

					<div className="card p-6">
						<h2 className="kicker">Descrição</h2>
						<p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/70">
							{ad.description}
						</p>
					</div>
				</div>

				<aside className="lg:sticky lg:top-24 lg:self-start">
					<div className="card gap-4 p-5">
						<div className="flex flex-wrap items-center gap-1.5">
							{ad.featured && (
								<span className="tag tag-kwanza !px-2.5 !py-0.5">
									★ Destaque
								</span>
							)}
						</div>

						<h1 className="text-balance font-display text-xl font-black leading-tight">
							{ad.title}
						</h1>

						<p className="kicker flex flex-wrap items-center gap-x-2 gap-y-1">
							<span>{ad.category?.name ?? 'Geral'}</span>
							{ad.province && (
								<>
									<span aria-hidden>·</span>
									<span>
										{PROVINCE_LABELS[ad.province] ??
											ad.province}
									</span>
								</>
							)}
							<span aria-hidden>·</span>
							<span>Publicado {timeAgo(ad.createdAt)}</span>
						</p>

						<div className="mt-4">
							{ad.price === null ? (
								<span className="font-mono text-xl font-bold text-ink/50">
									Sob consulta
								</span>
							) : ad.price === 0 ? (
								<span
									className="price-tag-lg"
									style={{
										background: 'var(--color-blue-light)',
										color: 'var(--color-snow)',
									}}
								>
									Grátis
								</span>
							) : (
								<span className="price-tag-lg">
									{formatKz(ad.price)}
								</span>
							)}
						</div>

						{ad.averageRating !== null && (
							<p className="text-sm text-ink/60">
								<Stars value={ad.averageRating} /> ·{' '}
								{ad.reviewCount} avaliações
							</p>
						)}

						<Divider className="my-1" />

						<button
							className="btn-primary w-full"
							onClick={contactCaxinda}
							disabled={openConversation.isPending}
						>
							{openConversation.isPending && <ButtonLoader />}
							<ChatSVG width={16} height={16} /> Contactar a
							Caxinda
						</button>
						{isAuthenticated && (
							<WishlistToggle
								adId={ad.id}
								saved={wishlistSaved ?? false}
							/>
						)}
						<p className="text-xs leading-relaxed text-ink/40">
							Anúncio gerido pela Caxinda. A equipa de apoio
							responde às tuas mensagens sobre este anúncio.
						</p>
					</div>

					<div className="card p-5">
						<ReportForm
							targetType="AD"
							targetId={ad.id}
							targetLabel={ad.title}
						/>
					</div>
				</aside>
			</div>

			<ReviewSection target={{ adId: ad.id }} />
			<Lightbox
				images={adImages}
				index={lightboxIndex}
				onClose={() => setLightboxIndex(null)}
			/>
		</div>
	);
}

// ================= Favorito =================

function WishlistToggle({ adId, saved }: { adId: string; saved: boolean }) {
	const add = useAddToWishlist();
	const remove = useRemoveFromWishlist();
	const [isSaved, setIsSaved] = useState(saved);

	const toggle = () => {
		const next = !isSaved;
		setIsSaved(next);
		void toast.promise((next ? add : remove).mutateAsync(adId), {
			loading: next
				? 'A adicionar aos favoritos…'
				: 'A remover dos favoritos…',
			success: next
				? 'Adicionado aos favoritos.'
				: 'Removido dos favoritos.',
			error: () => {
				setIsSaved(!next);
				return 'Não foi possível guardar.';
			},
		});
	};

	return (
		<button
			type="button"
			className={isSaved ? 'btn-blue w-full' : 'btn-outline w-full'}
			onClick={toggle}
		>
			{isSaved ? '★ Guardado' : '☆ Guardar'}
		</button>
	);
}

// ================= Empresas (lista) =================

export function BusinessesPage() {
	usePageTitle('Empresas');
	const [searchParams, setSearchParams] = useSearchParams();
	const { data: categories } = useCategories('BUSINESS');
	const q = searchParams.get('q') ?? '';
	const selectedCategoryIds =
		searchParams.get('categoryIds')?.split(',').filter(Boolean) ?? [];
	const selectedProvinces =
		searchParams.get('provinces')?.split(',').filter(Boolean) ?? [];
	const sortBy = searchParams.get('sortBy') ?? 'newest';
	const page = Math.max(1, Number(searchParams.get('page')) || 1);
	const [filtersOpen, setFiltersOpen] = useState(false);

	const [draftQ, setDraftQ] = useState(q);
	const [draftCategories, setDraftCategories] =
		useState<string[]>(selectedCategoryIds);
	const [draftProvinces, setDraftProvinces] =
		useState<string[]>(selectedProvinces);

	useEffect(() => {
		setDraftQ(q);
		setDraftCategories(selectedCategoryIds);
		setDraftProvinces(selectedProvinces);
	}, [searchParams]);

	const toggleCategory = (id: string) => {
		setDraftCategories((prev) =>
			prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
		);
	};

	const toggleProvince = (id: string) => {
		setDraftProvinces((prev) =>
			prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
		);
	};

	const commit = () => {
		const next = new URLSearchParams(searchParams);
		if (draftQ) next.set('q', draftQ);
		else next.delete('q');
		if (draftCategories.length > 0)
			next.set('categoryIds', draftCategories.join(','));
		else next.delete('categoryIds');
		if (draftProvinces.length > 0)
			next.set('provinces', draftProvinces.join(','));
		else next.delete('provinces');
		next.delete('page');
		setSearchParams(next);
	};

	const clearFilters = () => {
		setDraftQ('');
		setDraftCategories([]);
		setDraftProvinces([]);
		setSearchParams(new URLSearchParams());
	};

	const setParam = (key: string, value?: string) => {
		const next = new URLSearchParams(searchParams);
		if (!value) next.delete(key);
		else next.set(key, value);
		next.delete('page');
		setSearchParams(next);
	};

	const hasActiveFilters =
		draftQ !== '' ||
		draftCategories.length > 0 ||
		draftProvinces.length > 0 ||
		sortBy !== 'newest';

	const { data, isFetching } = useBusinesses({
		page,
		limit: 12,
		q: q || undefined,
		categoryIds:
			selectedCategoryIds.length > 0
				? selectedCategoryIds.join(',')
				: undefined,
		provinces:
			selectedProvinces.length > 0
				? selectedProvinces.join(',')
				: undefined,
		sortBy: sortBy as BusinessSort,
	});

	const filtersPanel = (
		<>
			<input
				className="input"
				placeholder="Pesquisar empresas…"
				value={draftQ}
				onChange={(e) => setDraftQ(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						commit();
					}
				}}
			/>
			{(categories ?? []).length > 0 && (
				<FilterPills
					label="Categorias"
					items={(categories ?? []).map((c) => ({
						id: c.id,
						name: c.name,
						count: c.businessCount,
					}))}
					selected={draftCategories}
					onToggle={toggleCategory}
				/>
			)}
			<FilterPills
				label="Províncias"
				items={PROVINCES.map((p) => ({
					id: p,
					name: PROVINCE_LABELS[p] ?? p,
				}))}
				selected={draftProvinces}
				onToggle={toggleProvince}
			/>
			<div className="flex gap-2">
				<button
					type="button"
					onClick={commit}
					className="flex-1 rounded-xl bg-blue px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
				>
					Pesquisar
				</button>
				{hasActiveFilters && (
					<button
						type="button"
						onClick={clearFilters}
						className="flex items-center justify-center rounded-xl border-2 border-ink/15 px-3 py-2 text-xs text-ink/50 transition hover:border-red/30 hover:text-red"
						title="Limpar filtros"
					>
						✕
					</button>
				)}
			</div>
		</>
	);

	return (
		<div className="mx-auto max-w-6xl px-4 py-10">
			<div className="mb-6 flex flex-wrap items-end justify-between gap-4">
				<h1 className="font-display text-3xl font-black">Empresas</h1>
				<Link to="/auth/registar" className="btn-blue">
					Registar a minha empresa
				</Link>
			</div>

			<div className="flex gap-6 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
				<aside className="nice-scroll hidden w-64 shrink-0 flex-col gap-5 rounded-2xl border border-ink/10 bg-white p-4 lg:sticky lg:top-24 lg:flex lg:max-h-[calc(100vh-6rem)] lg:w-auto lg:overflow-y-auto lg:self-start">
					{filtersPanel}
				</aside>

				<div className="min-w-0 flex-1">
					<div className="mb-4 flex flex-wrap items-center gap-2 lg:hidden">
						<input
							className="input flex-1"
							placeholder="Pesquisar empresas…"
							value={draftQ}
							onChange={(e) => setDraftQ(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									commit();
								}
							}}
						/>
						<button
							type="button"
							onClick={() => setFiltersOpen(true)}
							className="flex shrink-0 items-center justify-center rounded-xl border-2 border-ink/15 px-3 py-2 text-xs font-bold text-ink/60 transition hover:border-ink/40"
						>
							☰ Filtros
						</button>
						<button
							type="button"
							onClick={commit}
							className="shrink-0 rounded-xl bg-blue px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
						>
							Pesquisar
						</button>
						{hasActiveFilters && (
							<button
								type="button"
								onClick={clearFilters}
								className="flex shrink-0 items-center justify-center rounded-xl border-2 border-ink/15 px-3 py-2 text-xs text-ink/50 transition hover:border-red/30 hover:text-red"
								title="Limpar filtros"
							>
								✕
							</button>
						)}
					</div>

					<div className="mb-4 flex flex-wrap items-center justify-between gap-2">
						<p className="text-sm font-medium text-ink/50">
							A mostrar{' '}
							<span className="font-bold text-ink">
								{data?.items.length ?? 0}
							</span>{' '}
							empresas de{' '}
							<span className="font-bold text-ink">
								{data?.total ?? 0}
							</span>
						</p>
						<select
							className="input max-w-[200px]"
							value={sortBy}
							onChange={(e) => setParam('sortBy', e.target.value)}
						>
							<option value="newest">Mais recentes</option>
							<option value="oldest">Mais antigas</option>
							<option value="name_asc">Nome: A → Z</option>
							<option value="name_desc">Nome: Z → A</option>
						</select>
					</div>

					{isFetching ? (
						<BusinessCardSkeletonGrid count={6} />
					) : (data?.items.length ?? 0) === 0 ? (
						<EmptyState title="Sem empresas encontradas" />
					) : (
						<>
							<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
								{(data?.items ?? []).map((b) => (
									<BusinessCard key={b.id} business={b} />
								))}
							</div>
							<Pagination
								page={page}
								totalPages={data?.totalPages ?? 1}
								basePath="/empresas"
							/>
						</>
					)}
				</div>
			</div>

			<MobileFilterDrawer
				open={filtersOpen}
				onClose={() => setFiltersOpen(false)}
			>
				{filtersPanel}
			</MobileFilterDrawer>
		</div>
	);
}

// ================= Empresa (detalhe) =================

export function BusinessDetailPage() {
	usePageTitle('Empresa');
	const { slug } = useParams();
	const { data: business, isLoading } = useBusinessBySlug(slug);
	const { user, isAuthenticated } = useSession();
	const trackClick = useTrackBusinessClick();
	const navigate = useNavigate();
	const openConversation = useOpenConversation();
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

	useEffect(() => {
		setLightboxIndex(null);
	}, [slug]);

	if (isLoading) return <BusinessDetailSkeleton />;
	if (!business)
		return (
			<EmptyState
				title="Empresa não encontrada"
				action={
					<Link to="/empresas" className="btn-blue">
						Ver empresas
					</Link>
				}
			/>
		);

	const isOwner = user?.id === business.owner.id;

	const normalizeWebsite = (url: string) =>
		url.match(/^[a-z][a-z0-9+.-]*:\/\//i) ? url : `https://${url}`;

	const businessImages = [
		business.coverUrl,
		...business.gallery.map((g) => g.url),
	].filter((u): u is string => Boolean(u));

	const contact = (channel: 'phone' | 'whatsapp' | 'email' | 'website') => {
		trackClick.mutate({ businessId: business.id, channel });
		if (channel === 'phone' && business.phone)
			window.location.href = `tel:${business.phone}`;
		if (channel === 'whatsapp' && business.whatsapp)
			window.open(
				`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`,
				'_blank',
			);
		if (channel === 'email' && business.email)
			window.location.href = `mailto:${business.email}`;
		if (channel === 'website' && business.website)
			window.open(normalizeWebsite(business.website), '_blank');
	};

	const messageBusiness = () => {
		if (!isAuthenticated) {
			void navigate('/auth/entrar', {
				state: { from: `/empresas/${business.slug}` },
			});
			return;
		}
		void toast
			.promise(
				openConversation.mutateAsync({
					type: 'BUSINESS',
					businessId: business.id,
				}),
				{
					loading: 'A abrir conversa…',
					success: 'Conversa aberta.',
					error: (err) => getApiError(err),
				},
			)
			.then((conv) => navigate(`/area/mensagens?id=${conv.id}`));
	};

	return (
		<div className="mx-auto max-w-6xl px-4 py-10">
			<nav className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-ink/50">
				<Link to="/empresas" className="font-bold hover:text-blue">
					Empresas
				</Link>
				<span className="text-xs text-kwanza">▸</span>
				<span className="truncate text-ink/80">{business.name}</span>
			</nav>
			<div className="rounded-2xl border border-ink/10 bg-white">
				<button
					type="button"
					onClick={() => setLightboxIndex(0)}
					className="relative block h-56 w-full overflow-hidden rounded-t-2xl bg-blue"
					disabled={businessImages.length === 0}
					aria-label="Ampliar fotografia de capa"
				>
					{business.coverUrl ? (
						<img
							src={business.coverUrl}
							alt={business.name}
							className="h-full w-full object-cover"
						/>
					) : (
						<div className="flex h-full items-center justify-center bg-gradient-to-br from-blue to-blue-dark font-display text-4xl font-black text-white/30">
							{business.name}
						</div>
					)}
					{businessImages.length > 1 && (
						<span className="absolute right-3 bottom-3 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[10px] font-bold text-white backdrop-blur">
							{businessImages.length} fotos
						</span>
					)}
				</button>

				<div className="px-6 pt-5 pb-2">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div className="flex items-center gap-4">
							{business.logoUrl ? (
								<img
									src={business.logoUrl}
									alt={business.name}
									className="h-20 w-20 shrink-0 rounded-2xl border border-ink/10 bg-white object-cover shadow-sm"
								/>
							) : (
								<span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-ink/10 bg-ink font-display text-xl font-black text-white shadow-sm">
									{business.name.slice(0, 2).toUpperCase()}
								</span>
							)}
							<div>
								<h1 className="text-balance font-display text-xl font-black leading-tight">
									{business.name}
								</h1>
								<p className="kicker mt-1.5 flex flex-wrap items-center gap-x-2">
									<span>{business.category.name}</span>
									<span aria-hidden>·</span>
									<span>
										{PROVINCE_LABELS[business.province] ??
											business.province}
									</span>
								</p>
							</div>
						</div>
						{business.isVerified && (
							<span className="stamp shrink-0">
								<CheckSVG width={12} height={12} /> Verificada
							</span>
						)}
					</div>
					<Divider className="mt-4" />
				</div>

				<div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_340px]">
					<div className="flex min-w-0 flex-col gap-6">
						<section className="card gap-3 p-6">
							<h2 className="kicker">Sobre</h2>
							<p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/70">
								{business.description}
							</p>
							{business.address && (
								<p className="flex items-center gap-1.5 text-sm text-ink/60">
									<PinSVG width={15} height={15} />
									{business.address}
								</p>
							)}
							<div className="flex items-center gap-2">
								<Stars value={business.averageRating} />
								<span className="text-xs text-ink/50">
									· {business.reviewCount} avaliações ·{' '}
									{business.viewCount} visualizações
								</span>
							</div>
						</section>

						{business.gallery.length > 0 && (
							<section className="card p-6">
								<h2 className="kicker">Álbum</h2>
								<div className="mt-4 grid grid-cols-2 gap-2.5 md:grid-cols-3">
									{business.gallery.map((g, idx) => (
										<button
											type="button"
											key={`${g.cloudinaryId}-${idx}`}
											onClick={() =>
												setLightboxIndex(
													business.coverUrl
														? idx + 1
														: idx,
												)
											}
											className="aspect-square w-full overflow-hidden rounded-xl"
										>
											<img
												src={g.url}
												alt={`${business.name} ${idx + 1}`}
												className="h-full w-full object-cover transition hover:scale-105"
											/>
										</button>
									))}
								</div>
							</section>
						)}
					</div>

					<aside className="lg:sticky lg:top-24 lg:self-start">
						<div className="flex flex-col gap-3">
							<div className="card gap-2 p-4">
								<h3 className="kicker mb-1">Contactos</h3>
								<Divider className="mb-3" />
								{business.phone && (
									<button
										className="btn-outline w-full justify-start"
										onClick={() => contact('phone')}
									>
										<PhoneSVG width={16} height={16} />{' '}
										Ligar
										<span className="ml-auto font-mono text-[10px] opacity-70">
											{business.phone}
										</span>
									</button>
								)}
								{business.whatsapp && (
									<button
										className="btn-outline w-full justify-start"
										onClick={() => contact('whatsapp')}
									>
										<WhatsAppSVG width={16} height={16} />{' '}
										WhatsApp
										<span className="ml-auto font-mono text-[10px] opacity-70">
											{business.whatsapp}
										</span>
									</button>
								)}
								{business.email && (
									<button
										className="btn-outline w-full justify-start"
										onClick={() => contact('email')}
									>
										<EnvelopeSVG width={16} height={16} />{' '}
										Email
										<span className="ml-auto font-mono text-[10px] opacity-70">
											{business.email}
										</span>
									</button>
								)}
								{business.website && (
									<button
										className="btn-outline w-full justify-start"
										onClick={() => contact('website')}
									>
										<GlobeSVG width={16} height={16} />{' '}
										Website
										<span className="ml-auto font-mono text-[10px] opacity-70">
											{business.website.replace(
												/^https?:\/\//,
												'',
											)}
										</span>
									</button>
								)}
							</div>
							{!isOwner && (
								<button
									type="button"
									className="btn-blue w-full"
									onClick={messageBusiness}
									disabled={openConversation.isPending}
								>
									{openConversation.isPending && (
										<ButtonLoader />
									)}
									<ChatSVG width={16} height={16} /> Mensagem
									→
								</button>
							)}
							{isOwner && (
								<Link
									to={`/area/empresas/${business.id}/editar`}
									className="btn-blue w-full"
								>
									Editar empresa
								</Link>
							)}
						</div>
					</aside>
				</div>
			</div>

			<div className="mt-8 grid gap-6 lg:grid-cols-2">
				<ReviewSection target={{ businessId: business.id }} />
			</div>

			<Lightbox
				images={businessImages}
				index={lightboxIndex}
				onClose={() => setLightboxIndex(null)}
			/>
		</div>
	);
}

// ================= Avaliações =================

function ReviewSection({
	target,
}: {
	target: { adId?: string; businessId?: string; revieweeId?: string };
}) {
	const { data } = useReviews(target);
	const { isAuthenticated } = useSession();
	const inputDisabled = !isAuthenticated;

	return (
		<section className="card p-6">
			<h2 className="kicker">Avaliações</h2>
			<Divider className="mt-1.5 mb-4" />

			{inputDisabled ? (
				<p className="mt-3 text-sm text-ink/50">
					<Link
						to="/auth/entrar"
						className="font-bold text-blue hover:underline"
					>
						Entra
					</Link>{' '}
					para avaliares.
				</p>
			) : (
				<ReviewForm target={target} />
			)}

			<div className="mt-6 flex flex-col gap-4">
				{(data?.items ?? []).length === 0 && (
					<p className="text-sm text-ink/50">Ainda sem avaliações.</p>
				)}
				{(data?.items ?? []).map((rv) => (
					<div
						key={rv.id}
						className="rounded-2xl border border-ink/10 bg-snow p-4"
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Avatar
									src={rv.reviewer.image}
									name={fullName(
										rv.reviewer.name,
										rv.reviewer.surname,
									)}
									size="sm"
								/>
								<div>
									<p className="text-sm font-bold">
										{fullName(
											rv.reviewer.name,
											rv.reviewer.surname,
										)}
									</p>
									<p className="font-mono text-[10px] text-ink/40">
										{formatDate(rv.createdAt)}
									</p>
								</div>
							</div>
							<Stars value={rv.rating} size={14} />
						</div>
						{rv.comment && (
							<p className="mt-3 text-sm text-ink/70">
								{rv.comment}
							</p>
						)}
						{rv.response && (
							<div className="mt-3 rounded-xl bg-white p-3 text-sm text-ink/60">
								<span className="font-bold">Resposta: </span>
								{rv.response}
							</div>
						)}
					</div>
				))}
			</div>
		</section>
	);
}

function ReviewForm({
	target,
}: {
	target: { adId?: string; businessId?: string; revieweeId?: string };
}) {
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState('');
	const createReview = useCreateReview();

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		if (rating === 0) {
			toast.error('Escolhe uma classificação em estrelas.');
			return;
		}
		void toast
			.promise(
				createReview.mutateAsync({
					...target,
					rating,
					comment: comment || undefined,
				}),
				{
					loading: 'A publicar avaliação…',
					success: 'Avaliação publicada.',
					error: (err) => getApiError(err),
				},
			)
			.then(() => {
				setRating(0);
				setComment('');
			});
	};

	return (
		<form
			onSubmit={submit}
			className="mt-4 rounded-2xl border border-ink/10 bg-snow p-4"
		>
			<div className="flex items-center justify-between">
				<p className="text-sm font-bold">Deixa a tua avaliação</p>
				<div className="flex" onMouseLeave={() => {}}>
					{[1, 2, 3, 4, 5].map((i) => (
						<button
							type="button"
							key={i}
							onClick={() => setRating(i)}
							aria-label={`${i} estrelas`}
						>
							<svg
								width="22"
								height="22"
								viewBox="0 0 24 24"
								className={
									i <= rating ? 'fill-kwanza' : 'fill-ink/15'
								}
							>
								<path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.4 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
							</svg>
						</button>
					))}
				</div>
			</div>
			<textarea
				className="input mt-3 min-h-20"
				placeholder="O que tens a dizer?"
				value={comment}
				onChange={(e) => setComment(e.target.value)}
			/>
			<button
				className="btn-primary mt-3"
				disabled={createReview.isPending}
			>
				{createReview.isPending && <ButtonLoader />} Publicar avaliação
			</button>
		</form>
	);
}

// ================= Denunciar =================

export function ReportForm({
	targetType,
	targetId,
	targetLabel,
}: {
	targetType: ReportTarget;
	targetId: string;
	targetLabel: string;
}) {
	const [open, setOpen] = useState(false);
	const [reason, setReason] = useState<ReportReason>('OTHER');
	const [description, setDescription] = useState('');
	const createReport = useCreateReport();

	if (!open) {
		return (
			<button
				className="btn-ghost w-full text-red"
				onClick={() => setOpen(true)}
			>
				⚑ Denunciar
			</button>
		);
	}

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		void toast
			.promise(
				createReport.mutateAsync({
					targetType,
					targetId,
					reason,
					description: description || undefined,
				}),
				{
					loading: 'A enviar denúncia…',
					success: 'Denúncia enviada. Obrigado.',
					error: (err) => getApiError(err),
				},
			)
			.then(() => {
				setOpen(false);
				setDescription('');
			});
	};

	return (
		<form onSubmit={submit} className="flex flex-col gap-3">
			<h3 className="kicker">Denunciar {targetLabel}</h3>
			<select
				className="input"
				value={reason}
				onChange={(e) => setReason(e.target.value as ReportReason)}
			>
				{REPORT_REASONS.map((r) => (
					<option key={r} value={r}>
						{r.replace('_', ' ')}
					</option>
				))}
			</select>
			<textarea
				className="input min-h-20"
				placeholder="Detalha o motivo…"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>
			<div className="flex gap-2">
				<button
					className="btn-primary"
					disabled={createReport.isPending}
				>
					{createReport.isPending && <ButtonLoader />} Enviar denúncia
				</button>
				<button
					type="button"
					className="btn-ghost"
					onClick={() => setOpen(false)}
				>
					Cancelar
				</button>
			</div>
		</form>
	);
}

// ================= Busca =================

const SEARCH_TYPES: { id: string; label: string; type?: SearchType }[] = [
	{ id: 'todos', label: 'Todos' },
	{ id: 'ads', label: 'Anúncios', type: 'AD' },
	{ id: 'businesses', label: 'Empresas', type: 'BUSINESS' },
];

export function SearchPage() {
	usePageTitle('Pesquisa');
	const [searchParams, setSearchParams] = useSearchParams();
	const q = searchParams.get('q') ?? '';
	const typeParam = searchParams.get('type');
	const type: SearchType | null =
		typeParam === 'AD' || typeParam === 'BUSINESS' ? typeParam : null;
	const categoryId = searchParams.get('categoryId') ?? undefined;
	const selectedProvinces =
		searchParams.get('provinces')?.split(',').filter(Boolean) ?? [];
	const rawSort = searchParams.get('sortBy');
	const sortBy: SearchSort =
		rawSort === 'newest' || rawSort === 'oldest' ? rawSort : 'relevance';
	const { data: adCategories = [] } = useCategories('AD');
	const { data: bizCategories = [] } = useCategories('BUSINESS');
	const categoryOptions = [...adCategories, ...bizCategories];

	const [localQ, setLocalQ] = useState(q);
	const [draftType, setDraftType] = useState<SearchType | null>(type);
	const [draftCategoryId, setDraftCategoryId] = useState<string | undefined>(
		categoryId,
	);
	const [draftProvinces, setDraftProvinces] =
		useState<string[]>(selectedProvinces);
	const [filtersOpen, setFiltersOpen] = useState(false);

	useEffect(() => {
		setLocalQ(q);
		setDraftType(type);
		setDraftCategoryId(categoryId);
		setDraftProvinces(selectedProvinces);
	}, [searchParams]);

	const { data, isFetching } = useGlobalSearch({
		q,
		type: type ?? undefined,
		categoryId,
		provinces: selectedProvinces.length > 0 ? selectedProvinces : undefined,
		sortBy,
		page: 1,
		limit: 20,
	});
	const draftActiveType =
		SEARCH_TYPES.find((t) => t.type === draftType)?.id ?? 'todos';

	const setParam = (key: string, value?: string) => {
		const next = new URLSearchParams(searchParams);
		if (!value || value === 'todos') {
			next.delete(key);
		} else {
			next.set(key, value);
		}
		setSearchParams(next);
	};

	const toggleProvince = (id: string) => {
		setDraftProvinces((prev) =>
			prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
		);
	};

	const commit = () => {
		const next = new URLSearchParams(searchParams);
		if (localQ) next.set('q', localQ);
		else next.delete('q');
		if (draftType) next.set('type', draftType);
		else next.delete('type');
		if (draftCategoryId) next.set('categoryId', draftCategoryId);
		else next.delete('categoryId');
		if (draftProvinces.length > 0)
			next.set('provinces', draftProvinces.join(','));
		else next.delete('provinces');
		setSearchParams(next);
	};

	const clearFilters = () => {
		setLocalQ('');
		setDraftType(null);
		setDraftCategoryId(undefined);
		setDraftProvinces([]);
		setSearchParams(new URLSearchParams());
	};

	const hasActiveFilters =
		localQ !== '' ||
		draftType !== null ||
		draftCategoryId !== undefined ||
		draftProvinces.length > 0 ||
		sortBy !== 'relevance';

	const filtersPanel = (
		<>
			<div>
				<p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/50">
					Tipo
				</p>
				<div className="flex flex-wrap gap-1.5">
					{SEARCH_TYPES.map((t) => (
						<button
							key={t.id}
							type="button"
							onClick={() => setDraftType(t.type ?? null)}
							className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
								draftActiveType === t.id
									? 'bg-ink text-white'
									: 'bg-ink/5 text-ink/70 hover:bg-ink/10'
							}`}
						>
							{t.label}
						</button>
					))}
				</div>
			</div>

			{draftType !== 'BUSINESS' &&
				(categoryOptions.length > 0 || adCategories.length > 0) && (
					<FilterPills
						label="Categorias"
						items={categoryOptions.map((c) => ({
							id: c.id,
							name: c.name,
						}))}
						selected={draftCategoryId ? [draftCategoryId] : []}
						onToggle={(id) =>
							setDraftCategoryId(
								draftCategoryId === id ? undefined : id,
							)
						}
					/>
				)}

			<FilterPills
				label="Províncias"
				items={PROVINCES.map((p) => ({
					id: p,
					name: PROVINCE_LABELS[p] ?? p,
				}))}
				selected={draftProvinces}
				onToggle={toggleProvince}
			/>

			<div className="flex gap-2">
				<button
					type="button"
					onClick={commit}
					className="flex-1 rounded-xl bg-blue px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
				>
					Pesquisar
				</button>
				{hasActiveFilters && (
					<button
						type="button"
						onClick={clearFilters}
						className="flex items-center justify-center rounded-xl border-2 border-ink/15 px-3 py-2 text-xs text-ink/50 transition hover:border-red/30 hover:text-red"
						title="Limpar filtros"
					>
						✕
					</button>
				)}
			</div>
		</>
	);

	return (
		<div className="mx-auto max-w-6xl px-4 py-10">
			<h1 className="font-display text-3xl font-black">Pesquisa</h1>
			<form
				className="mt-4 flex gap-2"
				onSubmit={(e) => {
					e.preventDefault();
					commit();
				}}
			>
				<input
					className="input"
					placeholder="O que procuras hoje?"
					value={localQ}
					onChange={(e) => setLocalQ(e.target.value)}
				/>
				<button className="btn-primary">Buscar</button>
			</form>

			<div className="mt-8 flex flex-col gap-6 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
				<aside className="nice-scroll hidden w-64 shrink-0 flex-col gap-5 rounded-2xl border border-ink/10 bg-white p-4 lg:sticky lg:top-24 lg:flex lg:max-h-[calc(100vh-6rem)] lg:w-auto lg:overflow-y-auto lg:self-start">
					{filtersPanel}
				</aside>

				<div className="min-w-0 flex-1">
					<div className="mb-4 flex flex-wrap items-center gap-2 lg:hidden">
						<input
							className="input flex-1"
							placeholder="O que procuras hoje?"
							value={localQ}
							onChange={(e) => setLocalQ(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									commit();
								}
							}}
						/>
						<button
							type="button"
							onClick={() => setFiltersOpen(true)}
							className="flex shrink-0 items-center justify-center rounded-xl border-2 border-ink/15 px-3 py-2 text-xs font-bold text-ink/60 transition hover:border-ink/40"
						>
							☰ Filtros
						</button>
						<button
							type="button"
							onClick={commit}
							className="shrink-0 rounded-xl bg-blue px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
						>
							Pesquisar
						</button>
						{hasActiveFilters && (
							<button
								type="button"
								onClick={clearFilters}
								className="flex shrink-0 items-center justify-center rounded-xl border-2 border-ink/15 px-3 py-2 text-xs text-ink/50 transition hover:border-red/30 hover:text-red"
								title="Limpar filtros"
							>
								✕
							</button>
						)}
					</div>

					{isFetching ? (
						<div className="flex flex-col gap-3" aria-hidden>
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="card flex gap-4 p-4">
									<Skeleton className="h-24 w-32 shrink-0 rounded-xl md:h-28 md:w-40" />
									<div className="min-w-0 flex-1 space-y-2 py-1">
										<Skeleton className="h-4 w-1/2 rounded" />
										<Skeleton className="h-3 w-1/3 rounded" />
										<Skeleton className="h-3 w-full rounded" />
										<div className="flex items-center justify-between gap-2 pt-1">
											<Skeleton className="h-7 w-24 rounded-md bg-kwanza/25" />
											<Skeleton className="h-3 w-16 rounded" />
										</div>
									</div>
								</div>
							))}
						</div>
					) : q ? (
						<>
							<div className="mb-4 flex flex-wrap items-center justify-between gap-2">
								<p className="text-sm text-ink/50">
									{data?.total ?? 0} resultado(s) para «
									<b>{q}</b>»
								</p>
								<select
									className="input max-w-[200px]"
									value={sortBy}
									onChange={(e) =>
										setParam('sortBy', e.target.value)
									}
								>
									<option value="relevance">
										Relevância
									</option>
									<option value="newest">
										Mais recentes
									</option>
									<option value="oldest">Mais antigos</option>
								</select>
							</div>
							{(data?.items ?? []).length === 0 && (
								<EmptyState
									title="Nada encontrado"
									description="Tenta outra palavra ou remove alguns filtros."
								/>
							)}
							<div className="grid gap-3">
								{(data?.items ?? []).map((item: SearchItem) => {
									if (item.type === 'AD')
										return (
											<AdCard key={item.id} ad={item} />
										);
									return (
										<BusinessCard
											key={item.id}
											business={item}
										/>
									);
								})}
							</div>
						</>
					) : (
						<p className="text-sm text-ink/50">
							Digita um termo para pesquisar anúncios e empresas.
						</p>
					)}
				</div>
			</div>

			<MobileFilterDrawer
				open={filtersOpen}
				onClose={() => setFiltersOpen(false)}
			>
				{filtersPanel}
			</MobileFilterDrawer>
		</div>
	);
}

// ================= Planos =================

export function PlansPage() {
	usePageTitle('Planos');
	const { data, isLoading } = usePlans();
	const [searchParams] = useSearchParams();
	const businessId = searchParams.get('business') ?? undefined;
	const plans = data?.plans ?? [];
	const recommendedId = plans.length >= 2 ? plans[1].id : plans[0]?.id;

	return (
		<>
			<section className="relative overflow-hidden bg-ink text-snow">
				<div className="mx-auto flex max-w-6xl items-stretch px-4 py-14 md:py-16">
					<div className="flex-1 text-center">
						<span
							className="inline-block bg-kwanza px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-ink"
							style={{
								clipPath:
									'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
							}}
						>
							Planos
						</span>
						<h1 className="mt-3 font-display text-3xl font-black md:text-4xl">
							Paga pouco, vende muito.
						</h1>
						<p className="mx-auto mt-2 max-w-2xl text-snow/70">
							Escolhe o plano certo e mostra o teu negócio num
							instante. O pagamento é confirmado pelos nossos
							moderadores.
						</p>
					</div>
					<div
						className="hidden items-center pl-10 md:flex"
						aria-hidden
					>
						<span className="price-tag text-2xl">AO</span>
					</div>
				</div>
			</section>

			<div className="mx-auto max-w-6xl px-4 py-12">
				{isLoading ? (
					<div className="grid gap-5 md:grid-cols-3" aria-hidden>
						{[0, 1, 2].map((i) => (
							<div
								key={i}
								className="overflow-hidden rounded-2xl border border-ink/10 bg-white"
							>
								<div className="bg-ink p-6">
									<Skeleton className="h-6 w-28 rounded-full bg-snow/20" />
									<Skeleton className="mt-2 h-4 w-40 rounded bg-snow/10" />
								</div>
								<div className="p-6">
									<Skeleton className="h-24 w-full rounded-xl bg-kwanza/20" />
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="grid gap-5 md:grid-cols-3">
						{plans.map((plan) => {
							const isRec = plan.id === recommendedId;
							return (
								<div
									key={plan.id}
									className={`kwanza-glow overflow-hidden border ${
										isRec
											? 'border-kwanza'
											: 'border-ink/10'
									} rounded-2xl bg-white`}
									style={{ padding: 0 }}
								>
									{isRec && (
										<div
											className="bg-kwanza px-4 py-1.5 font-mono text-xs font-bold text-ink"
											style={{
												clipPath:
													'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
												paddingRight: '20px',
											}}
										>
											★ Recomendado
										</div>
									)}
									<div className="bg-ink p-6 text-snow">
										<h2 className="font-display text-lg font-black">
											{plan.name}
										</h2>
										<p className="mt-1 text-sm text-snow/60">
											{plan.description}
										</p>
										<div className="mt-4 flex items-baseline gap-1">
											<span className="price-tag !bg-kwanza !text-ink">
												{formatKz(plan.price)}
											</span>
											<span className="font-mono text-xs text-snow/50">
												/ {plan.durationDays} dias
											</span>
										</div>
									</div>
									<ul className="flex flex-1 flex-col gap-2 p-6 text-sm">
										{(plan.benefits ?? []).map((b) => (
											<li
												key={b}
												className="flex items-center gap-2"
											>
												<span className="text-kwanza">
													✔
												</span>{' '}
												{b}
											</li>
										))}
										<li className="flex items-center gap-2">
											<span className="text-kwanza">
												✔
											</span>{' '}
											Até {plan.businessVisibilityLimit}{' '}
											empresas em destaque
										</li>
										<li className="flex items-center gap-2">
											<span className="text-kwanza">
												✔
											</span>{' '}
											Até {plan.featuredAdsLimit} anúncios
											em destaque
										</li>
									</ul>
									<div className="p-6 pt-0">
										<Link
											to={
												businessId
													? `/area/empresas/${businessId}/subscricao?plan=${plan.id}`
													: '/area'
											}
											className={`w-full ${
												isRec
													? 'btn-primary'
													: 'btn-outline'
											}`}
											style={
												isRec
													? {
															background:
																'var(--color-red)',
														}
													: undefined
											}
										>
											Quero este plano
										</Link>
									</div>
								</div>
							);
						})}
					</div>
				)}

				<div className="mt-12 rounded-2xl border border-ink/10 bg-white p-6">
					<h3 className="font-display text-lg font-black">
						Transferências bancárias
					</h3>
					<p className="mt-1 text-sm text-ink/60">
						Faz a transferência para uma das contas abaixo e envia o
						comprovativo na área pessoal. O plano é ativado após
						verificação.
					</p>
					<div className="mt-4 flex flex-wrap gap-3">
						{(data?.platformAccounts ?? []).map((acc, i) => (
							<div
								key={i}
								className="flex-1 min-w-[240px] rounded-xl bg-snow p-4 font-mono text-xs"
							>
								<p className="font-bold text-blue">
									{acc.bankName}
								</p>
								<p>{acc.bankHolder}</p>
								<p className="text-ink/70">{acc.bankIban}</p>
							</div>
						))}
					</div>
				</div>

				<div className="mt-10 mx-auto max-w-2xl space-y-3">
					<h2 className="font-display text-xl font-black text-center">
						Perguntas frequentes
					</h2>
					<div className="space-y-2 text-sm text-ink/70">
						<div className="rounded-xl bg-white border border-ink/10 p-4">
							<p className="font-bold text-ink">
								Como funciona o pagamento?
							</p>
							<p className="mt-1">
								Escolhes o plano, fazes a transferência para uma
								das contas e envias o comprovativo. A equipa
								verifica e ativa o plano em até 1 dia útil.
							</p>
						</div>
						<div className="rounded-xl bg-white border border-ink/10 p-4">
							<p className="font-bold text-ink">
								Posso mudar de plano depois?
							</p>
							<p className="mt-1">
								Sim. Ao subscrever um novo plano, podes escolher
								pagamento proporcional ao tempo restante do
								anterior.
							</p>
						</div>
						<div className="rounded-xl bg-white border border-ink/10 p-4">
							<p className="font-bold text-ink">
								O que acontece se o plano expirar?
							</p>
							<p className="mt-1">
								O teu negócio continua visível, mas perde os
								benefícios de destaque. Podes renovar ou
								subscrever outro plano a qualquer momento.
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

// ================= 404 =================

export function NotFoundPage() {
	usePageTitle('Não encontrado');
	return (
		<div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-4 text-center">
			<p className="font-mono text-6xl font-black text-red">404</p>
			<h1 className="mt-4 font-display text-2xl font-black">
				Ninguém está deste lado.
			</h1>
			<p className="mt-2 text-ink/60">
				A página que procuras não existe ou foi movida.
			</p>
			<div className="mt-6 flex gap-3">
				<Link to="/" className="btn-primary">
					Ir para o início
				</Link>
				<Link to="/anuncios" className="btn-outline">
					Ver anúncios
				</Link>
			</div>
		</div>
	);
}
