import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
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
	usePlatformAnalytics,
} from '../hooks/queries';
import {
	useBanUser,
	useCreateCategory,
	useDeleteCategory,
	useModerateAd,
	useModerateBusiness,
	useModerateReport,
	useReviewKyc,
	useReviewPayment,
	useSetUserRole,
	useUnbanUser,
	useUpdateCategory,
	useClaimConversation,
	useReleaseConversation,
	useResolveConversation,
	useUnfeatureAd,
	useFeatureAd,
} from '../hooks/mutations';
import { PageLoader, Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { StatusPill } from '../components/ui/StatusPill';
import { Stars } from '../components/ui/Stars';
import { Avatar } from '../components/ui/Avatar';
import { ConfirmButton } from '../components/ui/ConfirmButton';
import { Price } from '../components/ui/Price';
import { getApiError } from '../lib/api';
import { formatDate, formatDecimal, formatKz, fullName } from '../lib/format';
import type { CategoryType, Role } from '../types/api';

function Title({ children }: { children: React.ReactNode }) {
	return (
		<h1 className="mb-6 font-display text-2xl font-black">{children}</h1>
	);
}

// ================= Dashboard =================

export function AdminDashboardPage() {
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
	const [q, setQ] = useState('');
	const { data, isLoading } = useAdminAds(
		q ? { q, limit: 25 } : { limit: 25 },
	);

	return (
		<div>
			<Title>Moderação de anúncios</Title>
			<input
				className="input mb-4 max-w-sm"
				placeholder="Pesquisar anúncios…"
				value={q}
				onChange={(e) => setQ(e.target.value)}
			/>
			{isLoading ? (
				<PageLoader />
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
		moderate.mutate(payload, {
			onSuccess: () => toast.success('Anúncio atualizado.'),
			onError: (e) => toast.error(getApiError(e)),
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
					(ad.visibility === 'VISIBLE' ? unfeature : feature).mutate(
						ad.id,
						{ onError: (e) => toast.error(getApiError(e)) },
					)
				}
			>
				{ad.visibility === 'VISIBLE' ? 'Destaque' : 'Retirar destaque'}
			</button>
		</div>
	);
}

// ================= Empresas =================

export function AdminBusinessesPage() {
	const { data, isLoading } = useBusinesses({ page: 1, limit: 50 });
	const moderate = useModerateBusiness();
	return (
		<div>
			<Title>Verificação de empresas</Title>
			{isLoading ? (
				<PageLoader />
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
											moderate.mutate(
												{ id: b.id, isVerified: true },
												{
													onSuccess: () =>
														toast.success(
															'Empresa verificada.',
														),
													onError: (e) =>
														toast.error(
															getApiError(e),
														),
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
										moderate.mutate(
											{
												id: b.id,
												status:
													b.status === 'SHOW'
														? 'HIDE'
														: 'SHOW',
											},
											{
												onSuccess: () =>
													toast.success(
														'Estado alterado.',
													),
												onError: (e) =>
													toast.error(getApiError(e)),
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
				<PageLoader />
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
					setRole.mutate(
						{ id: user.id, role: e.target.value as Role },
						{
							onSuccess: () =>
								toast.success('Função atualizada.'),
							onError: (err) => toast.error(getApiError(err)),
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
						unban.mutate(user.id, {
							onError: (e) => toast.error(getApiError(e)),
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
						ban.mutate(
							{ id: user.id, reason: 'Banido por um moderador' },
							{ onError: (e) => toast.error(getApiError(e)) },
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
	const { id } = useParams();
	const { data: user, isLoading } = useAdminUser(id);

	return (
		<div>
			<Title>Detalhe do utilizador</Title>
			{isLoading ? (
				<PageLoader />
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
	const { data, isLoading } = useAdminPayments({ limit: 50 });
	const review = useReviewPayment();

	return (
		<div>
			<Title>Pagamentos</Title>
			{isLoading ? (
				<PageLoader />
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
											review.mutate(
												{
													id: p.id,
													status: 'APPROVED',
												},
												{
													onSuccess: () =>
														toast.success(
															'Pagamento aprovado. Subscrição ativada.',
														),
													onError: (e) =>
														toast.error(
															getApiError(e),
														),
												},
											)
										}
									>
										Aprovar
									</button>
									<button
										className="btn-ghost !text-red"
										onClick={() =>
											review.mutate(
												{
													id: p.id,
													status: 'REJECTED',
													note: 'Comprovativo inválido.',
												},
												{
													onError: (e) =>
														toast.error(
															getApiError(e),
														),
												},
											)
										}
									>
										Rejeitar
									</button>
									<button
										className="btn-ghost"
										onClick={() =>
											review.mutate(
												{ id: p.id, status: 'PENDING' },
												{
													onError: (e) =>
														toast.error(
															getApiError(e),
														),
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
										review.mutate(
											{ id: p.id, status: 'CANCELLED' },
											{
												onError: (e) =>
													toast.error(getApiError(e)),
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
	const { data, isLoading } = useAdminReports({ limit: 50 });
	const moderate = useModerateReport();

	return (
		<div>
			<Title>Denúncias</Title>
			{isLoading ? (
				<PageLoader />
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
											moderate.mutate(
												{
													id: r.id,
													status: 'RESOLVED',
												},
												{
													onError: (e) =>
														toast.error(
															getApiError(e),
														),
												},
											)
										}
									>
										Resolver
									</button>
									<button
										className="btn-ghost"
										onClick={() =>
											moderate.mutate(
												{
													id: r.id,
													status: 'DISMISSED',
												},
												{
													onError: (e) =>
														toast.error(
															getApiError(e),
														),
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
	const { data, isLoading } = useAdminKycList({ limit: 50 });
	const review = useReviewKyc();

	return (
		<div>
			<Title>Verificações KYC</Title>
			{isLoading ? (
				<PageLoader />
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
								{k.selfies[0] && (
									<img
										src={k.selfies[0].url}
										alt="Selfie"
										className="h-24 w-full rounded-lg object-cover"
									/>
								)}
							</div>
							{k.status === 'PENDING' && (
								<div className="flex gap-2">
									<button
										className="btn-primary"
										onClick={() =>
											review.mutate(
												{
													id: k.id,
													status: 'APPROVED',
												},
												{
													onSuccess: () =>
														toast.success(
															'Utilizador verificado.',
														),
													onError: (e) =>
														toast.error(
															getApiError(e),
														),
												},
											)
										}
									>
										Aprovar
									</button>
									<button
										className="btn-ghost !text-red"
										onClick={() =>
											review.mutate(
												{
													id: k.id,
													status: 'REJECTED',
													rejectionReason:
														'Documentos ilegíveis.',
												},
												{
													onError: (e) =>
														toast.error(
															getApiError(e),
														),
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
	const { data, isLoading } = useAdminConversations();
	const claim = useClaimConversation();
	const release = useReleaseConversation();
	const resolve = useResolveConversation();

	return (
		<div>
			<Title>Conversas de suporte</Title>
			{isLoading ? (
				<PageLoader />
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
											claim.mutate(c.id, {
												onError: (e) =>
													toast.error(getApiError(e)),
											})
										}
									>
										Assumir
									</button>
								)}
								{c.assignedTo && (
									<button
										className="btn-ghost"
										onClick={() =>
											release.mutate(c.id, {
												onError: (e) =>
													toast.error(getApiError(e)),
											})
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
												resolve.mutate(
													{
														id: c.id,
														status: 'RESOLVED',
													},
													{
														onError: (e) =>
															toast.error(
																getApiError(e),
															),
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
					create.mutate(
						{ name: name.trim(), type },
						{
							onSuccess: () => {
								toast.success('Categoria criada.');
								setName('');
							},
							onError: (err) => toast.error(getApiError(err)),
						},
					);
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
				<PageLoader />
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
									update.mutate(
										{ id: c.id, name: c.name },
										{
											onError: (e) =>
												toast.error(getApiError(e)),
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
									del.mutate(c.id, {
										onSuccess: () =>
											toast.success('Categoria apagada.'),
										onError: (e) =>
											toast.error(getApiError(e)),
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

// ================= Analíticas =================

export function AdminAnalyticsPage() {
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
