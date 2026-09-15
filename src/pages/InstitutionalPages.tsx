import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { usePageTitle } from '../hooks/usePageTitle';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { http, getApiError } from '../lib/api';
import { FacebookSVG } from '../components/ui/icons/FacebookSVG';
import { InstagramSVG } from '../components/ui/icons/InstagramSVG';
import { WhatsAppSVG } from '../components/ui/icons/WhatsAppSVG';
import { EnvelopeSVG } from '../components/ui/icons/EnvelopeSVG';

type TocItem = { id: string; label: string };

function InstitutionalShell({
	kicker = 'Caxinda Divulga',
	title,
	titleAccent,
	lead,
	stickerColor = 'bg-red',
	toc,
	children,
}: {
	kicker?: string;
	title: string;
	titleAccent?: string;
	lead: string;
	stickerColor?: string;
	toc?: TocItem[];
	children: ReactNode;
}) {
	const tocIds = toc?.map((s) => s.id) ?? [];
	const activeId = useScrollSpy(tocIds);
	return (
		<>
			<div className="mx-auto max-w-6xl px-4 pt-8 md:pt-10">
				<section className="relative overflow-hidden rounded-3xl bg-ink text-white shadow-2xl">
					<div
						className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rotate-12 rounded-3xl ${stickerColor} opacity-80`}
					/>

					<div className="relative z-10 px-6 py-8 md:px-12 md:py-10">
						<span className="kicker text-kwanza">{kicker}</span>
						<h1 className="mt-4 font-display text-3xl font-black leading-[1.05] tracking-tight md:text-4xl">
							{title}
							{titleAccent && (
								<span className="mt-3 block w-fit -rotate-1 rounded-2xl bg-red px-4 py-1.5 text-2xl text-white shadow-[0_6px_16px_rgba(211,20,30,0.45)] md:text-3xl">
									{titleAccent}
								</span>
							)}
						</h1>
						<p className="mt-5 max-w-xl text-base leading-relaxed text-white/55">
							{lead}
						</p>
					</div>
				</section>
			</div>

			<div className="mx-auto max-w-6xl px-4 py-12">
				<div className="flex gap-10">
					{toc && toc.length > 0 && (
						<aside className="nice-scroll sticky top-24 hidden w-56 shrink-0 self-start lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
							<p className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-ink/40">
								Nesta página
							</p>
							<nav className="flex flex-col">
								{toc.map((s) => {
									const isActive = activeId === s.id;
									return (
										<a
											key={s.id}
											href={`#${s.id}`}
											aria-current={
												isActive ? 'true' : undefined
											}
											className={`border-l-2 py-1.5 pl-4 text-sm transition-all duration-200 ${
												isActive
													? 'border-kwanza bg-kwanza/5 font-bold text-ink'
													: 'border-transparent text-ink/55 hover:border-kwanza/40 hover:text-ink'
											}`}
										>
											{s.label}
										</a>
									);
								})}
							</nav>
						</aside>
					)}
					<div className="min-w-0 flex-1">
						<article className="mx-auto max-w-3xl space-y-6 text-ink/80">
							{children}
						</article>
					</div>
				</div>
			</div>
		</>
	);
}

function H2({ id, children }: { id?: string; children: ReactNode }) {
	return (
		<div className="pt-4">
			<span className="mb-2.5 block h-1 w-10 rounded-full bg-kwanza" />
			<h2
				id={id}
				className="scroll-mt-24 font-display text-xl font-black text-ink md:text-2xl"
			>
				{children}
			</h2>
		</div>
	);
}

function CheckList({ items }: { items: string[] }) {
	return (
		<ul className="space-y-1.5">
			{items.map((item) => (
				<li key={item} className="flex items-start gap-2.5">
					<span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-kwanza/15 text-[0.65rem] font-black text-ink">
						✔
					</span>
					<span>{item}</span>
				</li>
			))}
		</ul>
	);
}

// ================= Sobre =================

export function SobrePage() {
	usePageTitle('Sobre');
	const stats = [
		{ n: '18', l: 'províncias em que trabalhamos' },
		{ n: '0 kz', l: 'é quanto custa começar a vender' },
		{ n: '1', l: 'dia útil para respondermos a ti' },
	];
	const values = [
		{
			title: 'Feito em Angola, para Angola.',
			body: 'Sem traduções de outras plataformas: a lógica, os exemplos e os preços são nossos.',
		},
		{
			title: 'Tudo em kwanza.',
			body: 'Preços claros, planos simples e sem taxas escondidas — do primeiro anúncio ao plano de destaque.',
		},
		{
			title: 'Uma vitrine para todos.',
			body: 'Do vendedor de rua ao escritório de Luanda. Quem cria a empresa é dono da própria página.',
		},
		{
			title: 'Suporte com pessoa.',
			body: 'Escreves e respondemos em até 1 dia útil. A sério.',
		},
	];
	return (
		<>
			<div className="mx-auto max-w-6xl px-4 pt-8 md:pt-10">
				<section className="relative overflow-hidden rounded-3xl bg-ink text-white shadow-2xl">
					<div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rotate-12 rounded-3xl bg-red opacity-80" />

					<div className="relative z-10 px-6 py-8 md:px-12 md:py-10">
						<span className="kicker text-kwanza">
							Caxinda Divulga
						</span>
						<h1 className="mt-4 font-display text-3xl font-black leading-[1.05] tracking-tight md:text-4xl">
							Sobre nós
							<span className="mt-3 block w-fit -rotate-1 rounded-2xl bg-red px-4 py-1.5 text-2xl text-white shadow-[0_6px_16px_rgba(211,20,30,0.45)] md:text-3xl">
								feito em Angola
							</span>
						</h1>
						<p className="mt-5 max-w-xl text-base leading-relaxed text-white/55">
							A Caxinda Divulga nasceu para que qualquer negócio —
							do barraco de jeito ao escritório de Luanda — tenha
							vitrine, clientes e visibilidade em Angola.
						</p>
					</div>
				</section>
			</div>

			<div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
				<div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
					<div>
						<span className="kicker text-kwanza">O porquê</span>
						<p className="mt-6 font-display text-3xl font-black leading-[1.1] tracking-tight text-ink md:text-4xl xl:text-5xl">
							A maioria dos negócios de Angola vive do boca a
							boca. Nós demos-lhes uma vitrine.
						</p>
					</div>
					<div className="flex flex-col justify-center gap-6">
						<p className="text-lg leading-relaxed text-ink/75">
							Hoje, quem vende publica em segundos. Quem anda à
							procura encontra por categoria e província, com
							preços em kwanza e contacto direto com o vendedor —
							sem intermediários e sem jargão.
						</p>
						<p className="text-lg leading-relaxed text-ink/75">
							Começámos com uma ideia simples: se o boca a boca
							funciona, na internet funciona melhor. Foi assim que
							a Caxinda Divulga nasceu — feita para o mercado
							local, do barraco de jeito ao escritório de Luanda.
						</p>
					</div>
				</div>

				<div className="mt-14 overflow-hidden rounded-3xl border border-ink/10 bg-white">
					<div className="grid divide-y divide-ink/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
						{stats.map((s) => (
							<div key={s.l} className="p-8">
								<p className="font-display text-4xl font-black text-red md:text-5xl">
									{s.n}
								</p>
								<p className="mt-2 text-sm text-ink/55">
									{s.l}
								</p>
							</div>
						))}
					</div>
				</div>

				<div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
					<div>
						<span className="mb-3 block h-1 w-10 rounded-full bg-kwanza" />
						<h2 className="font-display text-2xl font-black text-ink md:text-3xl">
							Como trabalhamos
						</h2>
						<p className="mt-3 text-sm text-ink/55">
							Quatro princípios que não negociamos.
						</p>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						{values.map((v) => (
							<div
								key={v.title}
								className="rounded-2xl border border-ink/10 bg-white p-6"
							>
								<p className="font-display text-base font-black text-ink">
									{v.title}
								</p>
								<p className="mt-2 text-sm leading-relaxed text-ink/65">
									{v.body}
								</p>
							</div>
						))}
					</div>
				</div>

				<div className="relative mt-14 overflow-hidden rounded-3xl bg-kwanza p-8 md:p-12">
					<div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rotate-12 rounded-3xl bg-ink/10" />
					<div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
						<div>
							<span className="kicker text-ink/60">
								Começa hoje
							</span>
							<h3 className="mt-3 font-display text-2xl font-black leading-tight text-ink md:text-3xl">
								Publica o teu primeiro produto esta semana.
							</h3>
							<p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/65">
								Conta grátis, sem cartão e sem letras pequenas.
								Se precisares de ajuda, falamos contigo.
							</p>
						</div>
						<div className="flex flex-wrap gap-3">
							<Link
								to="/auth/registar"
								className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:bg-ink-soft"
							>
								Criar conta grátis
							</Link>
							<Link
								to="/produtos"
								className="inline-flex items-center gap-2 rounded-xl border-2 border-ink/25 px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-ink/5"
							>
								Ver produtos
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

// ================= Termos =================

const TERMS_TOC: TocItem[] = [
	{ id: 'plataforma', label: 'A plataforma' },
	{ id: 'conta', label: 'Conta' },
	{ id: 'anuncios-empresas', label: 'Anúncios e empresas' },
	{ id: 'planos-pagamentos', label: 'Planos e pagamentos' },
	{ id: 'conduta', label: 'Conduta' },
	{ id: 'alteracoes', label: 'Alterações' },
];

export function TermosPage() {
	usePageTitle('Termos e Condições');
	return (
		<InstitutionalShell
			kicker="Legal"
			title="Termos e condições"
			titleAccent="lê antes de publicar"
			lead="Ao usar a Caxinda Divulga aceitas estes termos. Lê com atenção antes de publicar anúncios, criar empresas ou subscrever planos."
			stickerColor="bg-blue"
			toc={TERMS_TOC}
		>
			<H2 id="plataforma">1. A plataforma</H2>
			<p>
				A Caxinda Divulga é um serviço de divulgação que aproxima
				compradores e vendedores. Não somos parte nas transações entre
				os utilizadores e não garantimos a qualidade, legalidade ou
				autenticidade dos produtos e serviços anunciados.
			</p>

			<H2 id="conta">2. Conta</H2>
			<p>
				Para publicar é preciso criar uma conta com dados verdadeiros.
				És responsável por manter as credenciais em segredo e por tudo o
				que acontecer na tua conta. Podemos suspender contas que
				apresentem informações falsas ou comportamento abusivo.
			</p>

			<H2 id="anuncios-empresas">3. Anúncios e empresas</H2>
			<CheckList
				items={[
					'Só podes publicar aquilo que tens direito de anunciar.',
					'Os preços devem ser claros e em kwanza.',
					'Fotos roubadas, conteúdo ofensivo ou ilegal leva a remoção.',
					'Anúncios duplicados ou enganosos podem ser apagados sem aviso.',
				]}
			/>

			<H2 id="planos-pagamentos">4. Planos e pagamentos</H2>
			<p>
				Os planos são assinaturas com duração definida. O pagamento é
				confirmado após verificação do comprovativo pela equipa.
				Ferramentas de destacar anúncios e aumentar a visibilidade de
				empresas são benefícios do plano escolhido.
			</p>

			<H2 id="conduta">5. Conduta</H2>
			<p>
				Não é permitido: assédio, burla, tentativas de phishing,
				divulgar dados pessoais de terceiros, fazer-se passar por outra
				pessoa ou utilizar a plataforma para qualquer atividade ilícita.
			</p>

			<H2 id="alteracoes">6. Alterações</H2>
			<p>
				Podemos atualizar estes termos. As alterações entram em vigor
				após publicação nesta página e são avisadas por email sempre que
				materialmente relevantes.
			</p>
			<p>Última atualização: {new Date().getFullYear()}.</p>
		</InstitutionalShell>
	);
}

// ================= Privacidade =================

const PRIVACY_TOC: TocItem[] = [
	{ id: 'dados', label: 'Dados que recolhemos' },
	{ id: 'uso', label: 'Como usamos os dados' },
	{ id: 'partilha', label: 'Partilha de informações' },
	{ id: 'seguranca', label: 'Segurança e retenção' },
	{ id: 'direitos', label: 'Os teus direitos' },
];

export function PoliticasPage() {
	usePageTitle('Política de Privacidade');
	return (
		<InstitutionalShell
			kicker="Legal"
			title="Política de privacidade"
			titleAccent="os teus dados estão seguros"
			lead="Explicamos como recolhemos, usamos e protegemos os teus dados pessoais quando usas a Caxinda Divulga."
			stickerColor="bg-blue"
			toc={PRIVACY_TOC}
		>
			<H2 id="dados">Dados que recolhemos</H2>
			<CheckList
				items={[
					'Dados de conta: nome, email, telefone, fotografia.',
					'Conteúdo que publicas: anúncios, empresas, avaliações, mensagens.',
					'Dados de navegação: páginas visitadas e interações na plataforma.',
					'Verificação de identidade (KYC) quando submeteres os documentos.',
				]}
			/>

			<H2 id="uso">Como usamos os dados</H2>
			<CheckList
				items={[
					'Para gerir a tua conta e as tuas publicações.',
					'Para mostrar anúncios, empresas e mensagens relevantes.',
					'Para melhorar a plataforma e prevenir fraude e abuso.',
					'Para te contactar sobre a tua conta e serviços.',
				]}
			/>

			<H2 id="partilha">Partilha de informações</H2>
			<p>
				Nunca vendemos os teus dados. Partilhamos informação com
				prestadores de serviços (armazenamento, envio de emails,
				verificação de identidade) apenas na medida necessária ao
				funcionamento da plataforma, e sempre sob nossas instruções.
			</p>

			<H2 id="seguranca">Segurança e retenção</H2>
			<p>
				Usamos encriptação em trânsito e armazenamos os dados em
				serviços seguros. Conservamos os dados enquanto a conta estiver
				ativa e durante o prazo exigido por lei. Podes pedir a
				eliminação da conta a qualquer momento.
			</p>

			<H2 id="direitos">Os teus direitos</H2>
			<p>
				Podes aceder, corrigir ou apagar os teus dados, e exportar uma
				cópia. Para exerceres os teus direitos, contacta-nos pelo email
				indicado na página de contactos.
			</p>
		</InstitutionalShell>
	);
}

// ================= Cookies =================

const COOKIES_TOC: TocItem[] = [
	{ id: 'o-que-sao', label: 'O que são cookies' },
	{ id: 'quais-usamos', label: 'Cookies que usamos' },
	{ id: 'gerir', label: 'Gerir cookies' },
	{ id: 'contactos', label: 'Contactos' },
];

export function CookiesPage() {
	usePageTitle('Política de Cookies');
	return (
		<InstitutionalShell
			kicker="Legal"
			title="Política de cookies"
			titleAccent="simples e transparente"
			lead="Os cookies ajudam a plataforma a lembrar-se de ti e a funcionar melhor. Explicamos aqui quais usamos e porquê."
			stickerColor="bg-blue"
			toc={COOKIES_TOC}
		>
			<H2 id="o-que-sao">O que são cookies</H2>
			<p>
				São pequenos ficheiros guardados no teu navegador que permitem
				reconhecer o teu dispositivo e recordar as tuas preferências.
			</p>

			<H2 id="quais-usamos">Cookies que usamos</H2>
			<CheckList
				items={[
					'Essenciais: manter a sessão iniciada e proteger a tua conta.',
					'Preferências: lembrar escolhas como província e vista da listagem.',
					'Analíticos: perceber como a plataforma é usada, de forma agregada e anónima, para melhorarmos.',
				]}
			/>

			<H2 id="gerir">Gerir cookies</H2>
			<p>
				Podes bloquear ou apagar cookies nas definições do teu
				navegador. Nota: sem os cookies essenciais, a sessão e algumas
				funcionalidades podem deixar de funcionar corretamente.
			</p>

			<H2 id="contactos">Contactos</H2>
			<p>
				Para dúvidas sobre cookies ou privacidade, escreve-nos pelo
				email indicado na página de contactos.
			</p>
		</InstitutionalShell>
	);
}

// ================= Contactos =================

const SUBJECTS = [
	'Conta',
	'Anúncios',
	'Empresas',
	'Planos',
	'Parcerias',
	'Outro',
];

export function ContactosPage() {
	usePageTitle('Contactos');
	const [form, setForm] = useState({
		name: '',
		email: '',
		subject: SUBJECTS[0],
		message: '',
	});
	const [sending, setSending] = useState(false);

	const set = (key: keyof typeof form, value: string) =>
		setForm((f) => ({ ...f, [key]: value }));

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		setSending(true);
		http.post('/contactos', form)
			.then(() => {
				toast.success('Mensagem enviada. Responderemos em breve.');
				setForm({
					name: '',
					email: '',
					subject: SUBJECTS[0],
					message: '',
				});
			})
			.catch((err) => toast.error(getApiError(err)))
			.finally(() => setSending(false));
	};

	const channels = [
		{
			label: 'Geral',
			value: 'geral@caxindadivulga.ao',
			href: 'mailto:geral@caxindadivulga.ao',
			Icon: EnvelopeSVG,
		},
		{
			label: 'Suporte de contas',
			value: 'suporte@caxindadivulga.ao',
			href: 'mailto:suporte@caxindadivulga.ao',
			Icon: EnvelopeSVG,
		},
		{
			label: 'Parcerias',
			value: 'parcerias@caxindadivulga.ao',
			href: 'mailto:parcerias@caxindadivulga.ao',
			Icon: EnvelopeSVG,
		},
		{
			label: 'Telefone / WhatsApp',
			value: '+244 923 000 000',
			href: 'https://wa.me/244923000000',
			Icon: WhatsAppSVG,
		},
	];

	const socials = [
		{
			label: 'Facebook',
			href: 'https://facebook.com/caxindadivulga',
			Icon: FacebookSVG,
		},
		{
			label: 'Instagram',
			href: 'https://instagram.com/caxindadivulga',
			Icon: InstagramSVG,
		},
		{
			label: 'WhatsApp',
			href: 'https://wa.me/244923000000',
			Icon: WhatsAppSVG,
		},
		{
			label: 'Email',
			href: 'mailto:geral@caxindadivulga.ao',
			Icon: EnvelopeSVG,
		},
	];

	return (
		<>
			<div className="mx-auto max-w-6xl px-4 pt-8 md:pt-10">
				<section className="relative overflow-hidden rounded-3xl bg-ink text-white shadow-2xl">
					<div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rotate-12 rounded-3xl bg-red opacity-80" />

					<div className="relative z-10 px-6 py-8 md:px-12 md:py-10">
						<span className="kicker text-kwanza">
							Fala connosco
						</span>
						<h1 className="mt-4 font-display text-3xl font-black leading-[1.05] tracking-tight md:text-4xl">
							Contactos
						</h1>
						<p className="mt-5 max-w-xl text-base leading-relaxed text-white/55">
							Respondemos a dúvidas sobre contas, anúncios,
							empresas, planos e parcerias.
						</p>
					</div>
				</section>
			</div>

			<div className="mx-auto max-w-6xl px-4 py-12">
				<div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
					<form
						onSubmit={submit}
						className="rounded-2xl border border-ink/10 bg-white p-6 md:p-8"
					>
						<span className="mb-3 block h-1 w-10 rounded-full bg-kwanza" />
						<h2 className="font-display text-lg font-black">
							Envia-nos uma mensagem
						</h2>
						<p className="mt-1 text-sm text-ink/55">
							Preenche o formulário e entraremos em contacto em
							até 1 dia útil.
						</p>
						<div className="mt-6 grid gap-4 sm:grid-cols-2">
							<div>
								<label className="label" htmlFor="contact-name">
									Nome
								</label>
								<input
									id="contact-name"
									className="input"
									placeholder="O teu nome"
									value={form.name}
									onChange={(e) =>
										set('name', e.target.value)
									}
									required
								/>
							</div>
							<div>
								<label
									className="label"
									htmlFor="contact-email"
								>
									Email
								</label>
								<input
									id="contact-email"
									type="email"
									className="input"
									placeholder="O teu email"
									value={form.email}
									onChange={(e) =>
										set('email', e.target.value)
									}
									required
								/>
							</div>
						</div>
						<div className="mt-4">
							<label className="label" htmlFor="contact-subject">
								Assunto
							</label>
							<select
								id="contact-subject"
								className="input"
								value={form.subject}
								onChange={(e) => set('subject', e.target.value)}
							>
								{SUBJECTS.map((s) => (
									<option key={s} value={s}>
										{s}
									</option>
								))}
							</select>
						</div>
						<div className="mt-4">
							<label className="label" htmlFor="contact-message">
								Mensagem
							</label>
							<textarea
								id="contact-message"
								className="input min-h-32"
								placeholder="Escreve a tua dúvida ou pedido…"
								value={form.message}
								onChange={(e) => set('message', e.target.value)}
								required
							/>
						</div>
						<button
							type="submit"
							className="mt-6 bg-kwanza px-5 py-2.5 font-mono text-sm font-bold text-ink transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
							style={{
								clipPath:
									'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
								paddingRight: '24px',
							}}
							disabled={sending}
						>
							{sending ? 'A enviar…' : 'Enviar mensagem'}
						</button>
					</form>

					<aside className="space-y-6 self-start">
						<div className="rounded-2xl border border-ink/10 bg-white p-6">
							<p className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-ink/40">
								Canais de contacto
							</p>
							<ul className="space-y-4">
								{channels.map((c) => (
									<li
										key={c.label}
										className="flex items-start gap-3"
									>
										<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-snow text-red">
											<c.Icon width={18} height={18} />
										</span>
										<div className="min-w-0">
											<p className="font-mono text-[0.65rem] font-bold uppercase tracking-widest text-kwanza">
												{c.label}
											</p>
											<a
												href={c.href}
												target={
													c.href.startsWith('http')
														? '_blank'
														: undefined
												}
												rel="noreferrer"
												className="mt-0.5 block break-words text-sm font-medium text-ink transition hover:text-red"
											>
												{c.value}
											</a>
										</div>
									</li>
								))}
							</ul>
						</div>

						<div className="rounded-2xl border border-ink/10 bg-white p-6">
							<p className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-ink/40">
								Redes sociais
							</p>
							<div className="flex flex-wrap gap-2">
								{socials.map((s) => (
									<a
										key={s.label}
										href={s.href}
										target="_blank"
										rel="noreferrer"
										className="flex items-center gap-2 rounded-full border-2 border-ink/15 px-3 py-1.5 text-xs font-bold text-ink/70 transition hover:border-kwanza hover:text-ink"
									>
										<s.Icon width={16} height={16} />
										{s.label}
									</a>
								))}
							</div>
						</div>

						<div className="rounded-2xl border border-ink/10 bg-white p-6">
							<p className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-ink/40">
								Localização e horário
							</p>
							<p className="flex items-start gap-2 text-sm text-ink/80">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="mt-0.5 h-4 w-4 shrink-0 text-red"
								>
									<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
									<circle cx="12" cy="10" r="3" />
								</svg>
								Luanda, Angola — servindo as 18 províncias.
							</p>
							<p className="mt-2 flex items-start gap-2 text-sm text-ink/80">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="mt-0.5 h-4 w-4 shrink-0 text-red"
								>
									<circle cx="12" cy="12" r="10" />
									<path d="M12 6v6l4 2" />
								</svg>
								Segunda a sexta, das 08h00 às 17h00 (hora de
								Luanda). Os emails são respondidos em até 1 dia
								útil.
							</p>
						</div>
					</aside>
				</div>
			</div>
		</>
	);
}
