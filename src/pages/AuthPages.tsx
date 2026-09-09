import { useState } from 'react';
import {
	Link,
	useLocation,
	useNavigate,
	useSearchParams,
} from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
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
import { GOOGLE_CLIENT_ID } from '../lib/env';
import { getApiError } from '../lib/api';
import { ButtonLoader } from '../components/ui/Spinner';
import { Spinner } from '../components/ui/Spinner';

function GoogleButton({
	onSuccess,
}: {
	onSuccess: (credential: string) => void;
}) {
	if (!GOOGLE_CLIENT_ID) {
		return null;
	}

	return (
		<GoogleLogin
			onSuccess={(response) => {
				if (response.credential) {
					onSuccess(response.credential);
				}
			}}
			onError={() =>
				toast.error('O login Google falhou. Tenta novamente.')
			}
			useOneTap={false}
			theme="outline"
			shape="rectangular"
			text="continue_with"
		/>
	);
}

function Divider() {
	return (
		<div className="my-4 flex items-center gap-3 text-xs font-bold text-ink/40">
			<span className="h-px flex-1 bg-ink/10" />
			OU
			<span className="h-px flex-1 bg-ink/10" />
		</div>
	);
}

// ================= Entrar =================

export function AuthLoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const from = (location.state as { from?: string } | null)?.from ?? '/';
	const login = useLoginEmail();
	const google = useGoogleSignIn();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const done = () => navigate(from, { replace: true });

	return (
		<div>
			<h1 className="font-display text-2xl font-black">Entrar</h1>
			<p className="mt-1 text-sm text-ink/60">
				Bem-vindo de volta à tua vitrine digital.
			</p>

			{GOOGLE_CLIENT_ID && (
				<>
					<div className="mt-6">
						<GoogleButton
							onSuccess={(credential) =>
								google.mutate(credential, {
									onSuccess: done,
									onError: (e) => toast.error(getApiError(e)),
								})
							}
						/>
					</div>
					<Divider />
				</>
			)}

			<form
				className="flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					login.mutate(
						{ email, password },
						{
							onSuccess: done,
							onError: (err) =>
								toast.error(
									getApiError(err, 'Credenciais inválidas.'),
								),
						},
					);
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
					<input
						id="password"
						type="password"
						className="input"
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
		</div>
	);
}

// ================= Registar =================

export function AuthRegisterPage() {
	const navigate = useNavigate();
	const signUp = useSignUpEmail();
	const sendVerification = useSendVerificationEmail();
	const google = useGoogleSignIn();
	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	return (
		<div>
			<h1 className="font-display text-2xl font-black">Criar conta</h1>
			<p className="mt-1 text-sm text-ink/60">
				Grátis. O teu negócio online em minutos.
			</p>

			{GOOGLE_CLIENT_ID && (
				<>
					<div className="mt-6">
						<GoogleButton
							onSuccess={(credential) =>
								google.mutate(credential, {
									onSuccess: () =>
										navigate('/', { replace: true }),
									onError: (e) => toast.error(getApiError(e)),
								})
							}
						/>
					</div>
					<Divider />
				</>
			)}

			<form
				className="flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					signUp.mutate(
						{ name, surname, email, password },
						{
							onSuccess: () => {
								toast.success(
									'Conta criada! Verifica o teu email para terminares o registo.',
								);
								sendVerification.mutate({
									email,
									callbackURL:
										window.location.origin +
										'/auth/verificar',
								});
							},
							onError: (err) => toast.error(getApiError(err)),
						},
					);
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
					<input
						id="rg-password"
						type="password"
						className="input"
						minLength={8}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						autoComplete="new-password"
					/>
					<p className="mt-1 text-xs text-ink/40">
						Mínimo 8 caracteres.
					</p>
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
		</div>
	);
}

// ================= Link mágico =================

export function AuthMagicPage() {
	const [email, setEmail] = useState('');
	const magic = useMagicLinkRequest();

	return (
		<div>
			<h1 className="font-display text-2xl font-black">
				Entrar por link mágico
			</h1>
			<p className="mt-1 text-sm text-ink/60">
				Evita palavras-passe. Enviamos-te um link seguro para o teu
				email.
			</p>
			<form
				className="mt-6 flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					magic.mutate(
						{
							email,
							callbackURL:
								window.location.origin +
								'/auth/verificar?tipo=magic',
						},
						{
							onSuccess: () =>
								toast.success(
									'Link enviado! Verifica o teu email.',
								),
							onError: (err) => toast.error(getApiError(err)),
						},
					);
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
		</div>
	);
}

// ================= Verificar (email / link mágico) =================

export function AuthVerifyPage() {
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
		(
			mutation.mutate as (
				arg: unknown,
				opts?: {
					onSuccess?: () => void;
					onError?: (err: unknown) => void;
				},
			) => void
		)(tipo === 'magic' ? token : { token }, {
			onSuccess: () => {
				setMessage(
					tipo === 'magic' ? 'Sessão iniciada!' : 'Email confirmado.',
				);
				toast.success(
					tipo === 'magic' ? 'Sessão iniciada!' : 'Email confirmado.',
				);
				if (tipo === 'magic') {
					setTimeout(() => navigate('/', { replace: true }), 900);
				}
			},
			onError: (err: unknown) => {
				setMessage(getApiError(err, 'Link inválido ou expirado.'));
			},
		});
	}

	return (
		<div className="text-center">
			<Spinner size={28} />
			<h1 className="mt-4 font-display text-xl font-black">{message}</h1>
			<p className="mt-2 text-sm text-ink/60">
				Segue as instruções no teu email para continuares.
			</p>
			<Link to="/auth/entrar" className="btn-primary mt-6">
				Ir para o login
			</Link>
		</div>
	);
}

// ================= Esqueci a password =================

export function AuthForgotPage() {
	const [email, setEmail] = useState('');
	const forgot = useForgetPassword();

	return (
		<div>
			<h1 className="font-display text-2xl font-black">
				Recuperar conta
			</h1>
			<p className="mt-1 text-sm text-ink/60">
				Indica o teu email e enviamos-te o link para definires uma nova
				palavra-passe.
			</p>
			<form
				className="mt-6 flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					forgot.mutate(
						{
							email,
							redirectTo:
								window.location.origin + '/auth/redefinir',
						},
						{
							onSuccess: () =>
								toast.success('Email de recuperação enviado.'),
							onError: (err) => toast.error(getApiError(err)),
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
		</div>
	);
}

// ================= Redefinir password =================

export function AuthResetPage() {
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token') ?? '';
	const navigate = useNavigate();
	const reset = useResetPassword();
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');

	return (
		<div>
			<h1 className="font-display text-2xl font-black">
				Nova palavra-passe
			</h1>
			<p className="mt-1 text-sm text-ink/60">
				Escolhe uma palavra-passe segura.
			</p>
			<form
				className="mt-6 flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					if (password !== confirm) {
						toast.error('As palavras-passe não coincidem.');
						return;
					}
					reset.mutate(
						{ newPassword: password, token },
						{
							onSuccess: () => {
								toast.success(
									'Palavra-passe atualizada. Entra já.',
								);
								void navigate('/auth/entrar', {
									replace: true,
								});
							},
							onError: (err) => toast.error(getApiError(err)),
						},
					);
				}}
			>
				<div>
					<label className="label" htmlFor="rs-password">
						Nova palavra-passe
					</label>
					<input
						id="rs-password"
						type="password"
						className="input"
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
					<input
						id="rs-confirm"
						type="password"
						className="input"
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
		</div>
	);
}
