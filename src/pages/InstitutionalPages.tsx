import type { ReactNode } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { usePageTitle } from '../hooks/usePageTitle';
import { http, getApiError } from '../lib/api';
import { FacebookSVG } from '../components/ui/icons/FacebookSVG';
import { InstagramSVG } from '../components/ui/icons/InstagramSVG';
import { WhatsAppSVG } from '../components/ui/icons/WhatsAppSVG';
import { EnvelopeSVG } from '../components/ui/icons/EnvelopeSVG';

type TocItem = { id: string; label: string };

function Eyebrow({ children }: { children: ReactNode }) {
	return (
		<span
			className="inline-block bg-kwanza px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-ink"
			style={{
				clipPath:
					'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)',
			}}
		>
			{children}
		</span>
	);
}

function InstitutionalShell({
	eyebrow = 'Caxinda Divulga',
	title,
	lead,
	toc,
	children,
}: {
	eyebrow?: string;
	title: string;
	lead: string;
	toc?: TocItem[];
	children: ReactNode;
}) {
	return (
		<>
			<section className="relative overflow-hidden bg-ink text-snow">
				<div className="mx-auto flex max-w-6xl items-stretch px-4 py-14 md:py-16">
					<div className="flex-1">
						<Eyebrow>{eyebrow}</Eyebrow>
						<h1 className="mt-4 font-display text-3xl font-black leading-tight md:text-4xl">
							{title}
						</h1>
						<p className="mt-3 max-w-2xl text-snow/70">{lead}</p>
					</div>
					<div
						className="hidden items-center pl-10 md:flex"
						aria-hidden
					>
						<span className="price-tag text-2xl">AO</span>
					</div>
				</div>
			</section>

			<div className="mx-auto max-w-6xl px-4 py-12">
				<div className="flex gap-10">
					{toc && toc.length > 0 && (
						<aside className="nice-scroll sticky top-24 hidden w-56 shrink-0 self-start lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
							<p className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-ink/40">
								Nesta página
							</p>
							<nav className="flex flex-col">
								{toc.map((s) => (
									<a
										key={s.id}
										href={`#${s.id}`}
										className="border-l-2 border-transparent py-1.5 pl-4 text-sm text-ink/55 transition hover:border-kwanza hover:text-ink"
									>
										{s.label}
									</a>
								))}
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
		<h2
			id={id}
			className="scroll-mt-24 pt-4 font-display text-xl font-black text-ink md:text-2xl"
		>
			{children}
		</h2>
	);
}

function CheckList({ items }: { items: string[] }) {
	return (
		<ul className="space-y-1.5">
			{items.map((item) => (
				<li key={item} className="flex items-start gap-2">
					<span className="mt-0.5 text-kwanza">✔</span>
					<span>{item}</span>
				</li>
			))}
		</ul>
	);
}

// ================= Sobre =================

export function SobrePage() {
	usePageTitle('Sobre');
	const facts = [
		{ n: '18', l: 'províncias servidas' },
		{ n: '0 kz', l: 'para começar a vender' },
		{ n: '1', l: 'dia útil para responder' },
	];
	const capabilities = [
		'Anúncios de produtos e serviços em todas as províncias.',
		'Páginas de empresas com contactos, fotos e avaliações.',
		'Planos de destaque para quem quer vender mais.',
		'Mensagens diretas entre compradores e vendedores.',
		'Verificação de identidade e de empresas de confiança.',
	];
	return (
		<>
			<section className="relative overflow-hidden bg-ink text-snow">
				<div className="mx-auto flex max-w-6xl items-stretch px-4 py-14 md:py-16">
					<div className="flex-1">
						<Eyebrow>Caxinda Divulga</Eyebrow>
						<h1 className="mt-4 font-display text-3xl font-black leading-tight md:text-4xl">
							Sobre nós
						</h1>
						<p className="mt-3 max-w-2xl text-snow/70">
							A Caxinda Divulga nasceu para que qualquer negócio —
							do barraco de jeito ao escritório de Luanda — tenha
							vitrine, clientes e visibilidade em Angola.
						</p>
					</div>
					<div
						className="hidden items-center pl-10 md:flex"
						aria-hidden
					>
						<span className="price-tag text-2xl">AO</span>
					</div>
				</div>
			</section>

			<div className="mx-auto max-w-6xl px-4 py-12">
				<div className="grid gap-4 sm:grid-cols-3">
					{facts.map((f) => (
						<div
							key={f.l}
							className="rounded-2xl border border-ink/10 bg-white p-6"
						>
							<p className="font-mono text-3xl font-bold text-red">
								{f.n}
							</p>
							<p className="mt-1 text-sm text-ink/60">{f.l}</p>
						</div>
					))}
				</div>

				<div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
					<div className="space-y-6 text-ink/80">
						<p>
							Somos uma plataforma angolana de divulgação. Quem
							vende, publica anúncios em segundos. Quem anda à
							procura, encontra produtos, serviços e empresas
							organizados por categoria e província.
						</p>
						<p>
							Tudo começou com uma ideia simples: a maioria dos
							pequenos negócios de Angola ainda anuncia de boca a
							boca e pelo telemóvel. Falta-lhes um sítio onde os
							clientes os encontrem. A Caxinda Divulga é esse
							sítio — feito em Angola, pensado para o mercado
							local e com preços em kwanza.
						</p>
						<div>
							<H2>A nossa missão</H2>
							<p className="mt-2">
								Dar a qualquer angolano — do vendedor de rua à
								empresa de serviços — as ferramentas para ser
								encontrado, comunicar com clientes e crescer.
								Sem jargão, sem custos escondidos, sem portas
								fechadas.
							</p>
						</div>
					</div>

					<div className="rounded-2xl border border-ink/10 bg-white p-6 self-start">
						<p className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-ink/40">
							O que fazemos
						</p>
						<div className="flex flex-col gap-3">
							{capabilities.map((c) => (
								<div
									key={c}
									className="flex items-start gap-2 rounded-xl bg-snow p-3 text-sm"
								>
									<span className="text-kwanza">✔</span>
									<span>{c}</span>
								</div>
							))}
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
			eyebrow="Legal"
			title="Termos e condições"
			lead="Ao usar a Caxinda Divulga aceitas estes termos. Lê com atenção antes de publicar anúncios, criar empresas ou subscrever planos."
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
			eyebrow="Legal"
			title="Política de privacidade"
			lead="Explicamos como recolhemos, usamos e protegemos os teus dados pessoais quando usas a Caxinda Divulga."
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
			eyebrow="Legal"
			title="Política de cookies"
			lead="Os cookies ajudam a plataforma a lembrar-se de ti e a funcionar melhor. Explicamos aqui quais usamos e porquê."
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
		},
		{
			label: 'Suporte de contas',
			value: 'suporte@caxindadivulga.ao',
			href: 'mailto:suporte@caxindadivulga.ao',
		},
		{
			label: 'Parcerias',
			value: 'parcerias@caxindadivulga.ao',
			href: 'mailto:parcerias@caxindadivulga.ao',
		},
		{
			label: 'Telefone / WhatsApp',
			value: '+244 923 000 000',
			href: 'https://wa.me/244923000000',
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
			<section className="relative overflow-hidden bg-ink text-snow">
				<div className="mx-auto flex max-w-6xl items-stretch px-4 py-14 md:py-16">
					<div className="flex-1">
						<Eyebrow>Fala connosco</Eyebrow>
						<h1 className="mt-4 font-display text-3xl font-black leading-tight md:text-4xl">
							Contactos
						</h1>
						<p className="mt-3 max-w-2xl text-snow/70">
							Respondemos a dúvidas sobre contas, anúncios,
							empresas, planos e parcerias.
						</p>
					</div>
					<div
						className="hidden items-center pl-10 md:flex"
						aria-hidden
					>
						<span className="price-tag text-2xl">AO</span>
					</div>
				</div>
			</section>

			<div className="mx-auto max-w-6xl px-4 py-12">
				<div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
					<form
						onSubmit={submit}
						className="rounded-2xl border border-ink/10 bg-white p-6 md:p-8"
					>
						<h2 className="font-display text-lg font-black">
							Envia-nos uma mensagem
						</h2>
						<p className="mt-1 text-sm text-ink/60">
							Preenche o formulário e entraremos em contacto.
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
									<li key={c.label}>
										<p className="font-mono text-xs font-bold uppercase tracking-widest text-kwanza">
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
											className="text-ink transition hover:text-red"
										>
											{c.value}
										</a>
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
							<p className="text-sm text-ink/80">
								Luanda, Angola — servindo as 18 províncias.
							</p>
							<p className="mt-2 text-sm text-ink/80">
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
