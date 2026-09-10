import type { ReactNode } from 'react';

function PageShell({
	title,
	lead,
	children,
}: {
	title: string;
	lead: string;
	children: ReactNode;
}) {
	return (
		<div className="mx-auto max-w-3xl px-4 py-14">
			<span className="tag tag-kwanza mb-4">Caxinda Divulga</span>
			<h1 className="font-display text-3xl font-black leading-tight">
				{title}
			</h1>
			<p className="mt-3 text-ink/60">{lead}</p>
			<article className="prose mt-10 space-y-6 text-ink/80">
				{children}
			</article>
		</div>
	);
}

function H2({ children }: { children: ReactNode }) {
	return (
		<h2 className="pt-4 font-display text-xl font-black text-ink">
			{children}
		</h2>
	);
}

export function SobrePage() {
	return (
		<PageShell
			title="Sobre nós"
			lead="A Caxinda Divulga nasceu para que qualquer negócio — do barraco de jeito ao escritório de Luanda — tenha vitrine, clientes e visibilidade em Angola."
		>
			<p>
				Somos uma plataforma angolana de divulgação. Quem vende, publica
				anúncios em segundos. Quem anda à procura, encontra produtos,
				serviços e empresas organizados por categoria e província.
			</p>
			<p>
				Tudo começou com uma ideia simples: a maioria dos pequenos
				negócios de Angola ainda anuncia de boca a boca e pelo
				telemóvel. Falta-lhes um sítio onde os clientes os encontrem. A
				Caxinda Divulga é esse sítio — feito em Angola, pensado para o
				mercado local e com preços em kwanza.
			</p>
			<H2>O que fazemos</H2>
			<ul className="list-disc space-y-1 pl-5">
				<li>Anúncios de produtos e serviços em todas as províncias.</li>
				<li>Páginas de empresas com contactos, fotos e avaliações.</li>
				<li>Planos de destaque para quem quer vender mais.</li>
				<li>Mensagens diretas entre compradores e vendedores.</li>
				<li>Verificação de identidade e de empresas de confiança.</li>
			</ul>
			<H2>A nossa missão</H2>
			<p>
				Dar a qualquer angolano — do vendedor de rua à empresa de
				serviços — as ferramentas para ser encontrado, comunicar com
				clientes e crescer. Sem jargão, sem custos escondidos, sem
				portas fechadas.
			</p>
		</PageShell>
	);
}

export function TermosPage() {
	return (
		<PageShell
			title="Termos e condições"
			lead="Ao usar a Caxinda Divulga aceitas estes termos. Lê com atenção antes de publicar anúncios, criar empresas ou subscrever planos."
		>
			<H2>1. A plataforma</H2>
			<p>
				A Caxinda Divulga é um serviço de divulgação que aproxima
				compradores e vendedores. Não somos parte nas transações entre
				os utilizadores e não garantimos a qualidade, legalidade ou
				autenticidade dos produtos e serviços anunciados.
			</p>
			<H2>2. Conta</H2>
			<p>
				Para publicar é preciso criar uma conta com dados verdadeiros.
				És responsável por manter as credenciais em segredo e por tudo o
				que acontecer na tua conta. Podemos suspender contas que
				apresentem informações falsas ou comportamento abusivo.
			</p>
			<H2>3. Anúncios e empresas</H2>
			<ul className="list-disc space-y-1 pl-5">
				<li>Só podes publicar aquilo que tens direito de anunciar.</li>
				<li>Os preços devem ser claros e em kwanza.</li>
				<li>
					Fotos roubadas, conteúdo ofensivo ou ilegal leva a remoção.
				</li>
				<li>
					Anúncios duplicados ou enganosos podem ser apagados sem
					aviso.
				</li>
			</ul>
			<H2>4. Planos e pagamentos</H2>
			<p>
				Os planos são assinaturas com duração definida. O pagamento é
				confirmado após verificação do comprovativo pela equipa.
				Ferramentas de destacar anúncios e aumentar a visibilidade de
				empresas são benefícios do plano escolhido.
			</p>
			<H2>5. Conduta</H2>
			<p>
				Não é permitido: assédio, burla, tentativas de phishing,
				divulgar dados pessoais de terceiros, fazer-se passar por outra
				pessoa ou utilizar a plataforma para qualquer atividade ilícita.
			</p>
			<H2>6. Alterações</H2>
			<p>
				Podemos atualizar estes termos. As alterações entram em vigor
				após publicação nesta página e são avisadas por email sempre que
				materialmente relevantes.
			</p>
			<p>Última atualização: {new Date().getFullYear()}.</p>
		</PageShell>
	);
}

export function PoliticasPage() {
	return (
		<PageShell
			title="Política de privacidade"
			lead="Explicamos como recolhemos, usamos e protegemos os teus dados pessoais quando usas a Caxinda Divulga."
		>
			<H2>Dados que recolhemos</H2>
			<ul className="list-disc space-y-1 pl-5">
				<li>Dados de conta: nome, email, telefone, fotografia.</li>
				<li>
					Conteúdo que publicas: anúncios, empresas, avaliações,
					mensagens.
				</li>
				<li>
					Dados de navegação: páginas visitadas e interações na
					plataforma.
				</li>
				<li>
					Verificação de identidade (KYC) quando submeteres os
					documentos.
				</li>
			</ul>
			<H2>Como usamos os dados</H2>
			<ul className="list-disc space-y-1 pl-5">
				<li>Para gerir a tua conta e as tuas publicações.</li>
				<li>Para mostrar anúncios, empresas e mensagens relevantes.</li>
				<li>Para melhorar a plataforma e prevenir fraude e abuso.</li>
				<li>Para te contactar sobre a tua conta e serviços.</li>
			</ul>
			<H2>Partilha de informações</H2>
			<p>
				Nunca vendemos os teus dados. Partilhamos informação com
				prestadores de serviços (armazenamento, envio de emails,
				verificação de identidade) apenas na medida necessária ao
				funcionamento da plataforma, e sempre sob nossas instruções.
			</p>
			<H2>Segurança e retenção</H2>
			<p>
				Usamos encriptação em trânsito e armazenamos os dados em
				serviços seguros. Conservamos os dados enquanto a conta estiver
				ativa e durante o prazo exigido por lei. Podes pedir a
				eliminação da conta a qualquer momento.
			</p>
			<H2>Os teus direitos</H2>
			<p>
				Podes aceder, corrigir ou apagar os teus dados, e exportar uma
				cópia. Para exerceres os teus direitos, contacta-nos pelo email
				indicado na página de contactos.
			</p>
		</PageShell>
	);
}

export function CookiesPage() {
	return (
		<PageShell
			title="Política de cookies"
			lead="Os cookies ajudam a plataforma a lembrar-se de ti e a funcionar melhor. Explicamos aqui quais usamos e porquê."
		>
			<H2>O que são cookies</H2>
			<p>
				São pequenos ficheiros guardados no teu navegador que permitem
				reconhecer o teu dispositivo e recordar as tuas preferências.
			</p>
			<H2>Cookies que usamos</H2>
			<ul className="list-disc space-y-1 pl-5">
				<li>
					Essenciais: manter a sessão iniciada e proteger a tua conta.
				</li>
				<li>
					Preferências: lembrar escolhas como província e vista da
					listagem.
				</li>
				<li>
					Analíticos: perceber como a plataforma é usada, de forma
					agregada e anónima, para melhorarmos.
				</li>
			</ul>
			<H2>Gerir cookies</H2>
			<p>
				Podes bloquear ou apagar cookies nas definições do teu
				navegador. Nota: sem os cookies essenciais, a sessão e algumas
				funcionalidades podem deixar de funcionar corretamente.
			</p>
			<H2>Contactos</H2>
			<p>
				Para dúvidas sobre cookies ou privacidade, escreve-nos pelo
				email indicado na página de contactos.
			</p>
		</PageShell>
	);
}

export function ContactosPage() {
	return (
		<PageShell
			title="Contactos"
			lead="Fala connosco. Respondemos a dúvidas sobre contas, anúncios, empresas, planos e parcerias."
		>
			<div className="rounded-2xl border border-ink/10 bg-white p-6">
				<ul className="space-y-4 text-sm">
					<li>
						<p className="font-mono text-xs font-bold uppercase tracking-widest text-kwanza">
							Email
						</p>
						<a
							href="mailto:geral@caxindadivulga.ao"
							className="text-ink hover:text-red"
						>
							geral@caxindadivulga.ao
						</a>
					</li>
					<li>
						<p className="font-mono text-xs font-bold uppercase tracking-widest text-kwanza">
							Suporte de contas
						</p>
						<a
							href="mailto:suporte@caxindadivulga.ao"
							className="text-ink hover:text-red"
						>
							suporte@caxindadivulga.ao
						</a>
					</li>
					<li>
						<p className="font-mono text-xs font-bold uppercase tracking-widest text-kwanza">
							Parcerias
						</p>
						<a
							href="mailto:parcerias@caxindadivulga.ao"
							className="text-ink hover:text-red"
						>
							parcerias@caxindadivulga.ao
						</a>
					</li>
					<li>
						<p className="font-mono text-xs font-bold uppercase tracking-widest text-kwanza">
							Localização
						</p>
						<p>Luanda, Angola — e servindo as 18 províncias.</p>
					</li>
				</ul>
			</div>
			<H2>Horário</H2>
			<p>
				Segunda a sexta, das 08h00 às 17h00 (hora de Luanda). Os emails
				são respondidos em até 1 dia útil.
			</p>
		</PageShell>
	);
}
