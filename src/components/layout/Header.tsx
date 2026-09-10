import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Avatar } from '../ui/Avatar';
import { Spinner } from '../ui/Spinner';
import { useSession } from '../../hooks/useSession';
import { useLogout } from '../../hooks/mutations';
import { useChatStore } from '../../store/chat';
import { fullName } from '../../lib/format';

export function Header() {
	const navigate = useNavigate();
	const { user, isAuthenticated, isLoading } = useSession();
	const logout = useLogout();
	const [menuOpen, setMenuOpen] = useState(false);
	const [search, setSearch] = useState('');
	const menuRef = useRef<HTMLDivElement>(null);
	const totalUnread = useChatStore((s) =>
		Object.values(s.unreadByConversation).reduce((a, b) => a + b, 0),
	);

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
			void navigate(`/busca?q=${encodeURIComponent(search.trim())}`);
		}
	};

	return (
		<header className="sticky top-0 z-40 border-b border-ink/10 bg-snow/90 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
				<Logo />
				<form
					onSubmit={submitSearch}
					className="hidden flex-1 max-w-sm items-center md:flex"
				>
					<input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Pesquisar produtos, serviços, empresas…"
						className="input !rounded-full !py-2"
						aria-label="Pesquisar"
					/>
				</form>
				<nav className="hidden items-center gap-4 text-sm font-bold text-ink/70 lg:flex">
					<Link to="/anuncios" className="hover:text-red">
						Anúncios
					</Link>
					<Link to="/empresas" className="hover:text-blue">
						Empresas
					</Link>
					<Link to="/planos" className="hover:text-ink">
						Planos
					</Link>
				</nav>

				<div className="flex items-center gap-2">
					{isLoading ? (
						<span className="text-blue">
							<Spinner size={20} />
						</span>
					) : isAuthenticated && user ? (
						<div className="relative" ref={menuRef}>
							{user.role !== 'USER' && (
								<Link
									to="/admin"
									className="btn-blue mr-1 hidden sm:inline-flex"
								>
									Admin
								</Link>
							)}
							<Link
								to="/area/mensagens"
								className="relative mr-1 hidden items-center rounded-xl p-2 text-sm font-bold text-ink/70 hover:bg-ink/5 sm:flex"
								aria-label="Mensagens"
							>
								✉
								{totalUnread > 0 && (
									<span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red px-1 font-mono text-[10px] font-bold text-white">
										{totalUnread}
									</span>
								)}
							</Link>
							<button
								type="button"
								className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-ink/5"
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
											{fullName(user.name, user.surname)}
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
											to="/area/anuncios"
											className="px-4 py-2 hover:bg-snow"
										>
											Meus anúncios
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
											className="px-4 py-2 text-left text-red hover:bg-snow"
											onClick={() =>
												logout.mutate(undefined, {
													onSettled: () =>
														navigate('/'),
												})
											}
										>
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
								className="btn-ghost hidden sm:inline-flex"
							>
								Entrar
							</Link>
							<Link to="/auth/registar" className="btn-primary">
								Começar
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
