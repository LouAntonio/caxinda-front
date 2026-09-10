import { Link, Outlet } from 'react-router-dom';
import { Logo } from './Logo';
import { useScrollToTop } from '../../hooks/useScrollToTop';

export function AuthLayout() {
	useScrollToTop();
	return (
		<div className="flex min-h-screen flex-col bg-snow">
			<div className="border-b border-ink/10 bg-white/50">
				<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
					<Logo />
					<Link to="/" className="btn-ghost">
						← Voltar
					</Link>
				</div>
			</div>
			<main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
				<Outlet />
			</main>
		</div>
	);
}
