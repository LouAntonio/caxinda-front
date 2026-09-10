import { useEffect, useRef, useState } from 'react';
import {
	Link,
	useNavigate,
	useParams,
	useSearchParams,
} from 'react-router-dom';
import toast from 'react-hot-toast';
import {
	useAd,
	useAds,
	useBusiness,
	useBusinesses,
	useCategories,
	useConversation,
	useConversations,
	useMessages,
	useMyKyc,
	useMyPayments,
	usePlans,
	useWishlist,
} from '../hooks/queries';
import {
	useCancelPayment,
	useChangeEmail,
	useChangePassword,
	useCreateAd,
	useCreateBusiness,
	useCreatePayment,
	useDeleteAd,
	useDeleteBusiness,
	useMarkConversationRead,
	useRevokeSession,
	useSendMessage,
	useSetAdVisibility,
	useSetBusinessStatus,
	useSubmitKyc,
	useSubmitPaymentProof,
	useUnlinkAccount,
	useUpdateAd,
	useUpdateBusiness,
	useUpdateProfile,
} from '../hooks/mutations';
import { useSession } from '../hooks/useSession';
import { useUpload } from '../hooks/useUpload';
import { useChatStore } from '../store/chat';
import { useAuthStore } from '../store/auth';
import { getApiError } from '../lib/api';
import { AdCard } from '../components/ads/AdCard';
import { BusinessCard } from '../components/businesses/BusinessCard';
import { EmptyState } from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/Spinner';
import { Spinner } from '../components/ui/Spinner';
import { ButtonLoader } from '../components/ui/Spinner';
import { Price } from '../components/ui/Price';
import { StatusPill } from '../components/ui/StatusPill';
import { Avatar } from '../components/ui/Avatar';
import { PasswordInput } from '../components/ui/PasswordInput';
import { ConfirmButton } from '../components/ui/ConfirmButton';
import { formatDate, formatDateTime, formatKz, fullName } from '../lib/format';
import type { MediaAsset, Province } from '../types/api';
import { PROVINCES } from '../types/api';

function Title({ children }: { children: React.ReactNode }) {
	return (
		<h1 className="mb-6 font-display text-2xl font-black">{children}</h1>
	);
}

// ================= Dashboard =================

export function AreaDashboardPage() {
	const { user } = useSession();
	const { data: ads } = useAds({
		page: 1,
		limit: 1,
		includeInactive: true,
		userId: user?.id,
	});
	const { data: businesses } = useBusinesses({
		page: 1,
		limit: 1,
		ownerId: user?.id,
	});
	const { data: kyc } = useMyKyc();
	const { data: payments } = useMyPayments();

	const kycLabel = kyc
		? kyc.status === 'APPROVED'
			? '✔ Aprovado'
			: kyc.status === 'PENDING'
				? 'Em análise'
				: '⚠ Rejeitado'
		: 'Por fazer';

	return (
		<div>
			<Title>Visão geral</Title>
			<div className="grid gap-4 sm:grid-cols-3">
				<StatCard
					label="Meus anúncios"
					value={ads?.total ?? 0}
					to="/area/anuncios"
					accent="red"
				/>
				<StatCard
					label="Empresas"
					value={businesses?.total ?? 0}
					to="/area/empresas"
					accent="blue"
				/>
				<StatCard
					label="Verificação KYC"
					value={kycLabel}
					to="/area/verificacao"
					accent="ink"
				/>
			</div>

			<div className="mt-6 grid gap-4 md:grid-cols-2">
				<div className="card p-5">
					<h2 className="font-display text-sm font-black">
						O teu perfil
					</h2>
					<p className="mt-2 text-sm text-ink/70">
						{fullName(user?.name, user?.surname)} · {user?.email}
					</p>
					<p className="mt-1 text-xs text-ink/50">
						KYC: {kycLabel} · Confiança: {user?.trustScore ?? '—'}
					</p>
					<div className="mt-4 flex gap-2">
						<Link to="/area/definicoes" className="btn-outline">
							Definições
						</Link>
						<Link to="/area/verificacao" className="btn-blue">
							Verificação
						</Link>
					</div>
				</div>
				<div className="card p-5">
					<h2 className="font-display text-sm font-black">
						Pagamentos recentes
					</h2>
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
			</div>

			<div className="mt-6 grid gap-3 sm:grid-cols-3">
				<Link to="/area/anuncios/novo" className="btn-primary">
					+ Novo anúncio
				</Link>
				<Link to="/area/empresas/nova" className="btn-blue">
					+ Nova empresa
				</Link>
				<Link to="/planos" className="btn-kwanza">
					Ver planos
				</Link>
			</div>
		</div>
	);
}

function StatCard({
	label,
	value,
	to,
	accent,
}: {
	label: string;
	value: string | number;
	to: string;
	accent: 'red' | 'blue' | 'ink';
}) {
	const color =
		accent === 'red'
			? 'text-red'
			: accent === 'blue'
				? 'text-blue'
				: 'text-ink';
	return (
		<Link
			to={to}
			className="card p-5 transition hover:-translate-y-0.5 hover:shadow-md"
		>
			<p className={`font-mono text-3xl font-bold ${color}`}>{value}</p>
			<p className="mt-1 text-sm font-bold text-ink/60">{label}</p>
		</Link>
	);
}

// ================= Meus anúncios =================

export function MyAdsPage() {
	const { user } = useSession();
	const { data, isLoading } = useAds({
		page: 1,
		limit: 50,
		includeInactive: true,
		userId: user?.id,
	});

	return (
		<div>
			<div className="flex items-center justify-between">
				<Title>Meus anúncios</Title>
				<Link to="/area/anuncios/novo" className="btn-primary">
					+ Novo
				</Link>
			</div>
			{isLoading ? (
				<PageLoader />
			) : !data || data.items.length === 0 ? (
				<EmptyState
					title="Ainda não publicaste anúncios"
					description="Cria o primeiro em menos de um minuto."
					action={
						<Link to="/area/anuncios/novo" className="btn-primary">
							Publicar anúncio
						</Link>
					}
				/>
			) : (
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
					{data.items.map((ad) => (
						<div key={ad.id} className="relative">
							<AdCard ad={ad} showStatus />
							<div className="absolute bottom-2 right-2 z-10 flex gap-1.5">
								<VisibilityToggle
									id={ad.id}
									current={ad.visibility}
								/>
								<Link
									to={`/area/anuncios/${ad.id}/editar`}
									className="btn-ghost !bg-white/90 !text-blue"
								>
									Editar
								</Link>
								<DeleteAdButton id={ad.id} title={ad.title} />
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function DeleteAdButton({ id, title }: { id: string; title: string }) {
	const deleteAd = useDeleteAd();
	return (
		<ConfirmButton
			title="Apagar anúncio?"
			message={`«${title}» será removido permanentemente.`}
			confirmLabel="Apagar"
			busy={deleteAd.isPending}
			onConfirm={() =>
				deleteAd.mutate(id, {
					onSuccess: () => toast.success('Anúncio apagado.'),
					onError: (e) => toast.error(getApiError(e)),
				})
			}
		>
			<button className="btn-ghost !bg-white/90 !text-red">🗑</button>
		</ConfirmButton>
	);
}

function VisibilityToggle({ id, current }: { id: string; current: string }) {
	const setVisibility = useSetAdVisibility();
	const next = current === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE';
	return (
		<button
			className={
				current === 'VISIBLE'
					? 'btn-ghost !bg-white/90 !text-ink'
					: 'btn-ghost !bg-white/90 !text-blue'
			}
			title={current === 'VISIBLE' ? 'Ocultar' : 'Mostrar'}
			onClick={() =>
				setVisibility.mutate(
					{ id, visibility: next },
					{ onError: (e) => toast.error(getApiError(e)) },
				)
			}
		>
			{current === 'VISIBLE' ? 'Ocultar' : 'Mostrar'}
		</button>
	);
}

// ================= Anúncio (criar/editar) =================

export function AdFormPage() {
	const { id } = useParams();
	const editing = Boolean(id);
	const { data: ad, isLoading } = useAd(id);
	const { data: categories } = useCategories('AD');
	const createAd = useCreateAd();
	const updateAd = useUpdateAd();
	const navigate = useNavigate();

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [categoryId, setCategoryId] = useState('');
	const upload = useUpload('ads');
	const [image, setImage] = useState<MediaAsset | null>(null);
	const [gallery, setGallery] = useState<MediaAsset[]>([]);

	useEffect(() => {
		if (ad) {
			setTitle(ad.title);
			setDescription(ad.description);
			setPrice(
				ad.price !== null && ad.price !== undefined
					? String(ad.price)
					: '',
			);
			setCategoryId(ad.category?.id ?? '');
			setImage(
				ad.image
					? { url: ad.image, cloudinaryId: ad.imageId ?? ad.image }
					: null,
			);
			setGallery(ad.gallery ?? []);
		}
	}, [ad]);

	if (editing && isLoading) {
		return <PageLoader />;
	}

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!categoryId) {
			toast.error('Escolhe uma categoria.');
			return;
		}
		const payload = {
			title,
			description,
			price: price ? Number(price) : undefined,
			categoryId,
			...(image ? { image: image.url, imageId: image.cloudinaryId } : {}),
			...(gallery.length ? { gallery } : {}),
		};
		const mutation = editing ? updateAd : createAd;
		mutation.mutate(
			(editing ? { id: id!, ...payload } : payload) as never,
			{
				onSuccess: () => {
					toast.success(
						editing ? 'Anúncio atualizado.' : 'Anúncio publicado.',
					);
					void navigate('/area/anuncios');
				},
				onError: (err) => toast.error(getApiError(err)),
			},
		);
	};

	const onFile = async (file: File, target: 'main' | 'gallery') => {
		try {
			const asset = await upload.mutateAsync(file);
			if (target === 'main') setImage(asset);
			else setGallery((g) => [...g, asset]);
		} catch {
			toast.error('Falha ao enviar a imagem.');
		}
	};

	return (
		<div>
			<Title>{editing ? 'Editar anúncio' : 'Novo anúncio'}</Title>
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
								onClick={() => setImage(null)}
								className="btn-ghost absolute -top-2 -right-2 !bg-white !text-red"
							>
								✕
							</button>
						</div>
					) : (
						<FilePicker
							busy={upload.isPending}
							onFile={(f) => onFile(f, 'main')}
						/>
					)}
				</div>

				<div>
					<label className="label">Galeria (até 4)</label>
					<div className="flex flex-wrap gap-2">
						{gallery.map((g) => (
							<img
								key={g.cloudinaryId}
								src={g.url}
								alt=""
								className="h-20 w-24 rounded-lg object-cover"
							/>
						))}
						{gallery.length < 4 && (
							<FilePicker
								busy={upload.isPending}
								onFile={(f) => onFile(f, 'gallery')}
							/>
						)}
					</div>
				</div>

				<div className="flex gap-2 pt-2">
					<button
						className="btn-primary"
						disabled={createAd.isPending || updateAd.isPending}
					>
						{(createAd.isPending || updateAd.isPending) && (
							<ButtonLoader />
						)}
						{editing ? 'Guardar alterações' : 'Publicar anúncio'}
					</button>
					<Link to="/area/anuncios" className="btn-ghost">
						Cancelar
					</Link>
				</div>
			</form>
		</div>
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
	const { user } = useSession();
	const { data, isLoading } = useBusinesses({
		page: 1,
		limit: 50,
		ownerId: user?.id,
	});

	return (
		<div>
			<div className="flex items-center justify-between">
				<Title>Minhas empresas</Title>
				<Link to="/area/empresas/nova" className="btn-blue">
					+ Nova
				</Link>
			</div>
			{isLoading ? (
				<PageLoader />
			) : !data || data.items.length === 0 ? (
				<EmptyState
					title="Ainda não registaste empresas"
					description="Regista o teu estabelecimento para começares a divulgar."
					action={
						<Link to="/area/empresas/nova" className="btn-blue">
							Registar empresa
						</Link>
					}
				/>
			) : (
				<div className="grid gap-4 sm:grid-cols-2">
					{data.items.map((b) => (
						<div key={b.id}>
							<BusinessCard business={b} showStatus />
							<div className="mt-2 flex flex-wrap gap-1.5">
								<StatusToggle id={b.id} current={b.status} />
								<Link
									to={`/area/empresas/${b.id}/subscricao`}
									className="btn-ghost !text-blue"
								>
									Planos
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
				deleteBusiness.mutate(id, {
					onSuccess: () => toast.success('Empresa apagada.'),
					onError: (e) => toast.error(getApiError(e)),
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
				setStatus.mutate(
					{ id, status: next },
					{ onError: (e) => toast.error(getApiError(e)) },
				)
			}
		>
			{current === 'SHOW' ? 'Ocultar' : 'Mostrar'}
		</button>
	);
}

// ================= Empresa (criar/editar) =================

export function BusinessFormPage() {
	const { id } = useParams();
	const editing = Boolean(id);
	const { data: business, isLoading } = useBusiness(id);
	const { data: categories } = useCategories('BUSINESS');
	const createBusiness = useCreateBusiness();
	const updateBusiness = useUpdateBusiness();
	const navigate = useNavigate();
	const upload = useUpload('businesses');

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
		}
	}, [business]);

	if (editing && isLoading) {
		return <PageLoader />;
	}

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		const payload = {
			name,
			description,
			province,
			categoryId: categoryId || undefined,
			phone: phone || undefined,
			whatsapp: whatsapp || undefined,
			email: email || undefined,
			website: website || undefined,
			address: address || undefined,
			...(logo ? { logoUrl: logo.url, logoId: logo.cloudinaryId } : {}),
			...(cover
				? { coverUrl: cover.url, coverId: cover.cloudinaryId }
				: {}),
		};
		const mutation = editing ? updateBusiness : createBusiness;
		mutation.mutate(
			(editing ? { id: id!, ...payload } : payload) as never,
			{
				onSuccess: () => {
					toast.success(
						editing ? 'Empresa atualizada.' : 'Empresa registada.',
					);
					void navigate('/area/empresas');
				},
				onError: (err) => toast.error(getApiError(err)),
			},
		);
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
				<div className="grid gap-4 sm:grid-cols-2">
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
									{p.replace('_', ' ')}
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
				<div className="grid gap-4 sm:grid-cols-2">
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

				<div className="grid gap-4 sm:grid-cols-2">
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
								onFile={(f) =>
									upload
										.mutateAsync(f)
										.then(setLogo)
										.catch(() =>
											toast.error('Falha no envio.'),
										)
								}
							/>
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
								onFile={(f) =>
									upload
										.mutateAsync(f)
										.then(setCover)
										.catch(() =>
											toast.error('Falha no envio.'),
										)
								}
							/>
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
	const { id } = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [selectedPlan, setSelectedPlan] = useState(
		searchParams.get('plan') ?? '',
	);
	const [autoRenew, setAutoRenew] = useState(false);
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
								{plan.durationDays} dias · até{' '}
								{plan.businessVisibilityLimit} empresas ·{' '}
								{plan.featuredAdsLimit} destaques
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

			<label className="flex items-center gap-2 text-sm font-bold">
				<input
					type="checkbox"
					checked={autoRenew}
					onChange={(e) => setAutoRenew(e.target.checked)}
				/>
				Renovação automática
			</label>

			<button
				className="btn-primary"
				disabled={!selectedPlan || createPayment.isPending}
				onClick={() =>
					createPayment.mutate(
						{ businessId: id!, planId: selectedPlan, autoRenew },
						{
							onSuccess: (payment) => {
								toast.success(
									'Pedido criado. Envia o comprovativo.',
								);
								void navigate(
									`/area/pagamentos?pay=${payment.id}`,
								);
							},
							onError: (err) => toast.error(getApiError(err)),
						},
					)
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
	const { data, isLoading } = useWishlist(1);
	return (
		<div>
			<Title>Favoritos</Title>
			{isLoading ? (
				<PageLoader />
			) : !data || data.items.length === 0 ? (
				<EmptyState
					title="Sem favoritos ainda"
					description="Toca na estrela num anúncio para o guardar aqui."
				/>
			) : (
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
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
	const chatStore = useChatStore();
	const scrollRef = useRef<HTMLDivElement>(null);
	const typing = activeId
		? chatStore.typingByConversation[activeId]
		: undefined;

	useEffect(() => {
		chatStore.setOpenConversation(activeId);
		return () => chatStore.setOpenConversation(null);
	}, [activeId, chatStore]);

	useEffect(() => {
		if (activeId) {
			markRead.mutate(activeId);
			chatStore.clearUnread(activeId);
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
				<PageLoader />
			) : !convos || convos.items.length === 0 ? (
				<EmptyState
					title="Sem conversas"
					description="Manda uma mensagem a um vendedor a partir de um anúncio ou empresa."
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
											? chatStore.presence[
													c.other?.id ?? ''
												]
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
										send.mutate(
											{
												conversationId: activeId,
												content: text,
											},
											{
												onSuccess: () => {
													setText('');
													void refetch();
												},
												onError: (err) =>
													toast.error(
														getApiError(err),
													),
											},
										);
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
	const [, setSearchParams] = useSearchParams();
	const { data: payments, isLoading } = useMyPayments();
	const submitProof = useSubmitPaymentProof();
	const cancelPayment = useCancelPayment();
	const { data: plans } = usePlans();
	const upload = useUpload('payments');
	const [proof, setProof] = useState<MediaAsset | null>(null);

	const sendProof = (id: string) => {
		if (!proof) {
			toast.error('Anexa o comprovativo.');
			return;
		}
		submitProof.mutate(
			{ id, proofUrl: proof.url, proofId: proof.cloudinaryId },
			{
				onSuccess: () => {
					toast.success('Comprovativo enviado. Fica em análise.');
					setProof(null);
					setSearchParams({});
				},
				onError: (err) => toast.error(getApiError(err)),
			},
		);
	};

	return (
		<div>
			<Title>Pagamentos</Title>
			{isLoading ? (
				<PageLoader />
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
										<img
											src={proof.url}
											alt="Comprovativo"
											className="h-14 w-16 rounded-lg object-cover"
										/>
									)}
									<FilePicker
										busy={upload.isPending}
										onFile={(f) =>
											upload
												.mutateAsync(f)
												.then(setProof)
												.catch(() =>
													toast.error(
														'Falha no envio do comprovativo.',
													),
												)
										}
									/>
									<button
										className="btn-primary"
										onClick={() => sendProof(p.id)}
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
											cancelPayment.mutate(p.id, {
												onError: (e) =>
													toast.error(getApiError(e)),
											})
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
							{(plans?.platformAccounts ?? []).map((acc, i) => (
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

// ================= KYC =================

export function KycPage() {
	const { data: kyc } = useMyKyc();
	const submitKyc = useSubmitKyc();
	const upload = useUpload('kyc');
	const [biFront, setBiFront] = useState<MediaAsset | null>(null);
	const [biBack, setBiBack] = useState<MediaAsset | null>(null);
	const [selfie, setSelfie] = useState<MediaAsset | null>(null);

	const canSubmit = biFront && biBack && selfie;

	const submit = () => {
		if (!canSubmit) {
			toast.error('Envia a frente e o verso do BI e uma selfie.');
			return;
		}
		submitKyc.mutate(
			{
				biFrontUrl: biFront.url,
				biFrontId: biFront.cloudinaryId,
				biBackUrl: biBack.url,
				biBackId: biBack.cloudinaryId,
				selfies: [selfie],
			},
			{
				onSuccess: () =>
					toast.success(
						'Documentos enviados. A análise leva até 48h.',
					),
				onError: (err) => toast.error(getApiError(err)),
			},
		);
	};

	if (kyc?.status === 'APPROVED') {
		return (
			<div className="card p-8 text-center">
				<p className="text-4xl">✔</p>
				<h1 className="mt-3 font-display text-xl font-black text-green-700">
					Conta verificada
				</h1>
				<p className="mt-1 text-sm text-ink/60">
					Verificado em {formatDate(kyc.verifiedAt)}.
				</p>
			</div>
		);
	}

	if (kyc?.status === 'PENDING') {
		return (
			<div className="card p-8 text-center">
				<p className="text-4xl">⏳</p>
				<h1 className="mt-3 font-display text-xl font-black">
					Em análise
				</h1>
				<p className="mt-1 text-sm text-ink/60">
					Os teus documentos estão a ser verificados.
				</p>
			</div>
		);
	}

	return (
		<div>
			<Title>Verificação de identidade (KYC)</Title>
			{kyc?.status === 'REJECTED' && (
				<div className="mb-4 rounded-2xl bg-red/10 p-4 text-sm text-red">
					<strong>Rejeitado:</strong>{' '}
					{kyc.rejectionReason ??
						'Documentos ilegíveis. Tenta novamente.'}
				</div>
			)}
			<div className="grid max-w-2xl gap-4 sm:grid-cols-3">
				<KycSlot
					label="Frente do BI"
					asset={biFront}
					busy={upload.isPending}
					onFile={(f) =>
						upload
							.mutateAsync(f)
							.then(setBiFront)
							.catch(() => toast.error('Falha no envio.'))
					}
				/>
				<KycSlot
					label="Verso do BI"
					asset={biBack}
					busy={upload.isPending}
					onFile={(f) =>
						upload
							.mutateAsync(f)
							.then(setBiBack)
							.catch(() => toast.error('Falha no envio.'))
					}
				/>
				<KycSlot
					label="Selfie"
					asset={selfie}
					busy={upload.isPending}
					onFile={(f) =>
						upload
							.mutateAsync(f)
							.then(setSelfie)
							.catch(() => toast.error('Falha no envio.'))
					}
				/>
			</div>
			<button
				className="btn-primary mt-6"
				disabled={!canSubmit || submitKyc.isPending}
				onClick={submit}
			>
				{submitKyc.isPending && <ButtonLoader />} Enviar para
				verificação
			</button>
		</div>
	);
}

function KycSlot({
	label,
	asset,
	busy,
	onFile,
}: {
	label: string;
	asset: MediaAsset | null;
	busy: boolean;
	onFile: (f: File) => void;
}) {
	return (
		<div>
			<label className="label">{label}</label>
			{asset ? (
				<img
					src={asset.url}
					alt={label}
					className="h-36 w-full rounded-xl object-cover"
				/>
			) : (
				<div className="flex h-36 w-full items-center justify-center rounded-2xl border-2 border-dashed border-ink/20 bg-white">
					<FilePicker busy={busy} onFile={onFile} />
				</div>
			)}
		</div>
	);
}

// ================= Definições =================

export function SettingsPage() {
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
	const changeEmail = useChangeEmail();
	const revokeSession = useRevokeSession();
	const unlinkGoogle = useUnlinkAccount();
	const [sessions, setSessions] = useState<
		{ id: string; provider: string; token: string; createdAt: string }[]
	>([]);
	const [showSessions, setShowSessions] = useState(false);

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
		setShowSessions(true);
		httpGetSessions()
			.then((res) => {
				const items = Array.isArray(res)
					? res
					: ((res as { sessions?: unknown[] }).sessions ?? []);
				setSessions(
					items.map((s: any) => ({
						id: s.id ?? s.token ?? '-',
						provider: s.ipAddress ?? 'Sessão',
						token: s.token,
						createdAt: s.createdAt,
					})),
				);
			})
			.catch(() => toast.error('Não foi possível carregar as sessões.'));
	};

	return (
		<div>
			<Title>Definições</Title>
			<div className="flex flex-col gap-6">
				<section className="card gap-4 p-6">
					<h2 className="font-display text-sm font-black">
						Perfil público
					</h2>
					<div className="grid gap-4 sm:grid-cols-2">
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
							updateProfile.mutate(
								{
									name: profile.name,
									surname: profile.surname,
									phone: profile.phone || undefined,
								},
								{
									onSuccess: () =>
										toast.success('Perfil atualizado.'),
									onError: (err) =>
										toast.error(getApiError(err)),
								},
							)
						}
					>
						Guardar perfil
					</button>
				</section>

				{hasPassword && (
					<section className="card gap-4 p-6">
						<h2 className="font-display text-sm font-black">
							Alterar palavra-passe
						</h2>
						<div className="grid gap-4 sm:grid-cols-2">
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
								changePassword.mutate(
									{
										currentPassword: pw.current,
										newPassword: pw.next,
									},
									{
										onSuccess: () => {
											toast.success(
												'Palavra-passe alterada.',
											);
											setPw({
												current: '',
												next: '',
												confirm: '',
											});
										},
										onError: (err) =>
											toast.error(getApiError(err)),
									},
								);
							}}
						>
							Alterar
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
								changeEmail.mutate(newEmail, {
									onSuccess: () =>
										toast.success(
											'Pedido enviado. Confirma o novo email.',
										),
									onError: (err) =>
										toast.error(getApiError(err)),
								})
							}
						>
							Atualizar
						</button>
					</div>
				</section>

				<section className="card gap-4 p-6">
					<h2 className="font-display text-sm font-black">
						Contas e sessões
					</h2>
					{isGoogle && (
						<div className="flex items-center justify-between rounded-xl bg-snow p-3">
							<span className="text-sm font-bold">
								Ligado com Google
							</span>
							<button
								className="btn-ghost !text-red"
								disabled={!hasPassword}
								onClick={() =>
									unlinkGoogle.mutate('google', {
										onSuccess: () =>
											toast.success(
												'Conta Google desligada.',
											),
										onError: (err) =>
											toast.error(getApiError(err)),
									})
								}
							>
								{!hasPassword
									? 'Define password primeiro'
									: 'Desligar'}
							</button>
						</div>
					)}
					{!showSessions ? (
						<button
							className="btn-outline max-w-fit"
							onClick={loadSessions}
						>
							Ver sessões ativas
						</button>
					) : (
						<div className="flex flex-col gap-2">
							{sessions.map((s) => (
								<div
									key={s.id}
									className="flex items-center justify-between rounded-xl bg-snow px-3 py-2 text-sm"
								>
									<span className="font-bold">
										{s.provider}
									</span>
									<span className="font-mono text-xs text-ink/50">
										{formatDateTime(s.createdAt)}
									</span>
									<button
										className="btn-ghost !text-red"
										onClick={() =>
											revokeSession.mutate(s.token, {
												onSuccess: () => {
													toast.success(
														'Sessão terminada.',
													);
													loadSessions();
												},
												onError: (err) =>
													toast.error(
														getApiError(err),
													),
											})
										}
									>
										Terminar
									</button>
								</div>
							))}
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
