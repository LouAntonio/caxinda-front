import { useEffect, useRef, useState } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import {
	Link,
	useNavigate,
	useParams,
	useSearchParams,
} from 'react-router-dom';
import toast from 'react-hot-toast';
import {
	useBusiness,
	useBusinesses,
	useCategories,
	useConversation,
	useConversations,
	useMessages,
	useMyKyc,
	useMyPayments,
	useMySubscriptions,
	usePaymentMethods,
	usePlans,
	useWishlist,
} from '../hooks/queries';
import {
	useCancelPayment,
	useChangeEmail,
	useChangePassword,
	useCreateBusiness,
	useCreatePayment,
	useDeleteBusiness,
	useFeatureBusiness,
	useMarkConversationRead,
	useRevokeSession,
	useSendMessage,
	useSetBusinessStatus,
	useSubmitKyc,
	useSubmitPaymentProof,
	useUnfeatureBusiness,
	useUnlinkAccount,
	useLinkGoogle,
	useUpdateBusiness,
	useUpdateProfile,
	useRevokeOtherSessions,
	useSetPassword,
} from '../hooks/mutations';
import { useSession } from '../hooks/useSession';
import { uploadImage, useUpload } from '../hooks/useUpload';
import { useChatStore } from '../store/chat';
import { useAuthStore } from '../store/auth';
import { getApiError } from '../lib/api';
import { parseUserAgent } from '../lib/userAgent';
import { AdCard } from '../components/ads/AdCard';
import { AdCardSkeletonGrid } from '../components/ads/AdCardSkeleton';
import { BusinessCard } from '../components/businesses/BusinessCard';
import { BusinessCardSkeletonGrid } from '../components/businesses/BusinessCardSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { FormSkeleton } from '../components/skeletons/FormSkeletons';
import { Spinner } from '../components/ui/Spinner';
import { ButtonLoader } from '../components/ui/Spinner';
import { Price } from '../components/ui/Price';
import { StatusPill } from '../components/ui/StatusPill';
import { Avatar } from '../components/ui/Avatar';
import { PasswordInput } from '../components/ui/PasswordInput';
import { ConfirmButton } from '../components/ui/ConfirmButton';
import { Lightbox } from '../components/ui/Lightbox';
import { GoogleButton } from '../components/ui/GoogleButton';
import { DeviceDesktopSVG } from '../components/ui/icons/DeviceDesktopSVG';
import { DevicePhoneSVG } from '../components/ui/icons/DevicePhoneSVG';
import { DeviceTabletSVG } from '../components/ui/icons/DeviceTabletSVG';
import {
	formatDate,
	formatDateTime,
	formatKz,
	formatShortDate,
	fullName,
	PROVINCE_LABELS,
} from '../lib/format';
import type { KycRecord, MediaAsset, Province } from '../types/api';
import { PROVINCES } from '../types/api';
import {
	PanelIcon,
	type PanelIconName,
} from '../components/ui/icons/PanelIcons';

function Title({ children }: { children: React.ReactNode }) {
	return (
		<h1 className="mb-6 font-display text-2xl font-black">{children}</h1>
	);
}

const DEVICE_ICONS = {
	desktop: DeviceDesktopSVG,
	mobile: DevicePhoneSVG,
	tablet: DeviceTabletSVG,
} as const;

// ================= Dashboard =================

export function AreaDashboardPage() {
	usePageTitle('Painel');
	const { user } = useSession();
	const { data: businesses } = useBusinesses({
		page: 1,
		limit: 1,
		ownerId: user?.id,
	});
	const { data: kyc } = useMyKyc();
	const { data: payments } = useMyPayments();
	const { data: subscriptions } = useMySubscriptions();

	const verified = Boolean(user && (user.isVerified || user.role !== 'USER'));

	const kycLabel = kyc
		? kyc.status === 'APPROVED'
			? '✔ Aprovado'
			: kyc.status === 'PENDING'
				? 'Em análise'
				: '⚠ Rejeitado'
		: 'Por fazer';

	const accountStatus = verified
		? 'Conta Empresarial'
		: kyc?.status === 'PENDING'
			? 'Conversão em análise'
			: kyc?.status === 'REJECTED'
				? 'Conversão rejeitada'
				: 'Conta pessoal';

	const firstName = user?.name?.split(' ')[0] ?? '';

	return (
		<div>
			<div className="card flex items-center justify-between gap-4 p-6">
				<div className="min-w-0">
					<p className="kicker">Minha conta</p>
					<h1 className="mt-1 font-display text-2xl font-black">
						Olá, {firstName || fullName(user?.name, user?.surname)}
					</h1>
					<p className="mt-1 truncate text-sm text-ink/60">
						{fullName(user?.name, user?.surname)} · {user?.email}
					</p>
				</div>
				<span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-kwanza px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-ink shadow-[0_4px_14px_rgba(242,169,0,0.25)]">
					<PanelIcon name="shield" size={14} />
					{accountStatus}
				</span>
			</div>

			<div className="mt-6 grid gap-4 sm:grid-cols-3">
				{verified ? (
					<>
						<StatCard
							label="Subscrições"
							value={subscriptions?.length ?? 0}
							to="/area/subscricoes"
							icon="layers"
							accent="red"
						/>
						<StatCard
							label="Empresas"
							value={businesses?.total ?? 0}
							to="/area/empresas"
							icon="building"
							accent="blue"
						/>
						<StatCard
							label="Conta Empresarial"
							value="✔ Ativa"
							to="/area/verificacao"
							icon="shield"
							accent="kwanza"
						/>
					</>
				) : (
					<div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink p-6 text-white sm:col-span-3">
						<div>
							<p className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-kwanza">
								<PanelIcon name="shield" size={13} />
								Conta Empresarial
							</p>
							<p className="mt-2 max-w-xl text-sm text-white/70">
								{kyc?.status === 'PENDING'
									? 'A tua verificação está em análise. Assim que for aprovada, tens acesso a empresas, planos e pagamentos.'
									: kyc?.status === 'REJECTED'
										? `Verificação rejeitada (${kyc.rejectionReason ?? 'documentos ilegíveis'}). Submete os documentos novamente para converteres a conta.`
										: 'Ainda não tens conta Empresarial. Converte a tua conta para criares empresas, subscreveres planos e gerires pagamentos.'}
							</p>
						</div>
						<Link
							to="/area/verificacao"
							className="btn-kwanza shrink-0"
						>
							Converter para conta Empresarial
						</Link>
					</div>
				)}
			</div>

			<div className="mt-6 grid gap-4 md:grid-cols-2">
				<div className="card p-5">
					<h2 className="font-display text-sm font-black">
						O teu perfil
					</h2>
					<div className="mt-3 flex items-center gap-3">
						<Avatar src={user?.image} name={user?.name} size="lg" />
						<div className="min-w-0">
							<p className="truncate text-sm font-bold">
								{fullName(user?.name, user?.surname)}
							</p>
							<p className="truncate text-xs text-ink/50">
								{user?.email}
							</p>
						</div>
					</div>
					<div className="mt-4 flex flex-wrap gap-2">
						<span className="chip">
							{verified ? 'Conta Empresarial' : 'Conta pessoal'}
						</span>
						<span className="chip">KYC: {kycLabel}</span>
						<span className="chip">
							Confiança: {user?.trustScore ?? '—'}
						</span>
					</div>
					<div className="mt-4 flex gap-2">
						<Link to="/area/definicoes" className="btn-outline">
							Definições
						</Link>
						<Link to="/area/verificacao" className="btn-blue">
							{verified
								? 'Conta Empresarial'
								: 'Converter para conta Empresarial'}
						</Link>
					</div>
				</div>
				{verified && (
					<div className="card p-5">
						<div className="flex items-center gap-2">
							<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-snow text-red">
								<PanelIcon name="card" size={16} />
							</span>
							<h2 className="font-display text-sm font-black">
								Pagamentos recentes
							</h2>
						</div>
						<div className="mt-2 flex flex-col gap-2">
							{(payments ?? []).slice(0, 3).map((p) => (
								<div
									key={p.id}
									className="flex items-center justify-between rounded-xl bg-snow px-3 py-2 text-sm"
								>
									<span className="font-bold">
										{p.subscription.business.name}
									</span>
									<span className="flex items-center gap-2">
										<StatusPill status={p.status} />
										<span className="font-mono text-xs">
											{formatKz(p.amount)}
										</span>
									</span>
								</div>
							))}
							{(payments ?? []).length === 0 && (
								<p className="text-sm text-ink/50">
									Sem pagamentos ainda.
								</p>
							)}
						</div>
						<Link
							to="/area/pagamentos"
							className="text-xs font-bold text-blue hover:underline"
						>
							Ver todos →
						</Link>
					</div>
				)}
			</div>

			{verified && (
				<div className="mt-6 grid gap-3 sm:grid-cols-2">
					<Link to="/area/empresas/nova" className="btn-blue">
						+ Nova empresa
					</Link>
					<Link to="/planos" className="btn-kwanza">
						Ver planos
					</Link>
				</div>
			)}
		</div>
	);
}

function StatCard({
	label,
	value,
	to,
	icon,
	accent,
}: {
	label: string;
	value: string | number;
	to: string;
	icon: PanelIconName;
	accent: 'red' | 'blue' | 'kwanza';
}) {
	const color =
		accent === 'red'
			? 'text-red'
			: accent === 'blue'
				? 'text-blue'
				: 'text-kwanza';
	return (
		<Link
			to={to}
			className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-md"
		>
			<div className="flex items-start justify-between">
				<span
					className={`flex h-10 w-10 items-center justify-center rounded-xl bg-snow ${color}`}
				>
					<PanelIcon name={icon} size={18} />
				</span>
				<span className="text-xs font-bold text-ink/30 transition group-hover:translate-x-0.5">
					→
				</span>
			</div>
			<p className="mt-4 font-mono text-3xl font-bold text-ink">
				{value}
			</p>
			<p className="kicker mt-1.5">{label}</p>
		</Link>
	);
}

function FilePicker({
	onFile,
	busy,
	multiple = false,
}: {
	onFile: (f: File) => void;
	busy: boolean;
	multiple?: boolean;
}) {
	const ref = useRef<HTMLInputElement>(null);
	return (
		<div>
			<input
				ref={ref}
				type="file"
				accept="image/*"
				multiple={multiple}
				className="hidden"
				onChange={(e) => {
					const files = Array.from(e.target.files ?? []);
					files.forEach(onFile);
					e.target.value = '';
				}}
			/>
			<button
				type="button"
				className="btn-outline"
				disabled={busy}
				onClick={() => ref.current?.click()}
			>
				{busy ? <Spinner size={16} /> : '⬆'} Enviar imagem
			</button>
		</div>
	);
}

// ================= Minhas empresas =================

export function MyBusinessesPage() {
	usePageTitle('As minhas empresas');
	const { user } = useSession();
	const { data: kyc } = useMyKyc();
	const kycApproved = kyc?.status === 'APPROVED';
	const { data, isLoading } = useBusinesses({
		page: 1,
		limit: 50,
		ownerId: user?.id,
	});

	return (
		<div>
			<div className="flex items-center justify-between">
				<Title>Minhas empresas</Title>
				{kycApproved && (
					<Link to="/area/empresas/nova" className="btn-blue">
						+ Nova
					</Link>
				)}
			</div>
			{isLoading ? (
				<BusinessCardSkeletonGrid
					count={4}
					gridClassName="grid gap-4 sm:grid-cols-2 lg:items-start"
				/>
			) : !data || data.items.length === 0 ? (
				kycApproved ? (
					<EmptyState
						title="Ainda não registaste empresas"
						description="Regista o teu estabelecimento para começares a divulgar."
						action={
							<Link to="/area/empresas/nova" className="btn-blue">
								Registar empresa
							</Link>
						}
					/>
				) : kyc?.status === 'REJECTED' ? (
					<EmptyState
						title="KYC rejeitado"
						description="A tua verificação foi rejeitada. Corrige os dados e submete novamente para poderes registar uma empresa."
						action={
							<Link to="/area/verificacao" className="btn-blue">
								Refazer verificação
							</Link>
						}
					/>
				) : kyc ? (
					<EmptyState
						title="KYC em análise"
						description="Precisas de ter a verificação KYC aprovada para registar uma empresa. O teu pedido está a ser analisado, tenta novamente mais tarde."
						action={
							<Link to="/area/verificacao" className="btn-blue">
								Ver estado do KYC
							</Link>
						}
					/>
				) : (
					<EmptyState
						title="Verifica a tua identidade primeiro"
						description="Para registares uma empresa, tens de concluir a verificação KYC (documento de identificação, selfies e foto de corpo inteiro)."
						action={
							<Link to="/area/verificacao" className="btn-blue">
								Fazer verificação
							</Link>
						}
					/>
				)
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:items-start">
					{data.items.map((b) => (
						<div key={b.id}>
							<BusinessCard business={b} showStatus />
							<div className="mt-2 flex flex-wrap gap-1.5">
								<StatusToggle id={b.id} current={b.status} />
								<FeatureBusinessButton business={b} />
								<Link
									to={`/area/empresas/${b.id}/subscricao`}
									className="btn-ghost !text-blue"
								>
									Planos
								</Link>
								<Link
									to={`/area/analiticas/empresa/${b.id}`}
									className="btn-ghost"
								>
									Estatísticas
								</Link>
								<Link
									to={`/area/empresas/${b.id}/editar`}
									className="btn-ghost"
								>
									Editar
								</Link>
								<DeleteBusinessButton id={b.id} name={b.name} />
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function DeleteBusinessButton({ id, name }: { id: string; name: string }) {
	const deleteBusiness = useDeleteBusiness();
	return (
		<ConfirmButton
			title="Apagar empresa?"
			message={`«${name}» será removida com todos os dados.`}
			confirmLabel="Apagar"
			busy={deleteBusiness.isPending}
			onConfirm={() =>
				void toast.promise(deleteBusiness.mutateAsync(id), {
					loading: 'A apagar…',
					success: 'Empresa apagada.',
					error: (e) => getApiError(e),
				})
			}
		>
			<button className="btn-ghost !text-red">🗑</button>
		</ConfirmButton>
	);
}

function StatusToggle({ id, current }: { id: string; current: string }) {
	const setStatus = useSetBusinessStatus();
	const next = current === 'SHOW' ? 'HIDE' : 'SHOW';
	return (
		<button
			className="btn-ghost"
			onClick={() =>
				void toast.promise(
					setStatus.mutateAsync({ id, status: next }),
					{
						loading: 'A alterar…',
						success: 'Estado atualizado.',
						error: (e) => getApiError(e),
					},
				)
			}
		>
			{current === 'SHOW' ? 'Ocultar' : 'Mostrar'}
		</button>
	);
}

function FeatureBusinessButton({
	business,
}: {
	business: {
		id: string;
		featured: boolean;
		featuredUntil: string | null;
	};
}) {
	const [open, setOpen] = useState(false);
	const [endDate, setEndDate] = useState('');
	const feature = useFeatureBusiness();
	const unfeature = useUnfeatureBusiness();
	const active =
		business.featured &&
		business.featuredUntil &&
		new Date(business.featuredUntil) > new Date();

	const pad = (n: number) => String(n).padStart(2, '0');
	const dateOf = (d: Date) =>
		`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
	const minDate = dateOf(new Date());

	const openPicker = () => {
		const ninety = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
		setEndDate(dateOf(ninety));
		setOpen((v) => !v);
	};

	const confirm = () => {
		if (!endDate) {
			toast.error('Escolhe a data de término do destaque.');
			return;
		}
		setOpen(false);
		void toast.promise(
			feature.mutateAsync({
				id: business.id,
				endDate: `${endDate}T23:59:59`,
			}),
			{
				loading: 'A destacar…',
				success: 'Empresa em destaque.',
				error: (e) => getApiError(e),
			},
		);
	};

	if (active) {
		return (
			<button
				className="btn-ghost !text-amber-600"
				title={`Destaque ativo até ${new Date(business.featuredUntil!).toLocaleDateString('pt-AO')}`}
				onClick={() =>
					void toast.promise(
						unfeature.mutateAsync({ id: business.id }),
						{
							loading: 'A retirar destaque…',
							success: 'Destaque removido.',
							error: (e) => getApiError(e),
						},
					)
				}
			>
				★ Ativo
			</button>
		);
	}

	return (
		<div className="relative">
			<button className="btn-ghost !text-amber-600" onClick={openPicker}>
				★ Destacar
			</button>
			{open && (
				<div className="absolute right-0 bottom-full z-20 mb-1 flex w-56 flex-col gap-2 rounded-lg border border-ink/10 bg-white p-2 shadow-lg">
					<label className="label mb-0">Até quando?</label>
					<input
						type="date"
						className="input !px-2.5 !py-1.5"
						value={endDate}
						min={minDate}
						onChange={(e) => setEndDate(e.target.value)}
					/>
					<button
						className="btn-primary !py-1.5"
						onClick={confirm}
						disabled={!endDate}
					>
						Confirmar destaque
					</button>
				</div>
			)}
		</div>
	);
}

// ================= Empresa (criar/editar) =================

export function BusinessFormPage() {
	usePageTitle('Empresa');
	const { id } = useParams();
	const editing = Boolean(id);
	const { data: business, isLoading } = useBusiness(id);
	const { data: categories } = useCategories('BUSINESS');
	const createBusiness = useCreateBusiness();
	const updateBusiness = useUpdateBusiness();
	const navigate = useNavigate();
	const upload = useUpload('businesses');
	const { data: kyc } = useMyKyc();
	const kycApproved = kyc?.status === 'APPROVED';

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [province, setProvince] = useState<Province>('LUANDA');
	const [categoryId, setCategoryId] = useState('');
	const [phone, setPhone] = useState('');
	const [whatsapp, setWhatsapp] = useState('');
	const [email, setEmail] = useState('');
	const [website, setWebsite] = useState('');
	const [address, setAddress] = useState('');
	const [logo, setLogo] = useState<MediaAsset | null>(null);
	const [cover, setCover] = useState<MediaAsset | null>(null);
	const [pendingLogo, setPendingLogo] = useState<File | null>(null);
	const [pendingCover, setPendingCover] = useState<File | null>(null);

	useEffect(() => {
		if (business) {
			setName(business.name);
			setDescription(business.description);
			setProvince(business.province);
			setCategoryId(business.category.id);
			setPhone(business.phone ?? '');
			setWhatsapp(business.whatsapp ?? '');
			setEmail(business.email ?? '');
			setWebsite(business.website ?? '');
			setAddress(business.address ?? '');
			setLogo(null);
			setCover(null);
			setPendingLogo(null);
			setPendingCover(null);
		}
	}, [business]);

	if (editing && isLoading) {
		return <FormSkeleton />;
	}

	if (!editing && !kycApproved) {
		return (
			<div>
				<Title>Nova empresa</Title>
				{kyc?.status === 'REJECTED' ? (
					<EmptyState
						title="KYC rejeitado"
						description="A tua verificação foi rejeitada. Corrige os dados e submete novamente para poderes registar uma empresa."
						action={
							<Link to="/area/verificacao" className="btn-blue">
								Refazer verificação
							</Link>
						}
					/>
				) : kyc ? (
					<EmptyState
						title="KYC em análise"
						description="Precisas de ter a verificação KYC aprovada para registar uma empresa. O teu pedido está a ser analisado, tenta novamente mais tarde."
						action={
							<Link to="/area/verificacao" className="btn-blue">
								Ver estado do KYC
							</Link>
						}
					/>
				) : (
					<EmptyState
						title="Verifica a tua identidade primeiro"
						description="Para registares uma empresa, tens de concluir a verificação KYC (documento de identificação, selfies e foto de corpo inteiro)."
						action={
							<Link to="/area/verificacao" className="btn-blue">
								Fazer verificação
							</Link>
						}
					/>
				)}
			</div>
		);
	}

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			let logoAsset = logo;
			let coverAsset = cover;

			if (pendingLogo) {
				logoAsset = await upload.mutateAsync(pendingLogo);
				setLogo(logoAsset);
				setPendingLogo(null);
			}
			if (pendingCover) {
				coverAsset = await upload.mutateAsync(pendingCover);
				setCover(coverAsset);
				setPendingCover(null);
			}

			const normalizedWebsite = website?.trim()
				? website.match(/^[a-z][a-z0-9+.-]*:\/\//i)
					? website.trim()
					: `https://${website.trim()}`
				: undefined;

			const payload = {
				name,
				description,
				province,
				categoryId: categoryId || undefined,
				phone: phone || undefined,
				whatsapp: whatsapp || undefined,
				email: email || undefined,
				website: normalizedWebsite,
				address: address || undefined,
				...(logoAsset
					? { logoUrl: logoAsset.url, logoId: logoAsset.cloudinaryId }
					: {}),
				...(coverAsset
					? {
							coverUrl: coverAsset.url,
							coverId: coverAsset.cloudinaryId,
						}
					: {}),
			};
			const mutation = editing ? updateBusiness : createBusiness;
			await toast.promise(
				(mutation.mutateAsync as (input: unknown) => Promise<unknown>)(
					editing ? { id: id!, ...payload } : payload,
				),
				{
					loading: 'A guardar…',
					success: editing
						? 'Empresa atualizada.'
						: 'Empresa registada.',
					error: (err) => getApiError(err),
				},
			);
			void navigate('/area/empresas');
		} catch {
			// error handled by toast.promise
		}
	};

	const onFile = (file: File, target: 'logo' | 'cover') => {
		const preview = URL.createObjectURL(file);
		if (target === 'logo') {
			setPendingLogo(file);
			setLogo({ url: preview, cloudinaryId: 'pending' });
		} else {
			setPendingCover(file);
			setCover({ url: preview, cloudinaryId: 'pending' });
		}
	};

	return (
		<div>
			<Title>{editing ? 'Editar empresa' : 'Nova empresa'}</Title>
			<form onSubmit={submit} className="card max-w-2xl gap-4 p-6">
				<div>
					<label className="label">Nome *</label>
					<input
						className="input"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						maxLength={140}
					/>
				</div>
				<div className="grid gap-4 sm:grid-cols-2 lg:items-start">
					<div>
						<label className="label">Província *</label>
						<select
							className="input"
							value={province}
							onChange={(e) =>
								setProvince(e.target.value as Province)
							}
						>
							{PROVINCES.map((p) => (
								<option key={p} value={p}>
									{PROVINCE_LABELS[p] ?? p}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="label">Categoria</label>
						<select
							className="input"
							value={categoryId}
							onChange={(e) => setCategoryId(e.target.value)}
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
				<div>
					<label className="label">Descrição *</label>
					<textarea
						className="input min-h-28"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
						maxLength={5000}
					/>
				</div>
				<div className="grid gap-4 sm:grid-cols-2 lg:items-start">
					<div>
						<label className="label">Telefone</label>
						<input
							className="input"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
						/>
					</div>
					<div>
						<label className="label">WhatsApp</label>
						<input
							className="input"
							value={whatsapp}
							onChange={(e) => setWhatsapp(e.target.value)}
							placeholder="+244 9xx xxx xxx"
						/>
					</div>
					<div>
						<label className="label">Email</label>
						<input
							className="input"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div>
						<label className="label">Website</label>
						<input
							className="input"
							value={website}
							onChange={(e) => setWebsite(e.target.value)}
						/>
					</div>
				</div>
				<div>
					<label className="label">Morada</label>
					<input
						className="input"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
					/>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 lg:items-start">
					<div>
						<label className="label">Logótipo</label>
						{logo ? (
							<img
								src={logo.url}
								alt="Logo"
								className="h-20 w-20 rounded-xl object-cover"
							/>
						) : (
							<FilePicker
								busy={upload.isPending}
								onFile={(f) => onFile(f, 'logo')}
							/>
						)}
						{logo && (
							<button
								type="button"
								onClick={() => {
									setLogo(null);
									setPendingLogo(null);
								}}
								className="btn-ghost !text-red"
							>
								Remover
							</button>
						)}
					</div>
					<div>
						<label className="label">Capa</label>
						{cover ? (
							<img
								src={cover.url}
								alt="Capa"
								className="h-20 w-32 rounded-xl object-cover"
							/>
						) : (
							<FilePicker
								busy={upload.isPending}
								onFile={(f) => onFile(f, 'cover')}
							/>
						)}
						{cover && (
							<button
								type="button"
								onClick={() => {
									setCover(null);
									setPendingCover(null);
								}}
								className="btn-ghost !text-red"
							>
								Remover
							</button>
						)}
					</div>
				</div>

				<div className="flex gap-2 pt-2">
					<button
						className="btn-blue"
						disabled={
							createBusiness.isPending || updateBusiness.isPending
						}
					>
						{(createBusiness.isPending ||
							updateBusiness.isPending) && <ButtonLoader />}
						{editing ? 'Guardar alterações' : 'Registar empresa'}
					</button>
					<Link to="/area/empresas" className="btn-ghost">
						Cancelar
					</Link>
				</div>
			</form>
		</div>
	);
}

// ================= Subscrever empresa =================

export function SubscribePage() {
	usePageTitle('Subscrição');
	const { id } = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [selectedPlan, setSelectedPlan] = useState(
		searchParams.get('plan') ?? '',
	);
	const { data: plans } = usePlans();
	const createPayment = useCreatePayment();

	return (
		<div className="card max-w-2xl gap-5 p-6">
			<Title>Assinar plano</Title>
			<p className="-mt-4 text-sm text-ink/60">
				Escolhe o plano para a tua empresa. Depois de pagares, envia o
				comprovativo para a ativação.
			</p>

			<div className="flex flex-col gap-3">
				{(plans?.plans ?? []).map((plan) => (
					<label
						key={plan.id}
						className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition ${selectedPlan === plan.id ? 'border-red bg-red/5' : 'border-ink/10 bg-white'}`}
					>
						<div>
							<p className="font-display text-sm font-black">
								{plan.name}
							</p>
							<p className="text-xs text-ink/50">
								{plan.durationDays} dias
							</p>
						</div>
						<div className="flex items-center gap-3">
							<span className="font-mono text-sm font-bold">
								{formatKz(plan.price)}
							</span>
							<input
								type="radio"
								name="plan"
								checked={selectedPlan === plan.id}
								onChange={() => setSelectedPlan(plan.id)}
							/>
						</div>
					</label>
				))}
			</div>

			<button
				className="btn-primary"
				disabled={!selectedPlan || createPayment.isPending}
				onClick={() =>
					void toast
						.promise(
							createPayment.mutateAsync({
								businessId: id!,
								planId: selectedPlan,
							}),
							{
								loading: 'A criar pedido…',
								success: 'Pedido criado. Envia o comprovativo.',
								error: (err) => getApiError(err),
							},
						)
						.then((payment) => {
							void navigate(`/area/pagamentos?pay=${payment.id}`);
						})
				}
			>
				{createPayment.isPending && <ButtonLoader />} Criar pedido de
				pagamento
			</button>
		</div>
	);
}

// ================= Favoritos =================

export function WishlistPage() {
	usePageTitle('Favoritos');
	const { data, isLoading } = useWishlist(1);
	return (
		<div>
			<Title>Favoritos</Title>
			{isLoading ? (
				<AdCardSkeletonGrid
					count={6}
					gridClassName="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:items-start"
				/>
			) : !data || data.items.length === 0 ? (
				<EmptyState
					title="Sem favoritos ainda"
					description="Toca na estrela num produto para o guardar aqui."
				/>
			) : (
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:items-start">
					{data.items.map((item) => (
						<AdCard key={item.id} ad={item.ad} />
					))}
				</div>
			)}
		</div>
	);
}

// ================= Mensagens =================

export function MessagesPage() {
	usePageTitle('Mensagens');
	const [searchParams] = useSearchParams();
	const [activeId, setActiveId] = useState<string | null>(
		searchParams.get('id'),
	);
	const { data: convos, isLoading } = useConversations();
	const { data: conversation } = useConversation(activeId ?? undefined);
	const {
		data: messages,
		isLoading: msgsLoading,
		refetch,
	} = useMessages(activeId ?? undefined);
	const send = useSendMessage();
	const markRead = useMarkConversationRead();
	const [text, setText] = useState('');
	const setOpenConversation = useChatStore((s) => s.setOpenConversation);
	const clearUnread = useChatStore((s) => s.clearUnread);
	const scrollRef = useRef<HTMLDivElement>(null);
	const typing = useChatStore((s) =>
		activeId ? s.typingByConversation[activeId] : undefined,
	);
	const presence = useChatStore((s) => s.presence);

	useEffect(() => {
		setOpenConversation(activeId);
		return () => setOpenConversation(null);
	}, [activeId, setOpenConversation]);

	useEffect(() => {
		if (activeId) {
			markRead.mutate(activeId);
			clearUnread(activeId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeId]);

	useEffect(() => {
		scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
	}, [messages, typing]);

	useEffect(() => {
		if (activeId !== (searchParams.get('id') ?? null)) {
			setActiveId(searchParams.get('id'));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	const otherName =
		conversation?.other === 'SUPPORT_AGENT'
			? 'Suporte'
			: conversation
				? fullName(
						conversation.other?.name,
						conversation.other?.surname,
					)
				: '';

	return (
		<div>
			<Title>Mensagens</Title>
			{isLoading ? (
				<div
					className="flex flex-col gap-1 rounded-2xl border border-ink/10 bg-white p-2"
					aria-hidden
				>
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className="flex items-center gap-2 px-3 py-2"
						>
							<Skeleton className="h-8 w-8 shrink-0 rounded-full" />
							<div className="min-w-0 flex-1 space-y-1.5">
								<Skeleton className="h-3 w-2/3 rounded" />
								<Skeleton className="h-3 w-1/3 rounded" />
							</div>
						</div>
					))}
				</div>
			) : !convos || convos.items.length === 0 ? (
				<EmptyState
					title="Sem conversas"
					description="Manda uma mensagem a um vendedor a partir de um produto ou empresa."
				/>
			) : (
				<div className="grid gap-4 lg:grid-cols-[260px_1fr]">
					<div className="flex flex-col gap-1 rounded-2xl border border-ink/10 bg-white p-2">
						{convos.items.map((c) => (
							<button
								key={c.id}
								onClick={() => setActiveId(c.id)}
								className={`flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${activeId === c.id ? 'bg-red text-white' : 'hover:bg-snow'}`}
							>
								<Avatar
									src={
										c.other === 'SUPPORT_AGENT'
											? null
											: c.other?.image
									}
									name={
										c.other === 'SUPPORT_AGENT'
											? 'Suporte'
											: c.other?.name
									}
									size="sm"
									online={
										c.other !== 'SUPPORT_AGENT'
											? presence[c.other?.id ?? '']
											: undefined
									}
								/>
								<span className="min-w-0 flex-1">
									<span className="block truncate font-bold">
										{c.other === 'SUPPORT_AGENT'
											? 'Suporte Caxinda'
											: fullName(
													c.other?.name,
													c.other?.surname,
												)}
									</span>
									<span className="block truncate text-xs opacity-70">
										{c.ad?.title ?? c.business?.name ?? ''}
									</span>
								</span>
								{c.unreadCount > 0 && (
									<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-kwanza px-1 font-mono text-[10px] font-bold text-ink">
										{c.unreadCount}
									</span>
								)}
							</button>
						))}
					</div>

					<div className="flex h-[540px] flex-col rounded-2xl border border-ink/10 bg-white">
						{activeId && conversation ? (
							<>
								<div className="flex items-center gap-2 border-b border-ink/10 p-3">
									<Avatar
										src={
											conversation.other ===
											'SUPPORT_AGENT'
												? null
												: conversation.other?.image
										}
										name={
											conversation.other ===
											'SUPPORT_AGENT'
												? 'Suporte'
												: conversation.other?.name
										}
										size="sm"
									/>
									<div className="min-w-0">
										<p className="truncate text-sm font-bold">
											{otherName}
										</p>
										<p className="truncate text-xs text-ink/50">
											{conversation.ad?.title ??
												conversation.business?.name ??
												'Suporte'}
										</p>
									</div>
									<StatusPill status={conversation.status} />
								</div>

								<div
									ref={scrollRef}
									className="flex-1 space-y-3 overflow-y-auto p-4"
								>
									{msgsLoading ? (
										<div className="flex justify-center pt-10 text-blue">
											<Spinner size={22} />
										</div>
									) : (
										(messages?.items ?? []).map((m) => (
											<MessageBubble
												key={m.id}
												message={m}
												mine={
													m.senderId ===
													useAuthStore.getState().user
														?.id
												}
											/>
										))
									)}
									{typing && (
										<p className="text-xs italic text-ink/40">
											a escrever…
										</p>
									)}
								</div>

								<form
									className="border-t border-ink/10 p-3"
									onSubmit={(e) => {
										e.preventDefault();
										if (!text.trim()) return;
										void toast
											.promise(
												send.mutateAsync({
													conversationId: activeId,
													content: text,
												}),
												{
													loading: 'A enviar…',
													success:
														'Mensagem enviada.',
													error: (err) =>
														getApiError(err),
												},
											)
											.then(() => {
												setText('');
												void refetch();
											});
									}}
								>
									<div className="flex gap-2">
										<input
											className="input"
											placeholder="Escreve a tua mensagem…"
											value={text}
											onChange={(e) =>
												setText(e.target.value)
											}
										/>
										<button
											className="btn-primary"
											disabled={
												send.isPending || !text.trim()
											}
										>
											{send.isPending ? (
												<Spinner size={16} />
											) : (
												'Enviar'
											)}
										</button>
									</div>
								</form>
							</>
						) : (
							<div className="flex flex-1 items-center justify-center text-sm text-ink/50">
								Escolhe uma conversa.
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

function MessageBubble({
	message,
	mine,
}: {
	message: {
		content: string;
		createdAt: string;
		isRead: boolean;
		senderId: string;
	};
	mine: boolean;
}) {
	return (
		<div className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
			<div
				className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? 'bg-blue text-white' : 'bg-snow text-ink'}`}
			>
				<p className="whitespace-pre-line">{message.content}</p>
				<p
					className={`mt-0.5 font-mono text-[10px] ${mine ? 'text-white/70' : 'text-ink/40'}`}
				>
					{formatDateTime(message.createdAt)}
					{mine && <> · {message.isRead ? 'visto' : 'enviado'}</>}
				</p>
			</div>
		</div>
	);
}

// ================= Pagamentos =================

export function PaymentsPage() {
	usePageTitle('Pagamentos');
	const [, setSearchParams] = useSearchParams();
	const { data: payments, isLoading } = useMyPayments();
	const submitProof = useSubmitPaymentProof();
	const cancelPayment = useCancelPayment();
	const { data: methods } = usePaymentMethods();
	const upload = useUpload('payments');
	const [proof, setProof] = useState<MediaAsset | null>(null);
	const [pendingProof, setPendingProof] = useState<File | null>(null);

	const sendProof = async (id: string) => {
		if (!pendingProof && !proof) {
			toast.error('Anexa o comprovativo.');
			return;
		}
		try {
			let proofAsset = proof;
			if (pendingProof) {
				proofAsset = await upload.mutateAsync(pendingProof);
				setProof(proofAsset);
				setPendingProof(null);
			}
			await toast.promise(
				submitProof.mutateAsync({
					id,
					proofUrl: proofAsset!.url,
					proofId: proofAsset!.cloudinaryId,
				}),
				{
					loading: 'A enviar…',
					success: 'Comprovativo enviado. Fica em análise.',
					error: (err) => getApiError(err),
				},
			);
			setProof(null);
			setPendingProof(null);
			setSearchParams({});
		} catch {
			// error handled by toast.promise
		}
	};

	return (
		<div>
			<Title>Pagamentos</Title>
			{isLoading ? (
				<div className="flex flex-col gap-4" aria-hidden>
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="card gap-3 p-5">
							<div className="flex items-center justify-between gap-2">
								<Skeleton className="h-4 w-40 rounded" />
								<Skeleton className="h-6 w-20 rounded-full" />
							</div>
							<Skeleton className="h-3 w-64 max-w-full rounded" />
							<Skeleton className="h-10 w-full rounded-xl" />
						</div>
					))}
				</div>
			) : !payments || payments.length === 0 ? (
				<EmptyState
					title="Sem pagamentos"
					description="Assina um plano para uma das tuas empresas."
					action={
						<Link to="/planos" className="btn-kwanza">
							Ver planos
						</Link>
					}
				/>
			) : (
				<div className="flex flex-col gap-4">
					{(payments ?? []).map((p) => (
						<div key={p.id} className="card gap-3 p-5">
							<div className="flex flex-wrap items-center justify-between gap-2">
								<div>
									<p className="font-display text-sm font-black">
										{p.subscription.business.name}
									</p>
									<p className="text-xs text-ink/50">
										Plano {p.subscription.plan.name}
									</p>
								</div>
								<div className="flex items-center gap-3">
									<Price value={p.amount} />
									<StatusPill status={p.status} />
								</div>
							</div>

							{p.platformAccount &&
								p.status === 'PENDING' &&
								p.platformAccount.length > 0 && (
									<div className="rounded-xl bg-snow p-4 font-mono text-xs">
										<p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">
											Dados para a transferência
										</p>
										<p className="mt-1 font-bold text-blue">
											{p.platformAccount[0].bankName}
										</p>
										<p>{p.platformAccount[0].bankHolder}</p>
										<p className="text-ink/70">
											{p.platformAccount[0].bankIban}
										</p>
									</div>
								)}

							{p.status === 'PENDING' && (
								<div className="flex flex-wrap items-center gap-3">
									{proof && (
										<div className="relative inline-block">
											<img
												src={proof.url}
												alt="Comprovativo"
												className="h-14 w-16 rounded-lg object-cover"
											/>
											<button
												type="button"
												onClick={() => {
													setProof(null);
													setPendingProof(null);
												}}
												className="btn-ghost absolute -top-2 -right-2 !bg-white !text-red"
											>
												✕
											</button>
										</div>
									)}
									{!proof && (
										<FilePicker
											busy={upload.isPending}
											onFile={(f) => {
												const preview =
													URL.createObjectURL(f);
												setPendingProof(f);
												setProof({
													url: preview,
													cloudinaryId: 'pending',
												});
											}}
										/>
									)}
									<button
										className="btn-primary"
										onClick={() => sendProof(p.id)}
										disabled={
											submitProof.isPending ||
											(!proof && !pendingProof)
										}
									>
										{submitProof.isPending && (
											<ButtonLoader />
										)}{' '}
										Enviar comprovativo
									</button>
									<ConfirmButton
										title="Cancelar pedido?"
										message="O pedido de pagamento será cancelado."
										confirmLabel="Cancelar"
										onConfirm={() =>
											void toast.promise(
												cancelPayment.mutateAsync(p.id),
												{
													loading: 'A cancelar…',
													success:
														'Pedido cancelado.',
													error: (e) =>
														getApiError(e),
												},
											)
										}
									>
										<button className="btn-ghost !text-red">
											Cancelar
										</button>
									</ConfirmButton>
								</div>
							)}

							<p className="font-mono text-[10px] text-ink/40">
								Criado a {formatDateTime(p.createdAt)}
								{p.reviewedAt && (
									<>
										{' '}
										· revisto a{' '}
										{formatDateTime(p.reviewedAt)}
									</>
								)}
							</p>
						</div>
					))}
					<div className="rounded-2xl border-2 border-dashed border-ink/20 p-4">
						<h3 className="font-display text-xs font-black text-ink/60">
							Contas da plataforma para a transferência
						</h3>
						<div className="mt-2 flex flex-wrap gap-3">
							{(methods ?? []).map((acc, i) => (
								<div
									key={i}
									className="rounded-xl bg-snow p-3 font-mono text-xs"
								>
									<p className="font-bold text-blue">
										{acc.bankName}
									</p>
									<p>{acc.bankHolder}</p>
									<p className="text-ink/70">
										{acc.bankIban}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

// ================= Subscrições =================

export function MySubscriptionsPage() {
	usePageTitle('Subscrições');
	const { data: subscriptions, isLoading } = useMySubscriptions();
	const { data: plansData } = usePlans();
	const plans = plansData?.plans ?? [];

	return (
		<div>
			<Title>Subscrições</Title>
			{isLoading ? (
				<div className="flex flex-col gap-4" aria-hidden>
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="card gap-3 p-5">
							<Skeleton className="h-4 w-48 rounded" />
							<Skeleton className="h-3 w-64 max-w-full rounded" />
							<Skeleton className="h-3 w-40 rounded" />
						</div>
					))}
				</div>
			) : !subscriptions || subscriptions.length === 0 ? (
				<EmptyState
					title="Sem subscrições"
					description="Assina um plano para uma das tuas empresas."
					action={
						<Link to="/planos" className="btn-kwanza">
							Ver planos
						</Link>
					}
				/>
			) : (
				<div className="flex flex-col gap-4">
					{(subscriptions ?? []).map((s) => (
						<div key={s.id} className="card gap-3 p-5">
							<div className="flex flex-wrap items-start justify-between gap-2">
								<div>
									<Link
										to={`/empresas/${s.business.slug}`}
										className="font-display text-sm font-black hover:text-red"
									>
										{s.business.name}
									</Link>
									<p className="text-xs text-ink/50">
										Plano {s.plan.name} ·{' '}
										{formatKz(s.plan.price)}
									</p>
								</div>
								<StatusPill status={s.status} />
							</div>

							<div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink/60">
								<span>
									Início: <b>{formatDate(s.startDate)}</b>
								</span>
								<span>
									Fim: <b>{formatDate(s.endDate)}</b>
								</span>
								<span>
									Renovação automática:{' '}
									<b>{s.autoRenew ? 'Sim' : 'Não'}</b>
								</span>
								{s.cancelledAt && (
									<span>
										Cancelada a{' '}
										<b>{formatDate(s.cancelledAt)}</b>
									</span>
								)}
							</div>

							{s.plan.description && (
								<p className="text-sm text-ink/70">
									{s.plan.description}
								</p>
							)}
							{s.plan.benefits.length > 0 && (
								<ul className="flex flex-wrap gap-1.5">
									{s.plan.benefits.map((b) => (
										<li
											key={b}
											className="rounded-full bg-kwanza/15 px-2.5 py-1 text-xs font-medium text-ink"
										>
											{b}
										</li>
									))}
								</ul>
							)}
							{(s.payments ?? []).length > 0 && (
								<div className="flex flex-col gap-1.5">
									{(s.payments ?? []).map((p) => (
										<div
											key={p.id}
											className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-snow px-3 py-2 text-xs"
										>
											<span className="font-mono text-ink/50">
												{formatDate(p.createdAt)}
											</span>
											<span className="flex items-center gap-2">
												<StatusPill status={p.status} />
												<b>{formatKz(p.amount)}</b>
											</span>
										</div>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			)}

			{plans.length > 0 && (
				<div className="mt-10">
					<h2 className="mb-4 font-display text-lg font-black">
						Planos disponíveis
					</h2>
					<div className="flex flex-col gap-4">
						{plans.map((plan) => (
							<div key={plan.id} className="card gap-3 p-5">
								<div className="flex flex-wrap items-center justify-between gap-2">
									<h3 className="font-display text-base font-black">
										{plan.name}
									</h3>
									<p className="font-mono text-sm font-bold">
										{formatKz(plan.price)}
										<span className="text-xs font-normal text-ink/40">
											{' '}
											/ {plan.durationDays} dias
										</span>
									</p>
								</div>
								{plan.description && (
									<p className="text-sm text-ink/70">
										{plan.description}
									</p>
								)}
								{plan.benefits.length > 0 && (
									<ul className="flex flex-wrap gap-1.5">
										{plan.benefits.map((b) => (
											<li
												key={b}
												className="rounded-full bg-kwanza/15 px-2.5 py-1 text-xs font-medium text-ink"
											>
												{b}
											</li>
										))}
									</ul>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

// ================= KYC =================

// ================= Verificação KYC =================

interface KycFile {
	file: File;
	preview: string;
}

export function KycPage() {
	usePageTitle('Converter para conta Empresarial');
	const { data: kyc } = useMyKyc();
	const submitKyc = useSubmitKyc();
	const previewsRef = useRef<Set<string>>(new Set());
	const [submitting, setSubmitting] = useState(false);
	const [biFront, setBiFront] = useState<KycFile | null>(null);
	const [biBack, setBiBack] = useState<KycFile | null>(null);
	const [selfies, setSelfies] = useState<KycFile[]>([]);
	const [fullBody, setFullBody] = useState<KycFile | null>(null);

	useEffect(() => {
		const previews = previewsRef.current;
		return () => {
			previews.forEach((url) => URL.revokeObjectURL(url));
			previews.clear();
		};
	}, []);

	const canSubmit = biFront && biBack && selfies.length === 3 && fullBody;

	const setSelfieAt = (index: number, item: KycFile | null) => {
		setSelfies((prev) => {
			const next = [...prev];
			if (item) {
				next[index] = item;
			} else {
				next.splice(index, 1);
			}
			return next;
		});
	};

	const pickImage = (file: File, setter: (item: KycFile | null) => void) => {
		const preview = URL.createObjectURL(file);
		previewsRef.current.add(preview);
		setter({ file, preview });
	};

	const submit = () => {
		if (!canSubmit) {
			toast.error(
				'Envia a frente e o verso do BI, 3 selfies e a foto de corpo inteiro.',
			);
			return;
		}
		setSubmitting(true);
		void toast
			.promise(
				(async () => {
					const [biFrontAsset, biBackAsset, fullBodyAsset] =
						await Promise.all([
							uploadImage(biFront.file, 'kyc'),
							uploadImage(biBack.file, 'kyc'),
							uploadImage(fullBody.file, 'kyc'),
						]);
					const selfieAssets = await Promise.all(
						selfies
							.slice(0, 3)
							.map((s) => uploadImage(s.file, 'kyc')),
					);
					await submitKyc.mutateAsync({
						biFrontUrl: biFrontAsset.url,
						biFrontId: biFrontAsset.cloudinaryId,
						biBackUrl: biBackAsset.url,
						biBackId: biBackAsset.cloudinaryId,
						selfies: selfieAssets.map(({ url, cloudinaryId }) => ({
							url,
							cloudinaryId,
						})),
						fullBodyUrl: fullBodyAsset.url,
						fullBodyId: fullBodyAsset.cloudinaryId,
					});
				})(),
				{
					loading: 'A enviar…',
					success:
						'Documentos enviados. A conversão para conta Empresarial leva até 48h.',
					error: (err) => getApiError(err),
				},
			)
			.finally(() => setSubmitting(false));
	};

	if (kyc && (kyc.status === 'APPROVED' || kyc.status === 'PENDING')) {
		return (
			<div>
				<Title>Conta Empresarial</Title>
				{kyc.status === 'APPROVED' ? (
					<div className="card mb-6 flex items-center gap-3 p-6">
						<p className="text-4xl">✔</p>
						<div>
							<h1 className="font-display text-xl font-black text-green-700">
								Conta Empresarial ativa
							</h1>
							<p className="mt-1 text-sm text-ink/60">
								Verificada em{' '}
								{kyc.verifiedAt
									? formatDate(kyc.verifiedAt)
									: 'data desconhecida'}
								. Já podes criar empresas e subscrever planos.
							</p>
						</div>
					</div>
				) : (
					<div className="card mb-6 flex items-center gap-4 p-6">
						<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-kwanza/15 text-kwanza">
							<PanelIcon name="clock" size={20} />
						</span>
						<div>
							<h1 className="font-display text-xl font-black">
								Conversão em análise
							</h1>
							<p className="mt-1 text-sm text-ink/60">
								Os teus documentos estão a ser verificados.
								Assim que for aprovado, a tua conta passa a
								Empresarial e tens acesso a empresas, planos e
								pagamentos. A análise demora até 48h.
							</p>
						</div>
					</div>
				)}
				<p className="mb-4 max-w-3xl text-sm text-ink/60">
					Estes são os documentos que enviaste. Depois de submetidos
					não podem ser alterados.
				</p>
				<KycReadonlyGrid kyc={kyc} />
			</div>
		);
	}

	return (
		<div>
			<Title>Converter para conta Empresarial</Title>
			{kyc?.status === 'REJECTED' && (
				<div className="mb-4 rounded-2xl bg-red/10 p-4 text-sm text-red">
					<strong>Rejeitado:</strong>{' '}
					{kyc.rejectionReason ??
						'Documentos ilegíveis. Tenta novamente.'}
				</div>
			)}
			<p className="mb-6 max-w-3xl text-sm leading-relaxed text-ink/70">
				Ao converteres a tua conta para <strong>Empresarial</strong>,
				ficas com acesso a{' '}
				<strong>
					criar empresas, subscrever planos e gerir pagamentos
				</strong>{' '}
				direto na tua área pessoal. Envia os teus documentos de
				identidade e a conversão é ativada em até 48h.
			</p>
			<div className="grid max-w-3xl gap-4 sm:grid-cols-2">
				<KycSlot
					label="Frente do BI"
					asset={biFront}
					onFile={(f) => void pickImage(f, setBiFront)}
					onRemove={biFront ? () => setBiFront(null) : undefined}
				/>
				<KycSlot
					label="Verso do BI"
					asset={biBack}
					onFile={(f) => void pickImage(f, setBiBack)}
					onRemove={biBack ? () => setBiBack(null) : undefined}
				/>
			</div>
			<p className="mt-6 mb-2 font-mono text-xs font-bold uppercase tracking-widest text-ink/40">
				Selfies (3 obrigatórias) — de frente, de perfil e outro ângulo
			</p>
			<div className="grid max-w-3xl gap-4 sm:grid-cols-3">
				{[0, 1, 2].map((index) => (
					<KycSlot
						key={index}
						label={`Selfie ${index + 1}`}
						asset={selfies[index] ?? null}
						onFile={(f) =>
							void pickImage(f, (item) =>
								setSelfieAt(index, item),
							)
						}
						onRemove={
							selfies[index]
								? () => setSelfieAt(index, null)
								: undefined
						}
					/>
				))}
			</div>
			<p className="mt-6 mb-2 font-mono text-xs font-bold uppercase tracking-widest text-ink/40">
				Foto de corpo inteiro (obrigatória)
			</p>
			<div className="grid max-w-3xl gap-4 sm:grid-cols-2">
				<KycSlot
					label="Corpo inteiro"
					asset={fullBody}
					onFile={(f) => void pickImage(f, setFullBody)}
					onRemove={fullBody ? () => setFullBody(null) : undefined}
				/>
			</div>
			<button
				className="btn-primary mt-6"
				disabled={!canSubmit || submitting}
				onClick={submit}
			>
				{submitting && <ButtonLoader />} Converter para conta
				Empresarial
			</button>
		</div>
	);
}

function KycReadonlyGrid({ kyc }: { kyc: KycRecord }) {
	const items: { label: string; src: string | null }[] = [
		{ label: 'Frente do BI', src: kyc.biFrontUrl },
		{ label: 'Verso do BI', src: kyc.biBackUrl },
		{ label: 'Selfie 1', src: kyc.selfies[0]?.url ?? null },
		{ label: 'Selfie 2', src: kyc.selfies[1]?.url ?? null },
		{ label: 'Selfie 3', src: kyc.selfies[2]?.url ?? null },
		{ label: 'Corpo inteiro', src: kyc.fullBodyUrl },
	];
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
	const imageUrls = items
		.map((i) => i.src)
		.filter((s): s is string => s !== null);

	return (
		<div>
			<div className="grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">
				{items.map((item) => (
					<div key={item.label}>
						<p className="label">{item.label}</p>
						{item.src ? (
							<button
								type="button"
								onClick={() =>
									setLightboxIndex(
										imageUrls.indexOf(item.src!),
									)
								}
								className="w-full overflow-hidden rounded-xl border border-ink/10 bg-snow"
								aria-label={`Ampliar ${item.label}`}
							>
								<img
									src={item.src}
									alt={item.label}
									className="h-36 w-full object-cover transition hover:scale-105"
								/>
							</button>
						) : (
							<div className="flex h-36 w-full items-center justify-center rounded-2xl border-2 border-dashed border-ink/15 font-mono text-xs font-bold text-ink/30">
								Sem imagem
							</div>
						)}
					</div>
				))}
			</div>
			<Lightbox
				images={imageUrls}
				index={lightboxIndex}
				onClose={() => setLightboxIndex(null)}
			/>
		</div>
	);
}

function KycSlot({
	label,
	asset,
	onFile,
	onRemove,
}: {
	label: string;
	asset: KycFile | null;
	onFile: (f: File) => void;
	onRemove?: () => void;
}) {
	return (
		<div>
			<label className="label">{label}</label>
			{asset ? (
				<div className="relative">
					<img
						src={asset.preview}
						alt={label}
						className="h-36 w-full rounded-xl object-cover"
					/>
					{onRemove && (
						<button
							type="button"
							onClick={onRemove}
							className="btn-ghost absolute -right-2 -top-2 !bg-white !text-red"
						>
							✕
						</button>
					)}
				</div>
			) : (
				<div className="flex h-36 w-full items-center justify-center rounded-2xl border-2 border-dashed border-ink/20 bg-white">
					<FilePicker busy={false} onFile={onFile} />
				</div>
			)}
		</div>
	);
}

// ================= Definições =================

export function SettingsPage() {
	usePageTitle('Definições');
	const { user } = useSession();
	const [profile, setProfile] = useState({
		name: '',
		surname: '',
		phone: '',
	});
	const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
	const [newEmail, setNewEmail] = useState('');
	const updateProfile = useUpdateProfile();
	const changePassword = useChangePassword();
	const setPassword = useSetPassword();
	const changeEmail = useChangeEmail();
	const revokeSession = useRevokeSession();
	const revokeOther = useRevokeOtherSessions();
	const unlinkGoogle = useUnlinkAccount();
	const linkGoogle = useLinkGoogle();
	const sessionToken = useAuthStore((state) => state.sessionToken);
	const [sessions, setSessions] = useState<
		{
			id: string;
			token?: string;
			provider: string;
			createdAt?: string;
			expiresAt?: string;
			device?: string;
			current?: boolean;
		}[]
	>([]);
	const [sessionsLoading, setSessionsLoading] = useState(false);

	useEffect(() => {
		if (user) {
			setProfile({
				name: user.name ?? '',
				surname: user.surname ?? '',
				phone: user.phone ?? '',
			});
		}
	}, [user]);

	const isGoogle =
		user?.accounts?.some((a) => a.providerId === 'google') ?? false;
	const hasPassword = user?.hasPassword ?? false;

	const loadSessions = () => {
		setSessionsLoading(true);
		httpGetSessions()
			.then((res) => {
				const items = Array.isArray(res)
					? res
					: ((res as { sessions?: unknown[] }).sessions ?? []);
				setSessions(
					items.map((s: any) => ({
						id: s.id ?? s.token ?? '-',
						token: s.token,
						provider: s.ipAddress ?? 'Sessão',
						createdAt: s.createdAt,
						expiresAt: s.expiresAt,
						device: s.userAgent ?? undefined,
						current: Boolean(s.token) && s.token === sessionToken,
					})),
				);
			})
			.catch(() => toast.error('Não foi possível carregar as sessões.'))
			.finally(() => setSessionsLoading(false));
	};

	useEffect(() => {
		void loadSessions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sessionToken]);
	return (
		<div>
			<Title>Definições</Title>
			<div className="flex flex-col gap-6">
				<section className="card gap-4 p-6">
					<h2 className="font-display text-sm font-black">
						Perfil público
					</h2>
					<div className="grid gap-4 sm:grid-cols-2 lg:items-start">
						<div>
							<label className="label">Nome</label>
							<input
								className="input"
								value={profile.name}
								onChange={(e) =>
									setProfile({
										...profile,
										name: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<label className="label">Apelido</label>
							<input
								className="input"
								value={profile.surname}
								onChange={(e) =>
									setProfile({
										...profile,
										surname: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<label className="label">Telefone</label>
							<input
								className="input"
								value={profile.phone}
								onChange={(e) =>
									setProfile({
										...profile,
										phone: e.target.value,
									})
								}
								placeholder="+244…"
							/>
						</div>
					</div>
					<button
						className="btn-primary max-w-fit"
						onClick={() =>
							void toast.promise(
								updateProfile.mutateAsync({
									name: profile.name,
									surname: profile.surname,
									phone: profile.phone || undefined,
								}),
								{
									loading: 'A guardar…',
									success: 'Perfil atualizado.',
									error: (err) => getApiError(err),
								},
							)
						}
					>
						Guardar perfil
					</button>
				</section>

				{hasPassword ? (
					<section className="card gap-4 p-6">
						<h2 className="font-display text-sm font-black">
							Alterar palavra-passe
						</h2>
						<div className="grid gap-4 sm:grid-cols-2 lg:items-start">
							<div>
								<label className="label">Atual</label>
								<PasswordInput
									value={pw.current}
									onChange={(e) =>
										setPw({
											...pw,
											current: e.target.value,
										})
									}
									autoComplete="current-password"
								/>
							</div>
							<div>
								<label className="label">Nova</label>
								<PasswordInput
									minLength={8}
									value={pw.next}
									onChange={(e) =>
										setPw({ ...pw, next: e.target.value })
									}
									autoComplete="new-password"
								/>
							</div>
							<div className="sm:col-span-2">
								<label className="label">
									Confirmar nova palavra-passe
								</label>
								<PasswordInput
									minLength={8}
									value={pw.confirm}
									onChange={(e) =>
										setPw({
											...pw,
											confirm: e.target.value,
										})
									}
									autoComplete="new-password"
									aria-invalid={
										(pw.confirm.length > 0 &&
											pw.confirm !== pw.next) ||
										undefined
									}
								/>
								{pw.confirm.length > 0 &&
									pw.confirm !== pw.next && (
										<p className="mt-1 text-xs font-bold text-red">
											As palavras-passe não coincidem.
										</p>
									)}
							</div>
						</div>
						<button
							className="btn-blue max-w-fit"
							onClick={() => {
								if (pw.next !== pw.confirm) {
									toast.error(
										'As palavras-passe não coincidem.',
									);
									return;
								}
								void toast
									.promise(
										changePassword.mutateAsync({
											currentPassword: pw.current,
											newPassword: pw.next,
										}),
										{
											loading: 'A alterar…',
											success: 'Palavra-passe alterada.',
											error: (err) => getApiError(err),
										},
									)
									.then(() =>
										setPw({
											current: '',
											next: '',
											confirm: '',
										}),
									);
							}}
						>
							Alterar
						</button>
					</section>
				) : (
					<section className="card gap-4 p-6">
						<h2 className="font-display text-sm font-black">
							Definir palavra-passe
						</h2>
						<p className="text-sm text-ink/50">
							A tua conta foi criada com Google. Define uma
							palavra-passe para poderes entrar também com email e
							palavra-passe.
						</p>
						<div className="grid gap-4 sm:grid-cols-2 lg:items-start">
							<div>
								<label className="label">
									Nova palavra-passe
								</label>
								<PasswordInput
									minLength={8}
									value={pw.next}
									onChange={(e) =>
										setPw({
											...pw,
											next: e.target.value,
										})
									}
									autoComplete="new-password"
								/>
							</div>
							<div>
								<label className="label">
									Confirmar nova palavra-passe
								</label>
								<PasswordInput
									minLength={8}
									value={pw.confirm}
									onChange={(e) =>
										setPw({
											...pw,
											confirm: e.target.value,
										})
									}
									autoComplete="new-password"
									aria-invalid={
										(pw.confirm.length > 0 &&
											pw.confirm !== pw.next) ||
										undefined
									}
								/>
								{pw.confirm.length > 0 &&
									pw.confirm !== pw.next && (
										<p className="mt-1 text-xs font-bold text-red">
											As palavras-passe não coincidem.
										</p>
									)}
							</div>
						</div>
						<button
							className="btn-blue max-w-fit"
							disabled={setPassword.isPending}
							onClick={() => {
								if (pw.next !== pw.confirm) {
									toast.error(
										'As palavras-passe não coincidem.',
									);
									return;
								}
								void toast
									.promise(setPassword.mutateAsync(pw.next), {
										loading: 'A definir…',
										success: 'Palavra-passe definida.',
										error: (err) => getApiError(err),
									})
									.then(() =>
										setPw({
											current: '',
											next: '',
											confirm: '',
										}),
									);
							}}
						>
							{setPassword.isPending ? (
								<ButtonLoader />
							) : (
								'Definir palavra-passe'
							)}
						</button>
					</section>
				)}

				<section className="card gap-4 p-6">
					<h2 className="font-display text-sm font-black">Email</h2>
					<p className="text-sm text-ink/50">Atual: {user?.email}</p>
					<div className="flex max-w-sm gap-2">
						<input
							className="input"
							placeholder="Novo email"
							value={newEmail}
							onChange={(e) => setNewEmail(e.target.value)}
						/>
						<button
							className="btn-blue"
							onClick={() =>
								void toast.promise(
									changeEmail.mutateAsync(newEmail),
									{
										loading: 'A enviar…',
										success:
											'Pedido enviado. Confirma o novo email.',
										error: (err) => getApiError(err),
									},
								)
							}
						>
							Atualizar
						</button>
					</div>
				</section>

				<section className="card gap-4 p-6">
					<h2 className="font-display text-sm font-black">
						Conta Google
					</h2>
					{isGoogle ? (
						<div className="flex items-center justify-between rounded-xl bg-snow p-3">
							<span className="text-sm font-bold">
								Ligado com Google
							</span>
							<button
								className="btn-ghost !text-red"
								disabled={!hasPassword}
								onClick={() =>
									void toast.promise(
										unlinkGoogle.mutateAsync(),
										{
											loading: 'A desligar…',
											success: 'Conta Google desligada.',
											error: (err) => getApiError(err),
										},
									)
								}
							>
								{!hasPassword
									? 'Define palavra-passe primeiro'
									: 'Desligar'}
							</button>
						</div>
					) : (
						<div className="flex flex-col gap-2 rounded-xl bg-snow p-3">
							<span className="text-sm font-bold">
								Ligar com Google
							</span>
							<p className="text-xs text-ink/50">
								Associa a tua conta Google para entrares sem
								palavra-passe.
							</p>
							<div className="flex">
								<GoogleButton
									width={240}
									onSuccess={(credential) =>
										void toast.promise(
											linkGoogle.mutateAsync(credential),
											{
												loading: 'A ligar…',
												success: 'Conta Google ligada.',
												error: (e) => getApiError(e),
											},
										)
									}
								/>
							</div>
						</div>
					)}
				</section>

				<section className="card gap-4 p-6">
					<div className="flex flex-wrap items-start justify-between gap-2">
						<h2 className="font-display text-sm font-black">
							Sessões ativas
						</h2>
						<div className="flex flex-wrap gap-2">
							<button
								className="btn-outline"
								disabled={sessionsLoading}
								onClick={loadSessions}
							>
								{sessionsLoading ? (
									<Spinner size={14} />
								) : (
									'Atualizar'
								)}
							</button>
							{sessions.length > 1 && (
								<ConfirmButton
									title="Terminar as outras sessões?"
									message="Todas as sessões exceto a atual serão encerradas."
									confirmLabel="Terminar todas"
									busy={revokeOther.isPending}
									onConfirm={() =>
										void toast
											.promise(
												revokeOther.mutateAsync(),
												{
													loading: 'A terminar…',
													success:
														'As outras sessões foram terminadas.',
													error: (err) =>
														getApiError(err),
												},
											)
											.then(loadSessions)
									}
								>
									<button className="btn-ghost !text-red">
										Terminar todas (menos a atual)
									</button>
								</ConfirmButton>
							)}
						</div>
					</div>
					{sessionsLoading && sessions.length === 0 ? (
						<p className="text-sm text-ink/50">
							A carregar sessões…
						</p>
					) : sessions.length === 0 ? (
						<p className="text-sm text-ink/50">
							Sem sessões ativas.
						</p>
					) : (
						<div className="flex flex-col gap-2">
							{sessions.map((s) => {
								const parsed = parseUserAgent(s.device);
								const DeviceIcon = DEVICE_ICONS[parsed.kind];
								return (
									<div
										key={s.id}
										className="flex flex-wrap items-start justify-between gap-3 rounded-xl bg-snow px-3 py-3 text-sm"
									>
										<div className="flex min-w-0 items-start gap-3">
											<span className="mt-0.5 text-ink/60">
												<DeviceIcon
													width={18}
													height={18}
												/>
											</span>
											<div className="min-w-0">
												<div className="flex items-center gap-2">
													<span className="font-bold">
														{parsed.label}
													</span>
													{s.current && (
														<span className="rounded-full bg-kwanza px-2 py-0.5 font-mono text-[10px] font-bold text-ink">
															atual
														</span>
													)}
												</div>
												{s.device && (
													<p className="mt-0.5 max-w-full whitespace-pre-wrap break-words font-mono text-[11px] leading-snug text-ink/40">
														{s.device}
													</p>
												)}
												<p className="mt-1 font-mono text-xs text-ink/50">
													Criada em{' '}
													{formatShortDate(
														s.createdAt,
													)}{' '}
													· expira{' '}
													{formatShortDate(
														s.expiresAt,
													)}
												</p>
											</div>
										</div>
										<button
											className="btn-ghost !text-red"
											disabled={
												s.current ||
												revokeSession.isPending
											}
											onClick={() =>
												void toast
													.promise(
														revokeSession.mutateAsync(
															s.token ?? '',
														),
														{
															loading:
																'A terminar…',
															success:
																'Sessão terminada.',
															error: (err) =>
																getApiError(
																	err,
																),
														},
													)
													.then(loadSessions)
											}
										>
											{s.current
												? 'Esta sessão'
												: 'Terminar'}
										</button>
									</div>
								);
							})}
						</div>
					)}
				</section>
			</div>
		</div>
	);
}

async function httpGetSessions(): Promise<unknown> {
	const { http } = await import('../lib/api');
	const res = await http.get('/auth/list-sessions');
	return res.data;
}
