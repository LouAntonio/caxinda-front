import { Link, Outlet } from 'react-router-dom';
import { Logo } from './Logo';
import { useScrollToTop } from '../../hooks/useScrollToTop';

export function AuthLayout() {
	useScrollToTop();
	return (
		<div className="flex min-h-screen flex-col bg-snow lg:flex-row">
			<div className="relative hidden overflow-hidden bg-ink lg:flex lg:w-[45%] lg:flex-col">
				<div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
					<Logo variant="dark" />

					<div className="max-w-sm">
						<h2 className="font-display text-2xl font-black leading-tight text-white xl:text-3xl">
							A tua vitrine digital em Angola
						</h2>
						<p className="mt-4 text-sm leading-relaxed text-white/50">
							Publica anúncios, encontra empresas e cresce o teu
							negócio — tudo num só sítio.
						</p>
					</div>

					<p className="text-xs text-white/25">
						© {new Date().getFullYear()} Caxinda Divulga
					</p>
				</div>

				<div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rotate-45 rounded-3xl bg-kwanza/10" />
				<div className="pointer-events-none absolute right-32 top-20 h-20 w-20 rotate-12 rounded-2xl bg-red/15" />
				<div className="pointer-events-none absolute -left-20 bottom-1/2 h-40 w-40 rotate-12 rounded-3xl bg-blue/10" />
			</div>

			<div className="flex flex-1 flex-col">
				<div className="border-b border-ink/10 bg-white/50 lg:hidden">
					<div className="mx-auto flex h-16 max-w-md items-center justify-between px-4">
						<Logo />
						<Link to="/" className="btn-ghost">
							← Voltar
						</Link>
					</div>
				</div>

				<main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 lg:px-8">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
