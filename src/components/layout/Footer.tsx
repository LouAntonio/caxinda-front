import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ArrowRightSVG } from '../ui/icons/ArrowRightSVG';
import { EnvelopeSVG } from '../ui/icons/EnvelopeSVG';
import { FacebookSVG } from '../ui/icons/FacebookSVG';
import { InstagramSVG } from '../ui/icons/InstagramSVG';
import { LinkedInSVG } from '../ui/icons/LinkedInSVG';
import { TikTokSVG } from '../ui/icons/TikTokSVG';
import { WhatsAppSVG } from '../ui/icons/WhatsAppSVG';

const CONTACTS = [
	{
		label: 'geral@caxindadivulga.com',
		href: 'mailto:geral@caxindadivulga.com',
	},
	{
		label: 'suporte@caxindadivulga.com',
		href: 'mailto:suporte@caxindadivulga.com',
	},
	{
		label: 'parcerias@caxindadivulga.com',
		href: 'mailto:parcerias@caxindadivulga.com',
	},
];

const SOCIALS = [
	{
		label: 'Facebook',
		href: 'https://www.facebook.com/share/1QQ4oB2nSv/?mibextid=wwXIfr',
		Icon: FacebookSVG,
	},
	{
		label: 'Instagram',
		href: 'https://www.instagram.com/caxinda_divulga?stkn=MTU1NGx2aWpnd3Fsdg%3D%3D&utm_source=qr',
		Icon: InstagramSVG,
	},
	{
		label: 'LinkedIn',
		href: 'https://www.linkedin.com/company/caxinda-divulga/',
		Icon: LinkedInSVG,
	},
	{
		label: 'TikTok',
		href: 'https://www.tiktok.com/@caxindadivulga?_r=1&_t=ZS-99xI6ehfEay',
		Icon: TikTokSVG,
	},
	{
		label: 'WhatsApp',
		href: 'https://wa.me/244923000000',
		Icon: WhatsAppSVG,
	},
	{
		label: 'Email',
		href: 'mailto:geral@caxindadivulga.com',
		Icon: EnvelopeSVG,
	},
];

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<p className="font-display text-xs font-bold uppercase tracking-widest text-red-light">
			{children}
		</p>
	);
}

function FooterLink({
	to,
	children,
}: {
	to: string;
	children: React.ReactNode;
}) {
	return (
		<Link
			to={to}
			className="group flex items-center gap-1.5 text-snow/70 transition hover:text-red-light"
		>
			<ArrowRightSVG className="h-3.5 w-3.5 shrink-0 text-red-light transition-transform group-hover:translate-x-0.5" />
			<span>{children}</span>
		</Link>
	);
}

function ContactRow({
	href,
	label,
	Icon,
}: {
	href: string;
	label: string;
	Icon: typeof EnvelopeSVG;
}) {
	return (
		<a
			href={href}
			className="flex items-center gap-2 text-snow/70 transition hover:text-red-light"
		>
			<Icon className="h-4 w-4 shrink-0" />
			<span className="truncate">{label}</span>
		</a>
	);
}

export function Footer() {
	return (
		<footer className="mt-8 border-t border-ink/10 bg-ink text-snow">
			<div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-6">
				<div className="md:col-span-2">
					<Logo variant="dark" />
					<p className="mt-3 max-w-sm text-sm text-snow/60">
						A plataforma que leva o seu negócio a outro nível em
						Angola. Divulgue serviços, venda produtos e destaque o
						seu estabelecimento.
					</p>
				</div>
				<div className="flex flex-col gap-2 text-sm">
					<SectionTitle>Plataforma</SectionTitle>
					<FooterLink to="/produtos">Produtos</FooterLink>
					<FooterLink to="/empresas">Empresas</FooterLink>
					<FooterLink to="/planos">Planos</FooterLink>
					<FooterLink to="/busca">Pesquisa</FooterLink>
				</div>
				<div className="flex flex-col gap-2 text-sm">
					<SectionTitle>Institucional</SectionTitle>
					<FooterLink to="/sobre">Sobre nós</FooterLink>
					<FooterLink to="/contactos">Contactos</FooterLink>
					<FooterLink to="/termos">Termos e condições</FooterLink>
					<FooterLink to="/politicas">
						Política de privacidade
					</FooterLink>
					<FooterLink to="/cookies">Política de cookies</FooterLink>
				</div>
				<div className="flex flex-col gap-2 text-sm">
					<SectionTitle>Utilizador</SectionTitle>
					<FooterLink to="/auth/entrar">Entrar</FooterLink>
					<FooterLink to="/auth/registar">Criar conta</FooterLink>
					<FooterLink to="/area">Minha conta</FooterLink>
				</div>
				<div className="flex flex-col gap-2 text-sm">
					<SectionTitle>Contactos</SectionTitle>
					{CONTACTS.map((contact) => (
						<ContactRow
							key={contact.href}
							href={contact.href}
							label={contact.label}
							Icon={EnvelopeSVG}
						/>
					))}
					<ContactRow
						href="https://wa.me/244923000000"
						label="+244 923 000 000"
						Icon={WhatsAppSVG}
					/>
					<div className="mt-2 flex gap-2">
						{SOCIALS.map(({ label, href, Icon }) => (
							<a
								key={label}
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={label}
								className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-snow/70 transition hover:bg-white/10 hover:text-red-light"
							>
								<Icon className="h-4.5 w-4.5" />
							</a>
						))}
					</div>
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
