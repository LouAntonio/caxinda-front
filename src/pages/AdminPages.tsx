import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { usePageTitle } from '../hooks/usePageTitle';
import { useUpload } from '../hooks/useUpload';
import {
	useAdminConversations,
	useAdminKycList,
	useAdminPayments,
	useAdminReports,
	useAdminUsers,
	useAdminUser,
	useAdminAds,
	useBusinesses,
	useCategories,
	useAdminPlans,
	usePlatformAnalytics,
	usePlatformAccounts,
} from '../hooks/queries';
import {
	useBanUser,
	useCancelPayment,
	useCreateAd,
	useCreateCategory,
	useCreatePlan,
	useCreatePlatformAccount,
	useDeleteCategory,
	useDeletePlan,
	useDeletePlatformAccount,
	useModerateAd,
	useModerateBusiness,
	useModerateReport,
	useReviewKyc,
	useReviewPayment,
	useSetUserRole,
	useUnbanUser,
	useUpdateCategory,
	useUpdatePlatformAccount,
	useUpdatePlan,
	useClaimConversation,
	useReleaseConversation,
	useResolveConversation,
	useUnfeatureAd,
	useFeatureAd,
	type PlanInput,
	type PlatformAccountInput,
} from '../hooks/mutations';
import { Spinner } from '../components/ui/Spinner';
import { FormSkeleton } from '../components/skeletons/FormSkeletons';
import { TableSkeleton } from '../components/skeletons/SkeletonsTables';
import { EmptyState } from '../components/ui/EmptyState';
import { StatusPill } from '../components/ui/StatusPill';
import { Stars } from '../components/ui/Stars';
import { Avatar } from '../components/ui/Avatar';
import { ConfirmButton } from '../components/ui/ConfirmButton';
import { Price } from '../components/ui/Price';
import { getApiError } from '../lib/api';
import {
	formatDate,
	formatDecimal,
	formatKz,
	fullName,
	PROVINCE_LABELS,
} from '../lib/format';
import type {
	CategoryType,
	PlatformBankAccount,
	Plan,
	Role,
	MediaAsset,
	Province,
} from '../types/api';
import { PROVINCES } from '../types/api';

function Title({ children }: { children: React.ReactNode }) {
	return (
		<h1 className="mb-6 font-display text-2xl font-black">{children}</h1>
	);
}

// ================= Dashboard =================

export function AdminDashboardPage() {
	usePageTitle('Administração');
	const { data: analytics } = usePlatformAnalytics('30d');
	const { data: reports } = useAdminReports({ status: 'PENDING', limit: 5 });
	const { data: kycs } = useAdminKycList({ status: 'PENDING', limit: 5 });
	const { data: payments } = useAdminPayments({
		status: 'PENDING',
		limit: 5,
	});

	return (
		<div>
			<Title>Dashboard</Title>
			<div className="grid gap-4 sm:grid-cols-3">
				<div className="card p-5">
					<p className="font-mono text-3xl font-bold text-blue">
						{analytics?.totals.views ?? '—'}
					</p>
					<p className="mt-1 text-sm font-bold text-ink/60">
						Visualizações (30d)
					</p>
				</div>
				<div className="card p-5">
					<p className="font-mono text-3xl font-bold text-red">
						{analytics?.totals.clicks ?? '—'}
					</p>
					<p className="mt-1 text-sm font-bold text-ink/60">
						Cliques (30d)
					</p>
				</div>
				<div className="card p-5">
					<p className="font-mono text-3xl font-bold text-kwanza">
						{(reports?.items ?? []).length +
							(kycs?.items ?? []).length +
							(payments?.items ?? []).length}
					</p>
					<p className="mt-1 text-sm font-bold text-ink/60">
						Aguarda moderação
					</p>
				</div>
			</div>

			<div className="mt-6 grid gap-4 md:grid-cols-3">
				<QueueCard
					title="Denúncias pendentes"
					count={reports?.total ?? 0}
					to="/admin/denuncias"
				>
					{(reports?.items ?? []).map((r) => (
						<Row
							key={r.id}
							label={r.targetLabel ?? r.reason}
							sub={r.reason}
							status={<StatusPill status={r.status} />}
						/>
					))}
				</QueueCard>
				<QueueCard
					title="KYC pendentes"
					count={kycs?.total ?? 0}
					to="/admin/kyc"
				>
					{(kycs?.items ?? []).map((k) => (
						<Row
							key={k.id}
							label={fullName(k.user.name, k.user.surname)}
							sub={k.user.email}
							status={<StatusPill status={k.status} />}
						/>
					))}
				</QueueCard>
				<QueueCard
					title="Pagamentos pendentes"
					count={payments?.total ?? 0}
					to="/admin/pagamentos"
				>
					{(payments?.items ?? []).map((p) => (
						<Row
							key={p.id}
							label={p.subscription.business.name}
							sub={formatKz(p.amount)}
							status={<StatusPill status={p.status} />}
						/>
					))}
				</QueueCard>
			</div>

			<div className="card mt-6 p-6">
				<h2 className="mb-4 font-display text-sm font-black">
					Ações rápidas
				</h2>
				<div className="flex flex-wrap gap-2">
					<Link to="/admin/anuncios" className="btn-outline">
						Moderar anúncios
					</Link>
					<Link to="/admin/empresas" className="btn-outline">
						Verificar empresas
					</Link>
					<Link to="/admin/utilizadores" className="btn-outline">
						Gerir utilizadores
					</Link>
					<Link to="/admin/categorias" className="btn-outline">
						Categorias
					</Link>
					{/* Gestão de planos */}
					<Link to="/admin/planos" className="btn-outline">
						Gerir planos
					</Link>
				</div>
			</div>
		</div>
	);
}

function QueueCard({
	title,
	count,
	to,
	children,
}: {
	title: string;
	count: number;
	to: string;
	children: React.ReactNode;
}) {
	return (
		<div className="card flex flex-col gap-2 p-5">
			<div className="flex items-center justify-between">
				<h2 className="font-display text-sm font-black">{title}</h2>
				<span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red px-2 font-mono text-xs font-bold text-white">
					{count}
				</span>
			</div>
			{children}
			<Link
				to={to}
				className="mt-auto text-xs font-bold text-blue hover:underline"
			>
				Ver tudo →
			</Link>
		</div>
	);
}

function Row({
	label,
	sub,
	status,
}: {
	label: string;
	sub: string;
	status?: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-2 rounded-xl bg-snow px-3 py-2">
			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-bold">{label}</p>
				<p className="truncate text-xs text-ink/50">{sub}</p>
			</div>
			{status}
		</div>
	);
}

// ================= Anúncios =================

export function AdminAdsPage() {
	usePageTitle('Gerir anúncios');
	const [q, setQ] = useState('');
	const { data, isLoading } = useAdminAds(
		q ? { q, limit: 25 } : { limit: 25 },
	);

	return (
		<div>
			<div className="flex items-center justify-between">
				<Title>Moderação de anúncios</Title>
				<Link to="/admin/anuncios/novo" className="btn-primary">
					+ Novo anúncio
				</Link>
			</div>
			<input
				className="input mb-4 max-w-sm"
				placeholder="Pesquisar anúncios…"
				value={q}
				onChange={(e) => setQ(e.target.value)}
			/>
			{isLoading ? (
				<TableSkeleton />
			) : !data || data.items.length === 0 ? (
				<EmptyState title="Sem anúncios" />
			) : (
				<div className="flex flex-col gap-3">
					{(data?.items ?? []).map((ad) => (
						<div
							key={ad.id}
							className="card items-center gap-3 p-3 sm:flex-row"
						>
							{ad.image && (
								<img
									src={ad.image}
									alt=""
									className="h-16 w-20 rounded-lg object-cover"
								/>
							)}
							<div className="min-w-0 flex-1">
								<Link
									to={`/anuncios/${ad.slug}`}
									className="line-clamp-1 text-sm font-bold hover:text-red"
								>
									{ad.title}
								</Link>
								<p className="text-xs text-ink/50">
									{fullName(ad.user?.name, ad.user?.surname)}{' '}
									· {formatDate(ad.createdAt)}
								</p>
								<div className="mt-1 flex items-center gap-2 text-xs">
									<Price value={ad.price} />
									<StatusPill status={ad.status} />
									<StatusPill status={ad.visibility} />
									{ad.verified && (
										<span className="font-bold text-blue">
											✔ verificado
										</span>
									)}
								</div>
							</div>
							<AdModerateActions ad={ad} />
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function AdModerateActions({
	ad,
}: {
	ad: { id: string; status: string; verified: boolean; visibility: string };
}) {
	const moderate = useModerateAd();
	const feature = useFeatureAd();
	const unfeature = useUnfeatureAd();

	const act = (payload: {
		id: string;
		verified?: boolean;
		status?: 'ACTIVE' | 'REJECTED';
	}) =>
		void toast.promise(moderate.mutateAsync(payload), {
			loading: 'A moderar anúncio…',
			success: 'Anúncio atualizado.',
			error: (err) => getApiError(err),
		});

	return (
		<div className="flex flex-wrap gap-1.5">
			{!ad.verified && (
				<button
					className="btn-blue"
					onClick={() => act({ id: ad.id, verified: true })}
				>
					Verificar
				</button>
			)}
			<button
				className="btn-ghost"
				onClick={() =>
					act({
						id: ad.id,
						status: ad.status === 'ACTIVE' ? 'REJECTED' : 'ACTIVE',
					})
				}
			>
				{ad.status === 'ACTIVE' ? 'Rejeitar' : 'Reativar'}
			</button>
			<button
				className="btn-ghost"
				onClick={() =>
					void toast.promise(
						(ad.visibility === 'VISIBLE'
							? unfeature
							: feature
						).mutateAsync(ad.id),
						{
							loading: 'A alterar destaque…',
							success: 'Feito.',
							error: (err) => getApiError(err),
						},
					)
				}
			>
				{ad.visibility === 'VISIBLE' ? 'Destaque' : 'Retirar destaque'}
			</button>
		</div>
	);
}

// ================= Anúncio (criar) =================

export function AdminAdFormPage() {
	usePageTitle('Novo anúncio');
	const { data: categories } = useCategories('AD');
	const createAd = useCreateAd();
	const navigate = useNavigate();
	const upload = useUpload('ads');

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [categoryId, setCategoryId] = useState('');
	const [province, setProvince] = useState<Province | ''>('');
	const [image, setImage] = useState<MediaAsset | null>(null);
	const [gallery, setGallery] = useState<MediaAsset[]>([]);
	const [pendingImage, setPendingImage] = useState<File | null>(null);
	const [pendingGallery, setPendingGallery] = useState<File[]>([]);

	const onFile = (file: File, target: 'main' | 'gallery') => {
		const preview = URL.createObjectURL(file);
		if (target === 'main') {
			setPendingImage(file);
			setImage({ url: preview, cloudinaryId: 'pending' });
		} else {
			setPendingGallery((g) => [...g, file]);
			setGallery((g) => [
				...g,
				{ url: preview, cloudinaryId: 'pending' },
			]);
		}
	};

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!categoryId) {
			toast.error('Escolhe uma categoria.');
			return;
		}
		try {
			let imageAsset = image;
			let galleryAssets = gallery;

			if (pendingImage) {
				imageAsset = await upload.mutateAsync(pendingImage);
				setImage(imageAsset);
				setPendingImage(null);
			}
			if (pendingGallery.length > 0) {
				galleryAssets = await Promise.all(
					pendingGallery.map((f) => upload.mutateAsync(f)),
				);
				setGallery((g) => [
					...g.filter((item) => item.cloudinaryId !== 'pending'),
					...galleryAssets,
				]);
				setPendingGallery([]);
			}

			const payload = {
				title,
				description,
				price: price ? Number(price) : undefined,
				categoryIds: [categoryId],
				...(province ? { province } : {}),
				...(imageAsset
					? {
							image: imageAsset.url,
							imageId: imageAsset.cloudinaryId,
						}
					: {}),
				...(galleryAssets.length ? { gallery: galleryAssets } : {}),
			};
			await toast.promise(createAd.mutateAsync(payload), {
				loading: 'A publicar…',
				success: 'Anúncio publicado.',
				error: (err) => getApiError(err),
			});
			void navigate('/admin/anuncios');
		} catch {
			// error handled by toast.promise
		}
	};

	return (
		<div>
			<Title>Novo anúncio</Title>
			<form onSubmit={submit} className="card max-w-2xl gap-4 p-6">
				<div>
					<label className="label">Título *</label>
					<input
						className="input"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
						maxLength={140}
					/>
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<label className="label">Preço (Kz)</label>
						<input
							className="input"
							type="number"
							min={0}
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							placeholder="0"
						/>
					</div>
					<div>
						<label className="label">Categoria *</label>
						<select
							className="input"
							value={categoryId}
							onChange={(e) => setCategoryId(e.target.value)}
							required
						>
							<option value="">Escolhe…</option>
							{(categories ?? []).map((c) => (
								<option key={c.id} value={c.id}>
									{c.name}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<label className="label">Província</label>
						<select
							className="input"
							value={province}
							onChange={(e) =>
								setProvince(e.target.value as Province | '')
							}
						>
							<option value="">Todas / Indefinida</option>
							{PROVINCES.map((p: Province) => (
								<option key={p} value={p}>
									{PROVINCE_LABELS[p] ?? p}
								</option>
							))}
						</select>
					</div>
					<div className="hidden sm:block" />
				</div>
				<div>
					<label className="label">Descrição *</label>
					<textarea
						className="input min-h-32"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
						maxLength={5000}
					/>
				</div>

				<div>
					<label className="label">Imagem principal</label>
					{image ? (
						<div className="relative inline-block">
							<img
								src={image.url}
								alt="Principal"
								className="h-40 w-52 rounded-xl object-cover"
							/>
							<button
								type="button"
								onClick={() => {
									setImage(null);
									setPendingImage(null);
								}}
								className="btn-ghost absolute -top-2 -right-2 !bg-white !text-red"
							>
								✕
							</button>
						</div>
					) : (
						<div>
							<input
								type="file"
								accept="image/*"
								className="hidden"
								id="admin-ad-image"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) onFile(file, 'main');
									e.target.value = '';
								}}
							/>
							<label
								htmlFor="admin-ad-image"
								className="btn-outline cursor-pointer"
							>
								⬆ Enviar imagem
							</label>
						</div>
					)}
				</div>

				<div>
					<label className="label">Galeria (até 4)</label>
					<div className="flex flex-wrap gap-2">
						{gallery.map((g, idx) => (
							<div
								key={`${g.cloudinaryId}-${idx}`}
								className="relative inline-block"
							>
								<img
									src={g.url}
									alt=""
									className="h-20 w-24 rounded-lg object-cover"
								/>
								<button
									type="button"
									onClick={() => {
										setGallery((gal) =>
											gal.filter((_, i) => i !== idx),
										);
										setPendingGallery((pg) =>
											pg.filter((_, i) => i !== idx),
										);
									}}
									className="btn-ghost absolute -top-2 -right-2 !bg-white !text-red"
								>
									✕
								</button>
							</div>
						))}
						{gallery.length < 4 && (
							<div>
								<input
									type="file"
									accept="image/*"
									multiple
									className="hidden"
									id="admin-ad-gallery"
									onChange={(e) => {
										const files = Array.from(
											e.target.files ?? [],
										);
										files.forEach((f) =>
											onFile(f, 'gallery'),
										);
										e.target.value = '';
									}}
								/>
								<label
									htmlFor="admin-ad-gallery"
									className="btn-outline cursor-pointer"
								>
									⬆ Enviar imagem
								</label>
							</div>
						)}
					</div>
				</div>

				<div className="flex gap-2 pt-2">
					<button
						className="btn-primary"
						disabled={createAd.isPending}
					>
						{createAd.isPending && (
							<span className="ml-2">A guardar…</span>
						)}
						Publicar anúncio
					</button>
					<Link to="/admin/anuncios" className="btn-ghost">
						Cancelar
					</Link>
				</div>
			</form>
		</div>
	);
}

// ================= Empresas =================

export function AdminBusinessesPage() {
	usePageTitle('Gerir empresas');
	const { data, isLoading } = useBusinesses({ page: 1, limit: 50 });
	const moderate = useModerateBusiness();
	return (
		<div>
			<Title>Verificação de empresas</Title>
			{isLoading ? (
				<TableSkeleton />
			) : !data || (data.items ?? []).length === 0 ? (
				<EmptyState title="Sem empresas" />
			) : (
				<div className="flex flex-col gap-3">
					{(data.items ?? []).map((b) => (
						<div
							key={b.id}
							className="card items-center gap-3 p-3 sm:flex-row"
						>
							{b.logoUrl && (
								<img
									src={b.logoUrl}
									alt=""
									className="h-14 w-14 rounded-lg object-cover"
								/>
							)}
							<div className="min-w-0 flex-1">
								<Link
									to={`/empresas/${b.slug}`}
									className="line-clamp-1 text-sm font-bold hover:text-blue"
								>
									{b.name}
								</Link>
								<p className="text-xs text-ink/50">
									{b.category.name} ·{' '}
									{fullName(b.owner.name, b.owner.surname)}
								</p>
								<div className="mt-1 flex items-center gap-2 text-xs">
									<Stars value={b.averageRating} size={12} />
									<StatusPill status={b.status} />
									{b.isVerified && (
										<span className="font-bold text-blue">
											✔
										</span>
									)}
								</div>
							</div>
							<div className="flex flex-wrap gap-1.5">
								{!b.isVerified && (
									<button
										className="btn-blue"
										onClick={() =>
											void toast.promise(
												moderate.mutateAsync({
													id: b.id,
													isVerified: true,
												}),
												{
													loading:
														'A verificar empresa…',
													success:
														'Empresa verificada.',
													error: (err) =>
														getApiError(err),
												},
											)
										}
									>
										Verificar
									</button>
								)}
								<button
									className="btn-ghost"
									onClick={() =>
										void toast.promise(
											moderate.mutateAsync({
												id: b.id,
												status:
													b.status === 'SHOW'
														? 'HIDE'
														: 'SHOW',
											}),
											{
												loading: 'A alterar estado…',
												success: 'Estado alterado.',
												error: (err) =>
													getApiError(err),
											},
										)
									}
								>
									{b.status === 'SHOW'
										? 'Ocultar'
										: 'Mostrar'}
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

// ================= Utilizadores =================

export function AdminUsersPage() {
	usePageTitle('Gerir utilizadores');
	const [searchValue, setSearchValue] = useState('');
	const [searchField, setSearchField] = useState<'email' | 'name'>('email');
	const { data, isLoading } = useAdminUsers({
		searchValue,
		searchField,
		limit: 25,
	});

	return (
		<div>
			<Title>Utilizadores</Title>
			<div className="mb-4 flex flex-wrap gap-2">
				<input
					className="input max-w-xs"
					placeholder="Pesquisar…"
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
				/>
				<select
					className="input max-w-[140px]"
					value={searchField}
					onChange={(e) =>
						setSearchField(e.target.value as 'email' | 'name')
					}
				>
					<option value="email">por email</option>
					<option value="name">por nome</option>
				</select>
			</div>
			{isLoading ? (
				<TableSkeleton />
			) : !data || data.users.length === 0 ? (
				<EmptyState title="Sem resultados" />
			) : (
				<div className="flex flex-col gap-2">
					{(data?.users ?? []).map((u) => (
						<div
							key={u.id}
							className="card items-center gap-3 p-3 sm:flex-row"
						>
							<Avatar src={u.image} name={u.name} size="md" />
							<div className="min-w-0 flex-1">
								<Link
									to={`/admin/utilizadores/${u.id}`}
									className="text-sm font-bold hover:text-blue"
								>
									{fullName(u.name, u.surname)}
									<span className="ml-2 font-mono text-xs font-normal text-ink/40">
										{u.email}
									</span>
								</Link>
								<div className="mt-1 flex items-center gap-2 text-xs">
									<StatusPill status={u.role} />
									{u.banned && (
										<span className="font-bold text-red">
											banido
										</span>
									)}
									{u.kyc && (
										<StatusPill status={u.kyc.status} />
									)}
								</div>
							</div>
							<UserActions user={u} />
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function UserActions({
	user,
}: {
	user: { id: string; role: Role; banned: boolean | null };
}) {
	const setRole = useSetUserRole();
	const ban = useBanUser();
	const unban = useUnbanUser();

	return (
		<div className="flex items-center gap-1.5">
			<select
				className="input !w-auto !py-1 text-sm"
				value={user.role}
				onChange={(e) =>
					void toast.promise(
						setRole.mutateAsync({
							id: user.id,
							role: e.target.value as Role,
						}),
						{
							loading: 'A atualizar função…',
							success: 'Função atualizada.',
							error: (err) => getApiError(err),
						},
					)
				}
			>
				{(['USER', 'PROMOTER', 'MODERATOR', 'ADMIN'] as Role[]).map(
					(r) => (
						<option key={r} value={r}>
							{r}
						</option>
					),
				)}
			</select>
			{user.banned ? (
				<button
					className="btn-ghost !text-green-700"
					onClick={() =>
						void toast.promise(unban.mutateAsync(user.id), {
							loading: 'A desbanir utilizador…',
							success: 'Utilizador desbanido.',
							error: (err) => getApiError(err),
						})
					}
				>
					Banir-limpar
				</button>
			) : (
				<ConfirmButton
					title="Banir utilizador?"
					message="O utilizador deixa de poder aceder à plataforma."
					confirmLabel="Banir"
					onConfirm={() =>
						void toast.promise(
							ban.mutateAsync({
								id: user.id,
								reason: 'Banido por um moderador',
							}),
							{
								loading: 'A banir utilizador…',
								success: 'Utilizador banido.',
								error: (err) => getApiError(err),
							},
						)
					}
				>
					<button className="btn-ghost !text-red">Banir</button>
				</ConfirmButton>
			)}
		</div>
	);
}

// ================= Utilizador (detalhe) =================

export function AdminUserPage() {
	usePageTitle('Utilizador');
	const { id } = useParams();
	const { data: user, isLoading } = useAdminUser(id);

	return (
		<div>
			<Title>Detalhe do utilizador</Title>
			{isLoading ? (
				<FormSkeleton />
			) : !user ? (
				<EmptyState title="Utilizador não encontrado" />
			) : (
				<div className="card gap-4 p-6">
					<div className="flex items-center gap-4">
						<Avatar
							src={user.image}
							name={fullName(user.name, user.surname)}
							size="lg"
						/>
						<div>
							<p className="font-display text-lg font-black">
								{fullName(user.name, user.surname)}
							</p>
							<p className="text-sm text-ink/50">{user.email}</p>
						</div>
						<div className="ml-auto flex gap-2">
							<StatusPill status={user.role} />
							{user.kyc && (
								<StatusPill status={user.kyc.status} />
							)}
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
						<Info k="Registo" v={formatDate(user.createdAt)} />
						<Info k="Confiança" v={String(user.trustScore)} />
						<Info k="Anúncios" v={String(user.adCount)} />
						<Info k="Telefone" v={user.phone ?? '—'} />
					</div>
					{user.subscriptions.length > 0 && (
						<div>
							<h3 className="mb-2 font-display text-sm font-black">
								Subscrições
							</h3>
							{(user.subscriptions ?? []).map((s) => (
								<div
									key={s.id}
									className="rounded-xl bg-snow px-3 py-2 text-sm"
								>
									{s.plan.name} · {formatKz(s.plan.price)} ·{' '}
									<StatusPill status={s.status} />
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

function Info({ k, v }: { k: string; v: string }) {
	return (
		<div>
			<p className="text-xs font-bold uppercase tracking-wide text-ink/40">
				{k}
			</p>
			<p className="mt-0.5 font-bold">{v}</p>
		</div>
	);
}

// ================= Pagamentos =================

export function AdminPaymentsPage() {
	usePageTitle('Gerir pagamentos');
	const { data, isLoading } = useAdminPayments({ limit: 50 });
	const review = useReviewPayment();
	const cancel = useCancelPayment();

	return (
		<div>
			<Title>Pagamentos</Title>
			{isLoading ? (
				<TableSkeleton />
			) : !data || data.items.length === 0 ? (
				<EmptyState title="Sem pagamentos" />
			) : (
				<div className="flex flex-col gap-3">
					{(data?.items ?? []).map((p) => (
						<div key={p.id} className="card gap-3 p-4">
							<div className="flex flex-wrap items-center justify-between gap-2">
								<div>
									<p className="text-sm font-bold">
										{p.subscription.business.name}
									</p>
									<p className="text-xs text-ink/50">
										Plano {p.subscription.plan.name} ·
										criado {formatDate(p.createdAt)}
									</p>
								</div>
								<div className="flex items-center gap-2">
									<Price value={p.amount} />
									<StatusPill status={p.status} />
								</div>
							</div>
							{p.proofUrl && (
								<a
									href={p.proofUrl}
									target="_blank"
									rel="noreferrer"
									className="text-xs font-bold text-blue hover:underline"
								>
									Ver comprovativo →
								</a>
							)}
							{p.status === 'UNDER_REVIEW' && (
								<div className="flex flex-wrap gap-2">
									<button
										className="btn-primary"
										onClick={() =>
											void toast.promise(
												review.mutateAsync({
													id: p.id,
													decision: 'APPROVED',
												}),
												{
													loading:
														'A aprovar pagamento…',
													success:
														'Pagamento aprovado. Subscrição ativada.',
													error: (err) =>
														getApiError(err),
												},
											)
										}
									>
										Aprovar
									</button>
									<button
										className="btn-ghost !text-red"
										onClick={() =>
											void toast.promise(
												review.mutateAsync({
													id: p.id,
													decision: 'REJECTED',
													note: 'Comprovativo inválido.',
												}),
												{
													loading:
														'A rejeitar pagamento…',
													success:
														'Pagamento rejeitado.',
													error: (err) =>
														getApiError(err),
												},
											)
										}
									>
										Rejeitar
									</button>
									<button
										className="btn-ghost"
										onClick={() =>
											void toast.promise(
												review.mutateAsync({
													id: p.id,
													decision: 'RETURNED',
													note: 'Reenviar o comprovativo.',
												}),
												{
													loading:
														'A devolver pagamento…',
													success:
														'Pagamento devolvido. O dono pode reenviar o comprovativo.',
													error: (err) =>
														getApiError(err),
												},
											)
										}
									>
										Devolver a pedido
									</button>
								</div>
							)}
							{p.status === 'PENDING' && (
								<button
									className="btn-ghost !text-red"
									onClick={() =>
										void toast.promise(
											cancel.mutateAsync(p.id),
											{
												loading:
													'A cancelar pagamento…',
												success: 'Pagamento cancelado.',
												error: (err) =>
													getApiError(err),
											},
										)
									}
								>
									Cancelar pedido
								</button>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

// ================= Denúncias =================

export function AdminReportsPage() {
	usePageTitle('Denúncias');
	const { data, isLoading } = useAdminReports({ limit: 50 });
	const moderate = useModerateReport();

	return (
		<div>
			<Title>Denúncias</Title>
			{isLoading ? (
				<TableSkeleton />
			) : !data || data.items.length === 0 ? (
				<EmptyState title="Sem denúncias" />
			) : (
				<div className="flex flex-col gap-3">
					{(data?.items ?? []).map((r) => (
						<div key={r.id} className="card gap-2 p-4">
							<div className="flex items-center justify-between">
								<p className="text-sm font-bold">
									{r.targetLabel ?? r.targetType}
									<span className="ml-2 font-mono text-[10px] font-normal text-ink/40">
										{r.targetType}
									</span>
								</p>
								<StatusPill status={r.status} />
							</div>
							<p className="text-xs text-ink/50">
								Motivo: {r.reason}
							</p>
							{r.description && (
								<p className="rounded-xl bg-snow p-3 text-sm text-ink/70">
									{r.description}
								</p>
							)}
							<p className="text-xs text-ink/40">
								Por{' '}
								{fullName(r.reporter.name, r.reporter.surname)}{' '}
								· {formatDate(r.createdAt)}
							</p>
							{r.status === 'PENDING' && (
								<div className="flex gap-2">
									<button
										className="btn-primary"
										onClick={() =>
											void toast.promise(
												moderate.mutateAsync({
													id: r.id,
													status: 'RESOLVED',
												}),
												{
													loading:
														'A resolver denúncia…',
													success:
														'Denúncia resolvida.',
													error: (err) =>
														getApiError(err),
												},
											)
										}
									>
										Resolver
									</button>
									<button
										className="btn-ghost"
										onClick={() =>
											void toast.promise(
												moderate.mutateAsync({
													id: r.id,
													status: 'DISMISSED',
												}),
												{
													loading:
														'A arquivar denúncia…',
													success:
														'Denúncia arquivada.',
													error: (err) =>
														getApiError(err),
												},
											)
										}
									>
										Arquivar
									</button>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

// ================= KYC =================

export function AdminKycPage() {
	usePageTitle('Verificações');
	const { data, isLoading } = useAdminKycList({ limit: 50 });
	const review = useReviewKyc();

	return (
		<div>
			<Title>Verificações KYC</Title>
			{isLoading ? (
				<TableSkeleton />
			) : !data || data.items.length === 0 ? (
				<EmptyState title="Sem pedidos KYC" />
			) : (
				<div className="flex flex-col gap-3">
					{(data?.items ?? []).map((k) => (
						<div key={k.id} className="card gap-3 p-4">
							<div className="flex items-center justify-between">
								<p className="text-sm font-bold">
									{fullName(k.user.name, k.user.surname)}
									<span className="ml-2 font-mono text-xs font-normal text-ink/40">
										{k.user.email}
									</span>
								</p>
								<StatusPill status={k.status} />
							</div>
							<div className="grid grid-cols-3 gap-2">
								<img
									src={k.biFrontUrl}
									alt="BI frente"
									className="h-24 w-full rounded-lg object-cover"
								/>
								<img
									src={k.biBackUrl}
									alt="BI verso"
									className="h-24 w-full rounded-lg object-cover"
								/>
								{k.fullBodyUrl ? (
									<img
										src={k.fullBodyUrl}
										alt="Corpo inteiro"
										className="h-24 w-full rounded-lg object-cover"
									/>
								) : (
									<div className="flex h-24 w-full items-center justify-center rounded-lg bg-snow text-[10px] font-bold text-ink/40">
										Sem corpo inteiro
									</div>
								)}
							</div>
							<p className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink/40">
								Selfies
							</p>
							<div className="grid grid-cols-3 gap-2">
								{(k.selfies ?? []).map((s, i) => (
									<img
										key={s.cloudinaryId ?? i}
										src={s.url}
										alt={`Selfie ${i + 1}`}
										className="h-24 w-full rounded-lg object-cover"
									/>
								))}
								{k.selfies.length < 3 &&
									Array.from({
										length: 3 - k.selfies.length,
									}).map((_, i) => (
										<div
											key={`empty-${i}`}
											className="flex h-24 w-full items-center justify-center rounded-lg bg-snow text-[10px] font-bold text-ink/40"
										>
											Sem selfie
										</div>
									))}
							</div>
							{k.status === 'PENDING' && (
								<div className="flex gap-2">
									<button
										className="btn-primary"
										onClick={() =>
											void toast.promise(
												review.mutateAsync({
													id: k.id,
													status: 'APPROVED',
												}),
												{
													loading:
														'A verificar utilizador…',
													success:
														'Utilizador verificado.',
													error: (err) =>
														getApiError(err),
												},
											)
										}
									>
										Aprovar
									</button>
									<button
										className="btn-ghost !text-red"
										onClick={() =>
											void toast.promise(
												review.mutateAsync({
													id: k.id,
													status: 'REJECTED',
													rejectionReason:
														'Documentos ilegíveis.',
												}),
												{
													loading:
														'A rejeitar verificação…',
													success:
														'Verificação rejeitada.',
													error: (err) =>
														getApiError(err),
												},
											)
										}
									>
										Rejeitar
									</button>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

// ================= Suporte =================

export function AdminSupportPage() {
	usePageTitle('Suporte');
	const { data, isLoading } = useAdminConversations();
	const claim = useClaimConversation();
	const release = useReleaseConversation();
	const resolve = useResolveConversation();

	return (
		<div>
			<Title>Conversas de suporte</Title>
			{isLoading ? (
				<TableSkeleton />
			) : !data || data.items.length === 0 ? (
				<EmptyState title="Sem conversas de suporte" />
			) : (
				<div className="flex flex-col gap-3">
					{(data?.items ?? []).map((c) => (
						<div key={c.id} className="card gap-2 p-4">
							<div className="flex items-center justify-between">
								<p className="text-sm font-bold">
									{c.business?.name ??
										c.ad?.title ??
										'Conversa'}
									<span className="ml-2 text-xs font-normal text-ink/50">
										({c.type})
									</span>
								</p>
								<div className="flex items-center gap-2">
									<StatusPill status={c.status} />
									{c.assignedTo ? (
										<span className="text-xs text-ink/50">
											com{' '}
											{fullName(
												c.assignedTo.name,
												c.assignedTo.surname,
											)}
										</span>
									) : (
										<span className="text-xs text-kwanza">
											por atribuir
										</span>
									)}
								</div>
							</div>
							<p className="text-xs text-ink/50">
								Aberto a {formatDate(c.createdAt)} · mensagens:{' '}
								{c.unreadCount}
							</p>
							<div className="flex flex-wrap gap-2">
								{!c.assignedTo && (
									<button
										className="btn-blue"
										onClick={() =>
											void toast.promise(
												claim.mutateAsync(c.id),
												{
													loading:
														'A assumir conversa…',
													success:
														'Conversa assumida.',
													error: (err) =>
														getApiError(err),
												},
											)
										}
									>
										Assumir
									</button>
								)}
								{c.assignedTo && (
									<button
										className="btn-ghost"
										onClick={() =>
											void toast.promise(
												release.mutateAsync(c.id),
												{
													loading:
														'A libertar conversa…',
													success:
														'Conversa libertada.',
													error: (err) =>
														getApiError(err),
												},
											)
										}
									>
										Libertar
									</button>
								)}
								{c.status !== 'RESOLVED' &&
									c.status !== 'CLOSED' && (
										<button
											className="btn-kwanza"
											onClick={() =>
												void toast.promise(
													resolve.mutateAsync({
														id: c.id,
														status: 'RESOLVED',
													}),
													{
														loading:
															'A resolver conversa…',
														success:
															'Conversa resolvida.',
														error: (err) =>
															getApiError(err),
													},
												)
											}
										>
											Marcar resolvida
										</button>
									)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

// ================= Categorias =================

export function AdminCategoriesPage() {
	usePageTitle('Categorias');
	const { data: categories, isLoading } = useCategories();
	const create = useCreateCategory();
	const update = useUpdateCategory();
	const del = useDeleteCategory();
	const [name, setName] = useState('');
	const [type, setType] = useState<CategoryType>('AD');

	return (
		<div>
			<Title>Categorias</Title>
			<form
				className="card mb-6 max-w-md gap-3 p-4"
				onSubmit={(e) => {
					e.preventDefault();
					if (!name.trim()) return;
					void toast
						.promise(
							create.mutateAsync({ name: name.trim(), type }),
							{
								loading: 'A criar categoria…',
								success: 'Categoria criada.',
								error: (err) => getApiError(err),
							},
						)
						.then(() => {
							setName('');
						});
				}}
			>
				<label className="label">Nova categoria</label>
				<input
					className="input"
					placeholder="Nome"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
				<select
					className="input"
					value={type}
					onChange={(e) => setType(e.target.value as CategoryType)}
				>
					<option value="AD">Anúncios</option>
					<option value="BUSINESS">Empresas</option>
				</select>
				<button className="btn-primary" disabled={create.isPending}>
					{create.isPending && <Spinner size={16} />} Criar
				</button>
			</form>

			{isLoading ? (
				<TableSkeleton />
			) : (
				<div className="flex flex-col gap-2">
					{(categories ?? []).map((c) => (
						<div
							key={c.id}
							className="card items-center gap-3 p-3 sm:flex-row"
						>
							<div className="min-w-0 flex-1">
								<p className="text-sm font-bold">
									{c.name}{' '}
									<span className="font-mono text-xs font-normal text-ink/40">
										/{c.slug}
									</span>
								</p>
								<p className="text-xs text-ink/50">
									{c.type} · {c.adCount + c.businessCount}{' '}
									conteúdos
								</p>
							</div>
							<button
								onClick={() =>
									void toast.promise(
										update.mutateAsync({
											id: c.id,
											name: c.name,
										}),
										{
											loading: 'A renomear categoria…',
											success: 'Categoria renomeada.',
											error: (err) => getApiError(err),
										},
									)
								}
								className="btn-ghost !text-blue"
							>
								Renomear
							</button>
							<ConfirmButton
								title="Apagar categoria?"
								message={`«${c.name}» será removida.`}
								confirmLabel="Apagar"
								onConfirm={() =>
									void toast.promise(del.mutateAsync(c.id), {
										loading: 'A apagar categoria…',
										success: 'Categoria apagada.',
										error: (err) => getApiError(err),
									})
								}
							>
								<button className="btn-ghost !text-red">
									🗑
								</button>
							</ConfirmButton>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

// ================= Planos =================

interface PlanFormState {
	name: string;
	description: string;
	price: number;
	currency: string;
	durationDays: number;
	benefits: string;
	businessVisibilityLimit: number;
	featuredAdsLimit: number;
	isActive: boolean;
}

const EMPTY_PLAN_FORM: PlanFormState = {
	name: '',
	description: '',
	price: 0,
	currency: 'AOA',
	durationDays: 30,
	benefits: '',
	businessVisibilityLimit: 1,
	featuredAdsLimit: 0,
	isActive: true,
};

function planToForm(plan: Plan): PlanFormState {
	return {
		name: plan.name,
		description: plan.description ?? '',
		price: plan.price,
		currency: plan.currency,
		durationDays: plan.durationDays,
		benefits: plan.benefits.join('\n'),
		businessVisibilityLimit: plan.businessVisibilityLimit,
		featuredAdsLimit: plan.featuredAdsLimit,
		isActive: plan.isActive,
	};
}

function formToPayload(form: PlanFormState): PlanInput {
	return {
		name: form.name.trim(),
		description: form.description.trim() || undefined,
		price: form.price,
		currency: form.currency.trim() || undefined,
		durationDays: form.durationDays,
		benefits: form.benefits
			.split('\n')
			.map((b) => b.trim())
			.filter(Boolean),
		businessVisibilityLimit: form.businessVisibilityLimit,
		featuredAdsLimit: form.featuredAdsLimit,
		isActive: form.isActive,
	};
}

export function AdminPlansPage() {
	usePageTitle('Planos');
	const { data: plans, isLoading } = useAdminPlans();
	const create = useCreatePlan();
	const update = useUpdatePlan();
	const del = useDeletePlan();
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState<PlanFormState>(EMPTY_PLAN_FORM);

	const startCreate = () => {
		setEditingId(null);
		setForm(EMPTY_PLAN_FORM);
	};

	const startEdit = (plan: Plan) => {
		setEditingId(plan.id);
		setForm(planToForm(plan));
	};

	const patch = <K extends keyof PlanFormState>(
		key: K,
		value: PlanFormState[K],
	) => setForm((prev) => ({ ...prev, [key]: value }));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.name.trim()) {
			toast.error('O nome do plano é obrigatório.');
			return;
		}
		const payload = formToPayload(form);
		void toast
			.promise(
				editingId
					? update.mutateAsync({ id: editingId, ...payload })
					: create.mutateAsync(payload),
				{
					loading: editingId
						? 'A atualizar plano…'
						: 'A criar plano…',
					success: editingId ? 'Plano atualizado.' : 'Plano criado.',
					error: (err) => getApiError(err),
				},
			)
			.then(() => {
				setForm(EMPTY_PLAN_FORM);
				setEditingId(null);
			});
	};

	return (
		<div>
			<Title>Gestão de planos</Title>

			<form
				className="card mb-6 max-w-2xl gap-3 p-4"
				onSubmit={handleSubmit}
			>
				<h2 className="font-display text-sm font-black">
					{editingId ? 'Editar plano' : 'Novo plano'}
				</h2>
				<div className="grid gap-3 sm:grid-cols-2">
					<div>
						<label className="label">Nome</label>
						<input
							className="input"
							value={form.name}
							onChange={(e) => patch('name', e.target.value)}
							required
						/>
					</div>
					<div>
						<label className="label">Preço (AOA)</label>
						<input
							className="input"
							type="number"
							min={0}
							step="0.01"
							value={form.price}
							onChange={(e) =>
								patch('price', Number(e.target.value))
							}
						/>
					</div>
					<div>
						<label className="label">Duração (dias)</label>
						<input
							className="input"
							type="number"
							min={1}
							max={365}
							value={form.durationDays}
							onChange={(e) =>
								patch('durationDays', Number(e.target.value))
							}
						/>
					</div>
					<div>
						<label className="label">Moeda</label>
						<input
							className="input"
							maxLength={3}
							value={form.currency}
							onChange={(e) => patch('currency', e.target.value)}
						/>
					</div>
					<div>
						<label className="label">
							Limite de visibilidade de empresas
						</label>
						<input
							className="input"
							type="number"
							min={0}
							value={form.businessVisibilityLimit}
							onChange={(e) =>
								patch(
									'businessVisibilityLimit',
									Number(e.target.value),
								)
							}
						/>
					</div>
					<div>
						<label className="label">Anúncios em destaque</label>
						<input
							className="input"
							type="number"
							min={0}
							value={form.featuredAdsLimit}
							onChange={(e) =>
								patch(
									'featuredAdsLimit',
									Number(e.target.value),
								)
							}
						/>
					</div>
					<div className="sm:col-span-2">
						<label className="label">Descrição</label>
						<textarea
							className="input min-h-20"
							value={form.description}
							onChange={(e) =>
								patch('description', e.target.value)
							}
						/>
					</div>
					<div className="sm:col-span-2">
						<label className="label">
							Benefícios (um por linha)
						</label>
						<textarea
							className="input min-h-24"
							value={form.benefits}
							onChange={(e) => patch('benefits', e.target.value)}
							placeholder={
								'Anúncio na página inicial\nSuporte prioritário'
							}
						/>
					</div>
				</div>
				<label className="flex items-center gap-2 text-sm font-bold">
					<input
						type="checkbox"
						checked={form.isActive}
						onChange={(e) => patch('isActive', e.target.checked)}
					/>
					Plano ativo
				</label>
				<div className="flex gap-2">
					<button
						className="btn-primary"
						disabled={create.isPending || update.isPending}
					>
						{(create.isPending || update.isPending) && (
							<Spinner size={16} />
						)}
						{editingId ? 'Guardar alterações' : 'Criar plano'}
					</button>
					{editingId && (
						<button
							type="button"
							className="btn-ghost"
							onClick={startCreate}
						>
							Cancelar
						</button>
					)}
				</div>
			</form>

			{isLoading ? (
				<TableSkeleton />
			) : (plans ?? []).length === 0 ? (
				<EmptyState
					title="Sem planos"
					description="Cria o primeiro plano de subscrição acima."
				/>
			) : (
				<div className="flex flex-col gap-2">
					{(plans ?? []).map((plan) => (
						<div
							key={plan.id}
							className="card items-center gap-3 p-3 sm:flex-row"
						>
							<div className="min-w-0 flex-1">
								<p className="flex flex-wrap items-center gap-2 text-sm font-bold">
									<span>{plan.name}</span>
									{plan.isActive ? (
										<StatusPill status="ACTIVE" />
									) : (
										<StatusPill
											status="HIDDEN"
											label="Inativo"
										/>
									)}
								</p>
								<p className="text-xs text-ink/50">
									{formatKz(plan.price)} · {plan.durationDays}{' '}
									dias · {plan.benefits.length} benefícios
								</p>
								{plan.description && (
									<p className="mt-1 line-clamp-1 text-xs text-ink/40">
										{plan.description}
									</p>
								)}
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => startEdit(plan)}
									className="btn-ghost !text-blue"
								>
									Editar
								</button>
								<ConfirmButton
									title="Apagar plano?"
									message={`«${plan.name}» será removido.`}
									confirmLabel="Apagar"
									onConfirm={() =>
										void toast.promise(
											del.mutateAsync(plan.id),
											{
												loading: 'A apagar plano…',
												success: 'Plano apagado.',
												error: (err) =>
													getApiError(err),
											},
										)
									}
								>
									<button className="btn-ghost !text-red">
										🗑
									</button>
								</ConfirmButton>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

// ================= Contas bancárias (admin) =================

const EMPTY_ACCOUNT_FORM: PlatformAccountInput = {
	bankName: '',
	bankHolder: '',
	bankIban: '',
	isActive: false,
};

export function AdminBankAccountsPage() {
	usePageTitle('Contas bancárias');
	const { data: accounts, isLoading } = usePlatformAccounts();
	const create = useCreatePlatformAccount();
	const update = useUpdatePlatformAccount();
	const del = useDeletePlatformAccount();
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState<PlatformAccountInput>(EMPTY_ACCOUNT_FORM);

	const startCreate = () => {
		setEditingId(null);
		setForm(EMPTY_ACCOUNT_FORM);
	};

	const startEdit = (account: PlatformBankAccount) => {
		setEditingId(account.id);
		setForm({
			bankName: account.bankName,
			bankHolder: account.bankHolder,
			bankIban: account.bankIban,
			isActive: account.isActive,
		});
	};

	const patch = <K extends keyof PlatformAccountInput>(
		key: K,
		value: PlatformAccountInput[K],
	) => setForm((prev) => ({ ...prev, [key]: value }));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!form.bankName.trim() ||
			!form.bankHolder.trim() ||
			!form.bankIban.trim()
		) {
			toast.error('Preenche o banco, o titular e o IBAN da conta.');
			return;
		}
		void toast
			.promise(
				editingId
					? update.mutateAsync({ id: editingId, ...form })
					: create.mutateAsync(form),
				{
					loading: editingId
						? 'A atualizar conta…'
						: 'A criar conta…',
					success: editingId ? 'Conta atualizada.' : 'Conta criada.',
					error: (err) => getApiError(err),
				},
			)
			.then(() => {
				setForm(EMPTY_ACCOUNT_FORM);
				setEditingId(null);
			});
	};

	const setActive = (account: PlatformBankAccount) =>
		void toast.promise(
			update.mutateAsync({
				id: account.id,
				bankName: account.bankName,
				bankHolder: account.bankHolder,
				bankIban: account.bankIban,
				isActive: true,
			}),
			{
				loading: 'A ativar conta…',
				success: 'Conta ativada.',
				error: (err) => getApiError(err),
			},
		);

	return (
		<div>
			<Title>Contas bancárias da plataforma</Title>

			<form
				className="card mb-6 max-w-2xl gap-3 p-4"
				onSubmit={handleSubmit}
			>
				<h2 className="font-display text-sm font-black">
					{editingId
						? 'Editar conta bancária'
						: 'Nova conta bancária'}
				</h2>
				<div className="grid gap-3">
					<div>
						<label className="label">Banco</label>
						<input
							className="input"
							maxLength={120}
							value={form.bankName}
							onChange={(e) => patch('bankName', e.target.value)}
							placeholder="BFA, BAI, BIC…"
							required
						/>
					</div>
					<div>
						<label className="label">Titular da conta</label>
						<input
							className="input"
							maxLength={120}
							value={form.bankHolder}
							onChange={(e) =>
								patch('bankHolder', e.target.value)
							}
							required
						/>
					</div>
					<div>
						<label className="label">Número de conta (IBAN)</label>
						<input
							className="input"
							maxLength={60}
							value={form.bankIban}
							onChange={(e) => patch('bankIban', e.target.value)}
							placeholder="AO060000000000000000000001"
							required
						/>
					</div>
				</div>
				<label className="flex items-center gap-2 text-sm font-bold">
					<input
						type="checkbox"
						checked={form.isActive}
						onChange={(e) => patch('isActive', e.target.checked)}
					/>
					Ativar conta (substitui a conta ativa atual)
				</label>
				<div className="flex gap-2">
					<button
						className="btn-primary"
						disabled={create.isPending || update.isPending}
					>
						{(create.isPending || update.isPending) && (
							<Spinner size={16} />
						)}
						{editingId ? 'Guardar alterações' : 'Criar conta'}
					</button>
					{editingId && (
						<button
							type="button"
							className="btn-ghost"
							onClick={startCreate}
						>
							Cancelar
						</button>
					)}
				</div>
			</form>

			{isLoading ? (
				<TableSkeleton />
			) : (accounts ?? []).length === 0 ? (
				<EmptyState
					title="Sem contas bancárias"
					description="Adiciona uma conta acima para receber os pagamentos dos planos."
				/>
			) : (
				<div className="flex flex-col gap-2">
					{(accounts ?? []).map((account) => (
						<div
							key={account.id}
							className="card items-center gap-3 p-3 sm:flex-row"
						>
							<div className="min-w-0 flex-1">
								<p className="flex flex-wrap items-center gap-2 text-sm font-bold">
									<span>{account.bankName}</span>
									{account.isActive ? (
										<StatusPill status="ACTIVE" />
									) : (
										<StatusPill
											status="HIDDEN"
											label="Inativa"
										/>
									)}
								</p>
								<p className="text-xs text-ink/50">
									{account.bankHolder} · {account.bankIban}
								</p>
							</div>
							<div className="flex flex-wrap gap-2">
								{!account.isActive && (
									<button
										onClick={() => setActive(account)}
										className="btn-ghost !text-green"
									>
										Ativar
									</button>
								)}
								<button
									onClick={() => startEdit(account)}
									className="btn-ghost !text-blue"
								>
									Editar
								</button>
								<ConfirmButton
									title="Apagar conta?"
									message={`A conta «${account.bankName}» (${account.bankIban}) será removida.`}
									confirmLabel="Apagar"
									onConfirm={() =>
										void toast.promise(
											del.mutateAsync(account.id),
											{
												loading: 'A apagar conta…',
												success: 'Conta apagada.',
												error: (err) =>
													getApiError(err),
											},
										)
									}
								>
									<button className="btn-ghost !text-red">
										🗑
									</button>
								</ConfirmButton>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

// ================= Analíticas =================

export function AdminAnalyticsPage() {
	usePageTitle('Analíticas');
	const { data } = usePlatformAnalytics('30d');
	const max = Math.max(1, ...(data?.daily ?? []).map((d) => d.views));

	return (
		<div>
			<Title>Analíticas da plataforma</Title>
			<div className="card gap-4 p-6">
				<div className="grid grid-cols-3 gap-3 text-sm">
					<Info
						k="Visualizações (30d)"
						v={String(data?.totals.views ?? '—')}
					/>
					<Info
						k="Visualizações únicas"
						v={formatDecimal(data?.totals.uniqueViews)}
					/>
					<Info k="Cliques" v={String(data?.totals.clicks ?? '—')} />
				</div>
				<div className="flex h-40 items-end gap-1">
					{(data?.daily ?? []).map((d) => (
						<div
							key={d.date}
							className="flex flex-1 flex-col items-center gap-1"
							title={`${d.date}: ${d.views} views`}
						>
							<div
								className="w-full rounded-t bg-blue"
								style={{ height: `${(d.views / max) * 100}%` }}
							/>
						</div>
					))}
				</div>
				<p className="text-xs text-ink/40">Últimos 30 dias por dia.</p>
			</div>
		</div>
	);
}
