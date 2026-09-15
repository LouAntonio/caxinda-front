import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Avatar } from '../ui/Avatar';
import { Spinner } from '../ui/Spinner';
import { EnvelopeSVG } from '../ui/icons/EnvelopeSVG';
import { Drawer } from '../ui/Drawer';
import { useSession } from '../../hooks/useSession';
import { useLogout } from '../../hooks/mutations';
import { useChatStore } from '../../store/chat';
import { fullName } from '../../lib/format';

function SearchSVG({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.35-4.35" />
		</svg>
	);
}

function GridIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<rect x="3" y="3" width="7" height="7" rx="1" />
			<rect x="14" y="3" width="7" height="7" rx="1" />
			<rect x="14" y="14" width="7" height="7" rx="1" />
			<rect x="3" y="14" width="7" height="7" rx="1" />
		</svg>
	);
}

function BoxIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
			<path d="m3.3 7 8.7 5 8.7-5" />
			<path d="M12 22V12" />
		</svg>
	);
}

function StoreIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
			<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
			<path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
			<path d="M2 7h20" />
			<path d="M22 7v3a2 2 0 0 1-4 0a2 2 0 0 1-4 0a2 2 0 0 1-4 0a2 2 0 0 1-4 0a2 2 0 0 1-4 0V7" />
		</svg>
	);
}

function CheckIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="3"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	);
}

const SEARCH_TYPES = [
	{ value: 'all', label: 'Todos', icon: GridIcon, color: 'text-ink/50' },
	{ value: 'AD', label: 'Produtos', icon: BoxIcon, color: 'text-red' },
	{
		value: 'BUSINESS',
		label: 'Empresas',
		icon: StoreIcon,
		color: 'text-blue',
	},
] as const;

const SEARCH_TYPE_LABELS: Record<string, string> = {
	all: 'Todos',
	AD: 'Produtos',
	BUSINESS: 'Empresas',
};

export function Header() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { user, isAuthenticated, isLoading } = useSession();
	const logout = useLogout();
	const [menuOpen, setMenuOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [searchType, setSearchType] = useState('all');
	const [searchMenuOpen, setSearchMenuOpen] = useState(false);
	const searchMenuRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const totalUnread = useChatStore((s) =>
		Object.values(s.unreadByConversation).reduce((a, b) => a + b, 0),
	);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 0);
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	const isHome = pathname === '/';
	const showTransparent = isHome && !scrolled;

	useEffect(() => {
		setScrolled(false);
	}, [pathname]);

	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(e.target as Node)
			) {
				setMenuOpen(false);
			}
		};
		document.addEventListener('mousedown', onClick);
		return () => document.removeEventListener('mousedown', onClick);
	}, []);

	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (
				searchMenuRef.current &&
				!searchMenuRef.current.contains(e.target as Node)
			) {
				setSearchMenuOpen(false);
			}
		};
		document.addEventListener('mousedown', onClick);
		return () => document.removeEventListener('mousedown', onClick);
	}, []);

	const submitSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (search.trim()) {
			const params = new URLSearchParams({ q: search.trim() });
			if (searchType !== 'all') params.set('type', searchType);
			void navigate(`/busca?${params.toString()}`);
		}
	};

	const onLogout = () => {
		logout.mutate(undefined, {
			onSettled: () => {
				useChatStore.getState().reset();
				navigate('/');
				setDrawerOpen(false);
			},
		});
	};

	return (
		<>
			<header
				className={`sticky top-0 z-40 transition-colors duration-200 ${
					showTransparent
						? 'bg-transparent'
						: 'border-b border-ink/10 bg-white'
				}`}
			>
				<div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
					<Logo variant={showTransparent ? 'dark' : 'default'} />
					<form onSubmit={submitSearch} className="relative flex-1">
						<div
							className={`flex items-center rounded-full border-2 transition-colors ${
								showTransparent
									? 'border-white/30 bg-white/15'
									: 'border-ink/15 bg-white'
							}`}
						>
							<SearchSVG
								className={`ml-3 h-4 w-4 shrink-0 ${
									showTransparent
										? 'text-white/50'
										: 'text-ink/40'
								}`}
							/>
							<div
								className="relative z-20 shrink-0"
								ref={searchMenuRef}
							>
								<button
									type="button"
									onClick={() =>
										setSearchMenuOpen((v) => !v)
									}
									onKeyDown={(e) => {
										if (e.key === 'Escape')
											setSearchMenuOpen(false);
									}}
									aria-haspopup="listbox"
									aria-expanded={searchMenuOpen}
									className={`mx-1.5 flex items-center gap-1.5 rounded-lg py-1.5 pl-2.5 pr-2 text-xs font-bold transition ${
										showTransparent
											? 'bg-white/15 text-white hover:bg-white/25'
											: 'bg-ink/5 text-ink hover:bg-ink/10'
									}`}
								>
									{SEARCH_TYPE_LABELS[searchType]}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="3"
										strokeLinecap="round"
										strokeLinejoin="round"
										className={`h-3 w-3 transition-transform ${
											searchMenuOpen
												? 'rotate-180'
												: ''
										} text-kwanza`}
									>
										<path d="m6 9 6 6 6-6" />
									</svg>
								</button>
								{searchMenuOpen && (
									<div
										role="listbox"
										className="absolute left-1/2 top-full mt-2 w-44 -translate-x-1/2 rounded-xl border border-ink/10 bg-white p-1 shadow-xl"
									>
										{SEARCH_TYPES.map((opt) => (
											<button
												key={opt.value}
												type="button"
												role="option"
												aria-selected={
													searchType === opt.value
												}
												onClick={() => {
													setSearchType(opt.value);
													setSearchMenuOpen(false);
												}}
												className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
													searchType === opt.value
														? 'bg-snow text-ink'
														: 'text-ink/60 hover:bg-snow'
												}`}
											>
												<opt.icon
													className={`h-4 w-4 ${opt.color}`}
												/>
												<span className="flex-1">
													{opt.label}
												</span>
												{searchType === opt.value && (
													<CheckIcon className="h-3.5 w-3.5 text-kwanza" />
												)}
											</button>
										))}
									</div>
								)}
							</div>
							<div
								className={`h-5 w-px shrink-0 ${
									showTransparent
										? 'bg-white/20'
										: 'bg-ink/15'
								}`}
							/>
							<input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Pesquisar…"
								className={`flex-1 bg-transparent px-3 py-2.5 text-sm font-medium outline-none placeholder:font-normal ${
									showTransparent
										? 'text-white placeholder:text-white/50'
										: 'text-ink placeholder:text-ink/40'
								}`}
								aria-label="Pesquisar"
							/>
							{search.length > 0 && (
								<button
									type="button"
									onClick={() => setSearch('')}
									className={`mr-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
										showTransparent
											? 'bg-white/20 text-white hover:bg-white/30'
											: 'bg-ink/10 text-ink/60 hover:bg-ink/20'
									}`}
									aria-label="Limpar pesquisa"
								>
									✕
								</button>
							)}
						</div>
					</form>
					<nav
						className={`hidden items-center gap-4 text-sm font-bold lg:flex ${
							showTransparent ? 'text-white/70' : 'text-ink/70'
						}`}
					>
						<Link
							to="/produtos"
							className={
								showTransparent
									? 'hover:text-white'
									: 'hover:text-red'
							}
						>
							Produtos
						</Link>
						<Link
							to="/empresas"
							className={
								showTransparent
									? 'hover:text-white'
									: 'hover:text-blue'
							}
						>
							Empresas
						</Link>
						<Link
							to="/contactos"
							className={
								showTransparent
									? 'hover:text-white'
									: 'hover:text-kwanza'
							}
						>
							Contacto
						</Link>
					</nav>

					<div className="flex items-center gap-2">
						{isLoading ? (
							<span className="text-blue">
								<Spinner size={20} />
							</span>
						) : isAuthenticated && user ? (
							<div
								className="relative flex items-center gap-2"
								ref={menuRef}
							>
								{user.role !== 'USER' && (
									<Link
										to="/admin"
										className="btn-blue hidden sm:inline-flex"
									>
										Admin
									</Link>
								)}
								<Link
									to="/area/mensagens"
									className={`relative hidden items-center rounded-xl p-2 text-sm font-bold sm:flex ${
										showTransparent
											? 'text-white/70 hover:bg-white/10'
											: 'text-ink/70 hover:bg-ink/5'
									}`}
									aria-label="Mensagens"
								>
									<EnvelopeSVG className="h-5 w-5" />
									{totalUnread > 0 && (
										<span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red px-1 font-mono text-[10px] font-bold text-white">
											{totalUnread}
										</span>
									)}
								</Link>
								<button
									type="button"
									className={`flex items-center gap-2 rounded-xl p-1.5 ${
										showTransparent
											? 'hover:bg-white/10'
											: 'hover:bg-ink/5'
									}`}
									onClick={() => setMenuOpen((v) => !v)}
								>
									<Avatar
										src={user.image}
										name={user.name}
										size="sm"
									/>
								</button>
								{menuOpen && (
									<div className="absolute right-0 top-12 w-56 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-lg">
										<div className="border-b border-ink/10 px-4 py-3">
											<p className="text-sm font-bold">
												{fullName(
													user.name,
													user.surname,
												)}
											</p>
											<p className="truncate text-xs text-ink/50">
												{user.email}
											</p>
										</div>
										<div className="flex flex-col py-1 text-sm font-semibold">
											<Link
												to="/area"
												className="px-4 py-2 hover:bg-snow"
											>
												Minha conta
											</Link>
											<Link
												to="/area/empresas"
												className="px-4 py-2 hover:bg-snow"
											>
												Minhas empresas
											</Link>
											<Link
												to="/area/favoritos"
												className="px-4 py-2 hover:bg-snow"
											>
												Favoritos
											</Link>
											<Link
												to="/area/mensagens"
												className="px-4 py-2 hover:bg-snow"
											>
												Mensagens
											</Link>
											<Link
												to="/area/definicoes"
												className="px-4 py-2 hover:bg-snow"
											>
												Definições
											</Link>
											{user.role !== 'USER' && (
												<Link
													to="/admin"
													className="px-4 py-2 hover:bg-snow"
												>
													Painel admin
												</Link>
											)}
											<button
												type="button"
												className="flex items-center gap-2 px-4 py-2 text-left text-red hover:bg-snow disabled:cursor-not-allowed disabled:opacity-50"
												disabled={logout.isPending}
												onClick={onLogout}
											>
												{logout.isPending && (
													<Spinner size={14} />
												)}
												Sair
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<>
								<Link
									to="/auth/entrar"
									className={`hidden sm:inline-flex ${
										showTransparent
											? 'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 bg-transparent text-white hover:bg-white/10'
											: 'btn-ghost'
									}`}
								>
									Entrar
								</Link>
								<Link
									to="/auth/registar"
									className="btn-primary"
								>
									Começar
								</Link>
							</>
						)}
						<div className="lg:hidden">
							<button
								type="button"
								className={`flex items-center gap-2 rounded-xl p-1.5 ${
									showTransparent
										? 'text-white hover:bg-white/10'
										: 'hover:bg-ink/5'
								}`}
								onClick={() => setDrawerOpen((v) => !v)}
								aria-label="Menu"
							>
								☰
							</button>
						</div>
					</div>
				</div>
			</header>
			<div>
				<Drawer
					open={drawerOpen}
					onClose={() => setDrawerOpen(false)}
					aria-label="Menu de navegação"
				>
					<div className="flex flex-col gap-2 p-4">
						<nav className="flex flex-col gap-3 text-sm font-bold">
							<Link
								to="/produtos"
								onClick={() => setDrawerOpen(false)}
								className="hover:text-red"
							>
								Produtos
							</Link>
							<Link
								to="/empresas"
								onClick={() => setDrawerOpen(false)}
								className="hover:text-blue"
							>
								Empresas
							</Link>
							<Link
								to="/contactos"
								onClick={() => setDrawerOpen(false)}
								className="hover:text-kwanza"
							>
								Contacto
							</Link>
						</nav>
						<div className="mt-4 border-t border-ink/10 pt-4">
							{isAuthenticated && user ? (
								<div className="flex flex-col gap-2 text-sm font-bold">
									<Link
										to="/area/mensagens"
										onClick={() => setDrawerOpen(false)}
										className="flex items-center gap-2"
									>
										<EnvelopeSVG className="h-5 w-5" />
										Mensagens
										{totalUnread > 0 && (
											<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red px-1 font-mono text-[10px] font-bold text-white">
												{totalUnread}
											</span>
										)}
									</Link>
									<button
										type="button"
										className="flex items-center gap-2 text-red disabled:cursor-not-allowed disabled:opacity-50"
										disabled={logout.isPending}
										onClick={onLogout}
									>
										{logout.isPending && (
											<Spinner size={14} />
										)}
										Sair
									</button>
								</div>
							) : (
								<div className="flex flex-col gap-2">
									<Link
										to="/auth/entrar"
										onClick={() => setDrawerOpen(false)}
										className="btn-ghost"
									>
										Entrar
									</Link>
									<Link
										to="/auth/registar"
										onClick={() => setDrawerOpen(false)}
										className="btn-primary"
									>
										Começar
									</Link>
								</div>
							)}
						</div>
					</div>
				</Drawer>
			</div>
		</>
	);
}
