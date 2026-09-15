import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function Footer() {
	return (
		<footer className="mt-8 border-t border-ink/10 bg-ink text-snow">
			<div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-5">
				<div className="md:col-span-2">
					<Logo variant="dark" />
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
					<Link
						to="/produtos"
						className="text-snow/70 hover:text-white"
					>
						Produtos
					</Link>
					<Link
						to="/empresas"
						className="text-snow/70 hover:text-white"
					>
						Empresas
					</Link>
					<Link
						to="/planos"
						className="text-snow/70 hover:text-white"
					>
						Planos
					</Link>
					<Link to="/busca" className="text-snow/70 hover:text-white">
						Pesquisa
					</Link>
				</div>
				<div className="flex flex-col gap-2 text-sm">
					<p className="font-display text-xs font-bold uppercase tracking-widest text-kwanza">
						Institucional
					</p>
					<Link to="/sobre" className="text-snow/70 hover:text-white">
						Sobre nós
					</Link>
					<Link
						to="/contactos"
						className="text-snow/70 hover:text-white"
					>
						Contactos
					</Link>
					<Link
						to="/termos"
						className="text-snow/70 hover:text-white"
					>
						Termos e condições
					</Link>
					<Link
						to="/politicas"
						className="text-snow/70 hover:text-white"
					>
						Política de privacidade
					</Link>
					<Link
						to="/cookies"
						className="text-snow/70 hover:text-white"
					>
						Política de cookies
					</Link>
				</div>
				<div className="flex flex-col gap-2 text-sm">
					<p className="font-display text-xs font-bold uppercase tracking-widest text-kwanza">
						Utilizador
					</p>
					<Link
						to="/auth/entrar"
						className="text-snow/70 hover:text-white"
					>
						Entrar
					</Link>
					<Link
						to="/auth/registar"
						className="text-snow/70 hover:text-white"
					>
						Criar conta
					</Link>
					<Link to="/area" className="text-snow/70 hover:text-white">
						Minha conta
					</Link>
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
