import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useSocketEvents } from '../../hooks/useSocketEvents';
import { useSession } from '../../hooks/useSession';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { useConversations } from '../../hooks/queries';
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
