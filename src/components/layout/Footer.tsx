import { Logo } from './Logo';

export function Footer() {
	return (
		<footer className="mt-16 border-t border-ink/10 bg-ink text-snow">
			<div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
				<div className="md:col-span-2">
					<Logo />
					<p className="mt-3 max-w-sm text-sm text-snow/60">
						A plataforma que leva o seu negócio a outro nível em
						Angola. Divulgue serviços, venda produtos e destaque o
						seu estabelecimento.
					</p>
				</div>
				<div className="flex flex-col gap-2 text-sm">
					<p className="font-display text-xs font-bold uppercase tracking-widest text-kwanza">
						Plataforma
					</p>
					<a
						href="/anuncios"
						className="text-snow/70 hover:text-white"
					>
						Anúncios
					</a>
					<a
						href="/empresas"
						className="text-snow/70 hover:text-white"
					>
						Empresas
					</a>
					<a href="/planos" className="text-snow/70 hover:text-white">
						Planos
					</a>
					<a href="/busca" className="text-snow/70 hover:text-white">
						Pesquisa
					</a>
				</div>
				<div className="flex flex-col gap-2 text-sm">
					<p className="font-display text-xs font-bold uppercase tracking-widest text-kwanza">
						Utilizador
					</p>
					<a
						href="/auth/entrar"
						className="text-snow/70 hover:text-white"
					>
						Entrar
					</a>
					<a
						href="/auth/registar"
						className="text-snow/70 hover:text-white"
					>
						Criar conta
					</a>
					<a href="/area" className="text-snow/70 hover:text-white">
						Minha conta
					</a>
				</div>
			</div>
			<div className="border-t border-white/10 py-5">
				<p className="mx-auto max-w-6xl px-4 text-center font-mono text-xs text-snow/40">
					© {new Date().getFullYear()} Caxinda Divulga — Feito em
					Angola 🇦🇴
				</p>
			</div>
		</footer>
	);
}
