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

export function Header() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { user, isAuthenticated, isLoading } = useSession();
	const logout = useLogout();
	const [menuOpen, setMenuOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [searchType, setSearchType] = useState('all');
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
							className={`flex items-center overflow-hidden rounded-full border-2 transition-colors ${
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
							<div className="relative shrink-0">
								<select
									value={searchType}
									onChange={(e) =>
										setSearchType(e.target.value)
									}
									className={`cursor-pointer appearance-none bg-transparent py-2.5 pl-2 pr-5 text-xs font-bold outline-none ${
										showTransparent
											? 'text-white/70'
											: 'text-ink/70'
									}`}
								>
									<option value="all">Todos</option>
									<option value="AD">Produtos</option>
									<option value="BUSINESS">Empresas</option>
								</select>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="3"
									strokeLinecap="round"
									strokeLinejoin="round"
									className={`pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 ${
										showTransparent
											? 'text-white/50'
											: 'text-ink/40'
									}`}
								>
									<path d="m6 9 6 6 6-6" />
								</svg>
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
