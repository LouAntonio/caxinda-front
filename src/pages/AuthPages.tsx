import { useState, type ReactNode } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import {
	Link,
	useLocation,
	useNavigate,
	useSearchParams,
} from 'react-router-dom';
import toast from 'react-hot-toast';
import {
	useForgetPassword,
	useGoogleSignIn,
	useLoginEmail,
	useMagicLinkRequest,
	useMagicLinkVerify,
	useResetPassword,
	useSendVerificationEmail,
	useSignUpEmail,
	useVerifyEmail,
} from '../hooks/mutations';
import { getApiError } from '../lib/api';
import { ButtonLoader } from '../components/ui/Spinner';
import { Spinner } from '../components/ui/Spinner';
import { PasswordInput } from '../components/ui/PasswordInput';
import { GoogleButton } from '../components/ui/GoogleButton';

function Divider() {
	return (
		<div className="my-4 flex items-center gap-3 text-xs font-bold text-ink/40">
			<span className="h-px flex-1 bg-ink/10" />
			OU
			<span className="h-px flex-1 bg-ink/10" />
		</div>
	);
}

function AuthCard({
	kicker,
	title,
	subtitle,
	children,
}: {
	kicker: string;
	title: string;
	subtitle: string;
	children: ReactNode;
}) {
	return (
		<div className="rounded-2xl border border-ink/10 bg-white p-8 shadow-sm">
			<span className="kicker text-kwanza">{kicker}</span>
			<h1 className="mt-3 font-display text-2xl font-black">{title}</h1>
			<p className="mt-1 text-sm text-ink/55">{subtitle}</p>
			{children}
		</div>
	);
}

// ================= Entrar =================

export function AuthLoginPage() {
	usePageTitle('Entrar');
	const navigate = useNavigate();
	const location = useLocation();
	const from = (location.state as { from?: string } | null)?.from ?? '/';
	const login = useLoginEmail();
	const google = useGoogleSignIn();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const done = () => navigate(from, { replace: true });

	return (
		<AuthCard
			kicker="Bem-vindo"
			title="Entrar"
			subtitle="Bem-vindo de volta à tua vitrine digital."
		>
			<div className="mt-6">
				<GoogleButton
					onSuccess={(credential) =>
						void toast
							.promise(google.mutateAsync(credential), {
								loading: 'A entrar com Google…',
								success: 'Sessão iniciada.',
								error: (err) => getApiError(err),
							})
							.then(done)
					}
				/>
			</div>
			<Divider />

			<form
				className="flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					void toast
						.promise(login.mutateAsync({ email, password }), {
							loading: 'A entrar…',
							success: 'Sessão iniciada.',
							error: (err) =>
								getApiError(err, 'Credenciais inválidas.'),
						})
						.then(done);
				}}
			>
				<div>
					<label className="label" htmlFor="email">
						Email
					</label>
					<input
						id="email"
						type="email"
						className="input"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						autoComplete="email"
					/>
				</div>
				<div>
					<label className="label" htmlFor="password">
						Palavra-passe
					</label>
					<PasswordInput
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						autoComplete="current-password"
					/>
				</div>
				<div className="flex items-center justify-between text-sm">
					<Link
						to="/auth/magic"
						className="font-bold text-blue hover:underline"
					>
						Entrar com link mágico
					</Link>
					<Link
						to="/auth/esqueci"
						className="font-bold text-red hover:underline"
					>
						Esqueci a palavra-passe
					</Link>
				</div>
				<button
					className="btn-primary w-full"
					disabled={login.isPending}
				>
					{login.isPending && <ButtonLoader />} Entrar
				</button>
			</form>

			<p className="mt-6 text-center text-sm text-ink/60">
				Ainda não tens conta?{' '}
				<Link
					to="/auth/registar"
					className="font-bold text-blue hover:underline"
				>
					Criar conta
				</Link>
			</p>
		</AuthCard>
	);
}

// ================= Registar =================

export function AuthRegisterPage() {
	usePageTitle('Criar conta');
	const navigate = useNavigate();
	const signUp = useSignUpEmail();
	const sendVerification = useSendVerificationEmail();
	const google = useGoogleSignIn();
	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const passwordsDontMatch =
		confirmPassword.length > 0 && password !== confirmPassword;

	return (
		<AuthCard
			kicker="Grátis"
			title="Criar conta"
			subtitle="O teu negócio online em minutos."
		>
			<div className="mt-6">
				<GoogleButton
					onSuccess={(credential) =>
						void toast
							.promise(google.mutateAsync(credential), {
								loading: 'A entrar com Google…',
								success: 'Sessão iniciada.',
								error: (err) => getApiError(err),
							})
							.then(() => navigate('/', { replace: true }))
					}
				/>
			</div>
			<Divider />

			<form
				className="flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					if (passwordsDontMatch) {
						toast.error('As palavras-passe não coincidem.');
						return;
					}
					void toast
						.promise(
							signUp.mutateAsync({
								name,
								surname,
								email,
								password,
							}),
							{
								loading: 'A criar conta…',
								success:
									'Conta criada! Verifica o teu email para terminares o registo.',
								error: (err) => getApiError(err),
							},
						)
						.then(() => {
							sendVerification.mutate({
								email,
								callbackURL:
									window.location.origin + '/auth/verificar',
							});
						});
				}}
			>
				<div className="grid grid-cols-2 gap-3">
					<div>
						<label className="label" htmlFor="rg-name">
							Nome
						</label>
						<input
							id="rg-name"
							className="input"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					<div>
						<label className="label" htmlFor="rg-surname">
							Apelido
						</label>
						<input
							id="rg-surname"
							className="input"
							value={surname}
							onChange={(e) => setSurname(e.target.value)}
							required
						/>
					</div>
				</div>
				<div>
					<label className="label" htmlFor="rg-email">
						Email
					</label>
					<input
						id="rg-email"
						type="email"
						className="input"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						autoComplete="email"
					/>
				</div>
				<div>
					<label className="label" htmlFor="rg-password">
						Palavra-passe
					</label>
					<PasswordInput
						id="rg-password"
						minLength={8}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						autoComplete="new-password"
						aria-invalid={passwordsDontMatch || undefined}
					/>
					<p className="mt-1 text-xs text-ink/40">
						Mínimo 8 caracteres.
					</p>
				</div>
				<div>
					<label className="label" htmlFor="rg-confirm">
						Confirmar palavra-passe
					</label>
					<PasswordInput
						id="rg-confirm"
						minLength={8}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						autoComplete="new-password"
						aria-invalid={passwordsDontMatch || undefined}
					/>
					{passwordsDontMatch && (
						<p className="mt-1 text-xs font-bold text-red">
							As palavras-passe não coincidem.
						</p>
					)}
				</div>
				<button
					className="btn-primary w-full"
					disabled={signUp.isPending}
				>
					{signUp.isPending && <ButtonLoader />} Criar conta
				</button>
			</form>

			<p className="mt-6 text-center text-sm text-ink/60">
				Já tens conta?{' '}
				<Link
					to="/auth/entrar"
					className="font-bold text-blue hover:underline"
				>
					Entrar
				</Link>
			</p>
		</AuthCard>
	);
}

// ================= Link mágico =================

export function AuthMagicPage() {
	usePageTitle('Entrar por link mágico');
	const [email, setEmail] = useState('');
	const magic = useMagicLinkRequest();

	return (
		<AuthCard
			kicker="Sem password"
			title="Entrar por link mágico"
			subtitle="Evita palavras-passe. Enviamos-te um link seguro para o teu email."
		>
			<form
				className="mt-6 flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					void toast.promise(magic.mutateAsync({ email }), {
						loading: 'A enviar o link…',
						success: 'Link enviado! Verifica o teu email.',
						error: (err) => getApiError(err),
					});
				}}
			>
				<div>
					<label className="label" htmlFor="ml-email">
						Email
					</label>
					<input
						id="ml-email"
						type="email"
						className="input"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						autoComplete="email"
					/>
				</div>
				<button
					className="btn-primary w-full"
					disabled={magic.isPending}
				>
					{magic.isPending && <ButtonLoader />} Enviar link mágico
				</button>
			</form>
			<p className="mt-6 text-center text-sm text-ink/60">
				Prefere password?{' '}
				<Link
					to="/auth/entrar"
					className="font-bold text-blue hover:underline"
				>
					Entrar
				</Link>
			</p>
		</AuthCard>
	);
}

// ================= Verificar (email / link mágico) =================

export function AuthVerifyPage() {
	usePageTitle('Verificar');
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const tipo = searchParams.get('tipo') ?? 'email';
	const token = searchParams.get('token') ?? '';
	const magicVerify = useMagicLinkVerify();
	const emailVerify = useVerifyEmail();
	const [sentRequest, setSentRequest] = useState(false);
	const [message, setMessage] = useState('A confirmar…');

	if (!sentRequest && token) {
		setSentRequest(true);
		const mutation = tipo === 'magic' ? magicVerify : emailVerify;
		const arg = tipo === 'magic' ? token : { token };
		void toast
			.promise(
				(mutation.mutateAsync as (input: unknown) => Promise<unknown>)(
					arg,
				),
				{
					loading: 'A confirmar…',
					success:
						tipo === 'magic'
							? 'Sessão iniciada!'
							: 'Email confirmado.',
					error: (err) =>
						getApiError(err, 'Link inválido ou expirado.'),
				},
			)
			.then(() => {
				setMessage(
					tipo === 'magic' ? 'Sessão iniciada!' : 'Email confirmado.',
				);
				if (tipo === 'magic') {
					setTimeout(() => navigate('/', { replace: true }), 900);
				}
			})
			.catch((err: unknown) => {
				setMessage(getApiError(err, 'Link inválido ou expirado.'));
			});
	}

	return (
		<AuthCard
			kicker="A confirmar"
			title={message}
			subtitle="Segue as instruções no teu email para continuares."
		>
			<div className="mt-6 flex flex-col items-center gap-4">
				<Spinner size={28} />
				<Link to="/auth/entrar" className="btn-primary">
					Ir para o login
				</Link>
			</div>
		</AuthCard>
	);
}

// ================= Esqueci a password =================

export function AuthForgotPage() {
	usePageTitle('Recuperar conta');
	const [email, setEmail] = useState('');
	const forgot = useForgetPassword();

	return (
		<AuthCard
			kicker="Esqueceste?"
			title="Recuperar conta"
			subtitle="Indica o teu email e enviamos-te o link para definires uma nova palavra-passe."
		>
			<form
				className="mt-6 flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					void toast.promise(
						forgot.mutateAsync({
							email,
							redirectTo:
								window.location.origin + '/auth/redefinir',
						}),
						{
							loading: 'A enviar o email…',
							success: 'Email de recuperação enviado.',
							error: (err) => getApiError(err),
						},
					);
				}}
			>
				<div>
					<label className="label" htmlFor="fg-email">
						Email
					</label>
					<input
						id="fg-email"
						type="email"
						className="input"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						autoComplete="email"
					/>
				</div>
				<button
					className="btn-primary w-full"
					disabled={forgot.isPending}
				>
					{forgot.isPending && <ButtonLoader />} Enviar link
				</button>
			</form>
			<p className="mt-6 text-center text-sm text-ink/60">
				Voltar a{' '}
				<Link
					to="/auth/entrar"
					className="font-bold text-blue hover:underline"
				>
					entrar
				</Link>
			</p>
		</AuthCard>
	);
}

// ================= Redefinir password =================

export function AuthResetPage() {
	usePageTitle('Definir nova palavra-passe');
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token') ?? '';
	const navigate = useNavigate();
	const reset = useResetPassword();
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');

	return (
		<AuthCard
			kicker="Redefinir"
			title="Nova palavra-passe"
			subtitle="Escolhe uma palavra-passe segura."
		>
			<form
				className="mt-6 flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					if (password !== confirm) {
						toast.error('As palavras-passe não coincidem.');
						return;
					}
					void toast
						.promise(
							reset.mutateAsync({
								newPassword: password,
								token,
							}),
							{
								loading: 'A atualizar…',
								success: 'Palavra-passe atualizada. Entra já.',
								error: (err) => getApiError(err),
							},
						)
						.then(() =>
							navigate('/auth/entrar', { replace: true }),
						);
				}}
			>
				<div>
					<label className="label" htmlFor="rs-password">
						Nova palavra-passe
					</label>
					<PasswordInput
						id="rs-password"
						minLength={8}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						autoComplete="new-password"
					/>
				</div>
				<div>
					<label className="label" htmlFor="rs-confirm">
						Confirmar
					</label>
					<PasswordInput
						id="rs-confirm"
						minLength={8}
						value={confirm}
						onChange={(e) => setConfirm(e.target.value)}
						required
						autoComplete="new-password"
					/>
				</div>
				<button
					className="btn-primary w-full"
					disabled={reset.isPending}
				>
					{reset.isPending && <ButtonLoader />} Definir palavra-passe
				</button>
			</form>
		</AuthCard>
	);
}
