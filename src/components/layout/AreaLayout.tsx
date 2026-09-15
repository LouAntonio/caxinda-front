import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '../../hooks/useSession';
import { useMyKyc } from '../../hooks/queries';
import { fullName } from '../../lib/format';
import { Avatar } from '../ui/Avatar';
import { Logo } from './Logo';
import { PanelIcon, type PanelIconName } from '../ui/icons/PanelIcons';

type PanelLink = {
	to: string;
	label: string;
	icon: PanelIconName;
	end?: boolean;
	isConversion?: boolean;
};
type PanelSection = { title: string; links: PanelLink[] };

const ADMIN_SECTIONS: PanelSection[] = [
	{
		title: 'Visão geral',
		links: [
			{ to: '/admin', label: 'Dashboard', icon: 'grid', end: true },
			{ to: '/admin/analiticas', label: 'Analíticas', icon: 'chart' },
		],
	},
	{
		title: 'Moderação',
		links: [
			{ to: '/admin/denuncias', label: 'Denúncias', icon: 'flag' },
			{ to: '/admin/kyc', label: 'KYC', icon: 'id' },
			{ to: '/admin/anuncios', label: 'Anúncios', icon: 'megaphone' },
			{ to: '/admin/empresas', label: 'Empresas', icon: 'building' },
		],
	},
	{
		title: 'Gestão',
		links: [
			{ to: '/admin/utilizadores', label: 'Utilizadores', icon: 'users' },
			{ to: '/admin/pagamentos', label: 'Pagamentos', icon: 'card' },
			{ to: '/admin/suporte', label: 'Suporte', icon: 'lifebuoy' },
			{ to: '/admin/categorias', label: 'Categorias', icon: 'tag' },
			{ to: '/admin/planos', label: 'Planos', icon: 'layers' },
			{
				to: '/admin/contas-bancarias',
				label: 'Contas bancárias',
				icon: 'bank',
			},
		],
	},
];

function buildAreaSections(
	verified: boolean,
	kycStatus: 'APPROVED' | 'PENDING' | 'REJECTED' | undefined,
): PanelSection[] {
	const verificationLabel = verified
		? 'Conta Empresarial ✓'
		: kycStatus === 'PENDING'
			? 'Conversão em análise'
			: 'Converter para conta Empresarial';

	return [
		{
			title: 'Conta',
			links: [
				{ to: '/area', label: 'Visão geral', icon: 'grid', end: true },
				...(verified
					? [
							{
								to: '/area/empresas',
								label: 'Minhas empresas',
								icon: 'building' as const,
							},
							{
								to: '/area/subscricoes',
								label: 'Subscrições',
								icon: 'layers' as const,
							},
							{
								to: '/area/pagamentos',
								label: 'Pagamentos',
								icon: 'card' as const,
							},
						]
					: []),
			],
		},
		{
			title: 'Conteúdo',
			links: [
				{ to: '/area/favoritos', label: 'Favoritos', icon: 'heart' },
				{ to: '/area/mensagens', label: 'Mensagens', icon: 'chat' },
			],
		},
		{
			title: 'Conta Empresarial',
			links: [
				{
					to: '/area/verificacao',
					label: verificationLabel,
					icon: 'shield',
					isConversion: !verified,
				},
			],
		},
		{
			title: '',
			links: [
				{ to: '/area/definicoes', label: 'Definições', icon: 'gear' },
			],
		},
	];
}

export function AreaLayout({ admin = false }: { admin?: boolean }) {
	const { user } = useSession();
	const { data: kyc } = useMyKyc();
	const location = useLocation();

	const verified = Boolean(user && (user.isVerified || user.role !== 'USER'));
	const sections = admin
		? ADMIN_SECTIONS
		: buildAreaSections(verified, kyc?.status);

	const allLinks = sections.flatMap((s) => s.links);
	const accentTile = admin ? 'bg-blue' : 'bg-red';

	const badge = admin
		? null
		: verified
			? {
					label: 'Conta Empresarial',
					cls: 'bg-green-500/15 text-green-400',
				}
			: kyc?.status === 'PENDING'
				? { label: 'Em análise', cls: 'bg-kwanza/15 text-kwanza' }
				: kyc?.status === 'REJECTED'
					? { label: 'Rejeitado', cls: 'bg-red/15 text-red-light' }
					: {
							label: 'Conta pessoal',
							cls: 'bg-white/10 text-white/50',
						};

	const desktopLinkClass = (link: PanelLink, isActive: boolean) =>
		`group flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition ${
			isActive
				? 'bg-white/5 text-white'
				: link.isConversion
					? 'text-kwanza'
					: 'text-white/60 hover:bg-white/5 hover:text-white'
		}`;

	const linkTileClass = (link: PanelLink, isActive: boolean) =>
		`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
			isActive
				? `${accentTile} text-white`
				: link.isConversion
					? 'bg-kwanza/15 text-kwanza group-hover:bg-kwanza/25'
					: 'bg-white/10 text-white/50 group-hover:bg-white/15 group-hover:text-white'
		}`;

	const mobileClass = (isActive: boolean, link: PanelLink) =>
		`shrink-0 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-bold transition ${
			isActive
				? 'bg-white/10 text-white'
				: link.isConversion
					? 'text-kwanza'
					: 'text-white/60'
		}`;

	return (
		<div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
			{/* ── Mobile: strip horizontal ── */}
			<nav className="nice-scroll -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 md:hidden">
				{admin && (
					<NavLink
						to="/area"
						className="shrink-0 whitespace-nowrap rounded-xl bg-white/5 px-3 py-2 text-xs font-bold text-blue-light hover:bg-white/10"
					>
						← Minha conta
					</NavLink>
				)}
				{allLinks.map((link) => (
					<NavLink
						key={link.to}
						to={link.to}
						end={link.end}
						className={({ isActive }) =>
							mobileClass(isActive, link)
						}
					>
						{link.label}
					</NavLink>
				))}
				<a
					href="/"
					className="shrink-0 whitespace-nowrap rounded-xl bg-white/5 px-3 py-2 text-xs font-bold text-white/50 hover:bg-white/10"
				>
					Ver o site
				</a>
			</nav>

			<div className="grid gap-6 md:grid-cols-[260px_1fr] md:items-start">
				{/* ── Desktop: sidebar dark ── */}
				<aside className="hidden md:block">
					<div className="sticky top-20 rounded-2xl bg-ink p-4 shadow-[0_16px_40px_rgba(14,23,51,0.25)]">
						<div className="px-1">
							<Logo variant="dark" />
						</div>
						<hr className="mx-1 my-4 border-white/10" />

						{admin ? (
							<div className="mb-4 flex items-center justify-between gap-2 rounded-xl bg-white/5 p-3">
								<p className="truncate font-display text-sm font-black text-white">
									Painel Admin
								</p>
								<span className="shrink-0 rounded-full bg-blue px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-white">
									{user?.role ?? 'Admin'}
								</span>
							</div>
						) : (
							user && (
								<div className="mb-4 rounded-xl bg-white/5 p-3">
									<div className="flex items-center gap-3">
										<Avatar
											src={user.image}
											name={user.name}
											size="md"
										/>
										<div className="min-w-0">
											<p className="truncate text-sm font-bold text-white">
												{fullName(
													user.name,
													user.surname,
												)}
											</p>
											<p className="truncate text-xs text-white/50">
												{user.email}
											</p>
										</div>
									</div>
									{badge && (
										<span
											className={`mt-3 inline-flex rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${badge.cls}`}
										>
											{badge.label}
										</span>
									)}
								</div>
							)
						)}

						<nav className="flex flex-col pb-2">
							{sections.map((section) => (
								<div
									key={section.title || section.links[0].to}
									className="flex flex-col"
								>
									{section.title && (
										<p className="px-3 pb-1 pt-4 font-mono text-[10px] font-bold uppercase tracking-widest text-white/30">
											{section.title}
										</p>
									)}
									{section.links.map((link) => (
										<NavLink
											key={link.to}
											to={link.to}
											end={link.end}
											className={({ isActive }) =>
												desktopLinkClass(link, isActive)
											}
										>
											{({ isActive }) => (
												<>
													<span
														className={linkTileClass(
															link,
															isActive,
														)}
													>
														<PanelIcon
															name={link.icon}
															size={16}
														/>
													</span>
													<span className="text-sm font-semibold">
														{link.label}
													</span>
												</>
											)}
										</NavLink>
									))}
								</div>
							))}
						</nav>

						{admin ? (
							<NavLink
								to="/area"
								className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white/40 transition hover:bg-white/5 hover:text-white"
							>
								← Minha conta
							</NavLink>
						) : (
							<a
								href="/"
								className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white/40 transition hover:bg-white/5 hover:text-white"
							>
								← Ver o site
							</a>
						)}
					</div>
				</aside>

				<section className="min-w-0">
					<Outlet key={location.pathname} />
				</section>
			</div>
		</div>
	);
}
