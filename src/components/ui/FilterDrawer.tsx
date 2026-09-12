import type { ReactNode } from 'react';

export function MobileFilterDrawer({
	open,
	onClose,
	children,
}: {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
}) {
	return (
		<div
			className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`}
			aria-hidden={!open}
		>
			<div
				className={`absolute inset-0 bg-ink/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
				onClick={onClose}
			/>
			<aside
				className={`nice-scroll absolute inset-y-0 left-0 w-80 max-w-[88vw] overflow-y-auto bg-white p-4 shadow-2xl transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}
				role="dialog"
				aria-label="Filtros"
			>
				<div className="mb-4 flex items-center justify-between border-b border-ink/10 pb-3">
					<p className="kicker">Filtros</p>
					<button
						type="button"
						onClick={onClose}
						className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-ink/50 transition hover:bg-snow hover:text-ink"
						aria-label="Fechar filtros"
					>
						✕
					</button>
				</div>
				{children}
			</aside>
		</div>
	);
}
