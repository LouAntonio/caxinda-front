import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '../../hooks/useSession';
import { canCreateAds } from '../../lib/roles';
import { fullName } from '../../lib/format';
import { Avatar } from '../ui/Avatar';

const AREA_LINKS = [
	{ to: '/area', label: 'Visão geral', end: true },
	{ to: '/area/empresas', label: 'Minhas empresas' },
	{ to: '/area/subscricoes', label: 'Subscrições' },
	{ to: '/area/favoritos', label: 'Favoritos' },
	{ to: '/area/mensagens', label: 'Mensagens' },
	{ to: '/area/pagamentos', label: 'Pagamentos' },
	{ to: '/area/verificacao', label: 'Verificação KYC' },
	{ to: '/area/definicoes', label: 'Definições' },
];

const MY_ADS_LINK = {
	to: '/area/anuncios',
	label: 'Meus anúncios',
	end: false,
};

const ADMIN_LINKS = [
	{ to: '/admin', label: 'Dashboard', end: true },
	{ to: '/admin/anuncios', label: 'Anúncios' },
	{ to: '/admin/empresas', label: 'Empresas' },
	{ to: '/admin/utilizadores', label: 'Utilizadores' },
	{ to: '/admin/pagamentos', label: 'Pagamentos' },
	{ to: '/admin/denuncias', label: 'Denúncias' },
	{ to: '/admin/kyc', label: 'KYC' },
	{ to: '/admin/suporte', label: 'Suporte' },
	{ to: '/admin/categorias', label: 'Categorias' },
	{ to: '/admin/planos', label: 'Planos' },
	{ to: '/admin/analiticas', label: 'Analíticas' },
];

export function AreaLayout({ admin = false }: { admin?: boolean }) {
	const { user } = useSession();
	const location = useLocation();
	const links = admin
		? ADMIN_LINKS
		: canCreateAds(user?.role)
			? [AREA_LINKS[0], MY_ADS_LINK, ...AREA_LINKS.slice(1)]
			: AREA_LINKS;

	const header = admin ? 'Painel Admin' : 'Minha Conta';
	const backLink = admin ? '/area' : null;
	const backLabel = admin ? 'Voltar à minha conta' : null;

	return (
		<div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[230px_1fr]">
			<aside>
				{user && (
					<div className="mb-4 flex items-center gap-3 rounded-2xl border border-ink/10 bg-white p-3">
						<Avatar src={user.image} name={user.name} size="md" />
						<div className="min-w-0">
							<p className="truncate text-sm font-bold">
								{fullName(user.name, user.surname)}
							</p>
							<p className="truncate text-xs text-ink/50">
								{user.email}
							</p>
						</div>
					</div>
				)}
				<nav className="flex flex-col gap-1 rounded-2xl border border-ink/10 bg-white p-2">
					<p className="px-3 pb-1 pt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink/40">
						{header}
					</p>
					{backLink && (
						<NavLink
							to={backLink}
							className="rounded-xl px-3 py-2 text-sm font-bold text-blue hover:bg-snow"
						>
							← {backLabel}
						</NavLink>
					)}
					{links.map((link) => (
						<NavLink
							key={link.to}
							to={link.to}
							end={link.end}
							className={({ isActive }) =>
								`rounded-xl px-3 py-2 text-sm font-semibold transition ${
									isActive
										? link.to.startsWith('/admin')
											? 'bg-blue text-white'
											: 'bg-red text-white'
										: 'text-ink/70 hover:bg-snow hover:text-ink'
								}`
							}
						>
							{link.label}
						</NavLink>
					))}
					<a
						href="/"
						className="rounded-xl px-3 py-2 text-sm font-bold text-ink/40 hover:bg-snow"
					>
						← Ver o site
					</a>
				</nav>
			</aside>
			<section className="min-w-0">
				<Outlet key={location.pathname} />
			</section>
		</div>
	);
}
