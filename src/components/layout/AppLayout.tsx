import { useEffect } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useSocketEvents } from '../../hooks/useSocketEvents';
import { useSession } from '../../hooks/useSession';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { useConversations, useMyKyc } from '../../hooks/queries';
import { useChatStore } from '../../store/chat';
import { PageShellSkeleton } from '../skeletons/ListSkeletons';
import type { Role } from '../../types/api';

function useUnreadSync() {
	const { isAuthenticated } = useSession();
	const { data } = useConversations();
	const setUnread = useChatStore((s) => s.setUnread);

	useEffect(() => {
		if (!isAuthenticated || !data) return;
		for (const c of data.items) {
			if (c.unreadCount > 0) setUnread(c.id, c.unreadCount);
		}
	}, [data, isAuthenticated, setUnread]);
}

export function AppLayout() {
	useSocketEvents();
	useScrollToTop();
	useUnreadSync();
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useSession();
	const location = useLocation();

	if (isLoading) {
		return <PageShellSkeleton />;
	}
	if (!isAuthenticated) {
		return (
			<Navigate to="/auth/entrar" state={{ from: location }} replace />
		);
	}
	return <>{children}</>;
}

export function RequireGuest({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useSession();

	if (isLoading) {
		return <>{children}</>;
	}
	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}
	return <>{children}</>;
}

export function RequireRole({
	roles,
	children,
}: {
	roles: Role[];
	children: React.ReactNode;
}) {
	const { user, isAuthenticated, isLoading } = useSession();

	if (isLoading) {
		return <PageShellSkeleton />;
	}
	if (!isAuthenticated) {
		return <Navigate to="/auth/entrar" replace />;
	}
	if (!user || !roles.includes(user.role)) {
		return <Navigate to="/area" replace />;
	}
	return <>{children}</>;
}

export function RequireBusiness({ children }: { children: React.ReactNode }) {
	const { user, isAuthenticated, isLoading } = useSession();
	const { data: kyc } = useMyKyc();

	if (isLoading) {
		return <PageShellSkeleton />;
	}
	if (!isAuthenticated) {
		return <Navigate to="/auth/entrar" replace />;
	}
	if (user?.isVerified || (user && user.role !== 'USER')) {
		return <>{children}</>;
	}

	return (
		<div className="mx-auto max-w-6xl px-4 py-10">
			{kyc?.status === 'PENDING' ? (
				<div className="card flex items-start gap-4 p-6">
					<span className="text-4xl">⏳</span>
					<div>
						<h1 className="font-display text-xl font-black">
							Conversão em análise
						</h1>
						<p className="mt-1 text-sm leading-relaxed text-ink/60">
							Os teus documentos estão a ser verificados. Assim
							que for aprovado, a tua conta passa a{' '}
							<strong>Empresarial</strong> e terás acesso a
							empresas, planos e pagamentos.
						</p>
						<p className="mt-3 text-xs font-bold text-ink/40">
							A análise demora até 48h.
						</p>
					</div>
				</div>
			) : (
				<div className="card overflow-hidden">
					<div className="h-1.5 bg-kwanza" />
					<div className="p-8">
						<p className="inline-block -rotate-2 rounded-lg bg-red px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow">
							Conta pessoal
						</p>
						<h1 className="mt-4 text-balance font-display text-3xl font-black leading-tight">
							Converte para conta Empresarial
						</h1>
						<p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/60">
							Esta área é exclusiva de contas empresariais. Ao
							verificar a tua identidade, fica disponível o acesso
							a:
						</p>
						<ul className="mt-4 flex max-w-xl flex-col gap-2 text-sm text-ink/80">
							<li className="flex items-start gap-2">
								<span className="mt-0.5 font-black text-kwanza">
									★
								</span>{' '}
								<strong>As tuas empresas</strong> — cria e gere
								o teu negócio na Caxinda
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-0.5 font-black text-kwanza">
									★
								</span>{' '}
								<strong>Planos e subscrições</strong> — ganha
								visibilidade com planos pagos
							</li>
							<li className="flex items-start gap-2">
								<span className="mt-0.5 font-black text-kwanza">
									★
								</span>{' '}
								<strong>Pagamentos</strong> — acompanha os teus
								pagamentos de planos
							</li>
						</ul>
						{kyc?.status === 'REJECTED' && (
							<p className="mt-4 max-w-xl rounded-xl bg-red/10 px-4 py-3 text-sm text-red">
								<strong>Rejeitado:</strong>{' '}
								{kyc.rejectionReason ??
									'Documentos ilegíveis. Tenta novamente.'}
							</p>
						)}
						<Link
							to="/area/verificacao"
							className="btn-primary mt-6 inline-flex"
						>
							Converter para conta Empresarial
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
