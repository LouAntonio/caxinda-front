import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useSocketEvents } from '../../hooks/useSocketEvents';
import { useSession } from '../../hooks/useSession';
import { PageLoader } from '../ui/Spinner';
import type { Role } from '../../types/api';

export function AppLayout() {
	useSocketEvents();
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
		return <PageLoader />;
	}
	if (!isAuthenticated) {
		return (
			<Navigate to="/auth/entrar" state={{ from: location }} replace />
		);
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
		return <PageLoader />;
	}
	if (!isAuthenticated) {
		return <Navigate to="/auth/entrar" replace />;
	}
	if (!user || !roles.includes(user.role)) {
		return <Navigate to="/area" replace />;
	}
	return <>{children}</>;
}

export function useScrollToTop() {
	const { pathname } = useLocation();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);
}
