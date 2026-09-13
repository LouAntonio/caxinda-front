import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	wide?: boolean;
}

export function Modal({ open, onClose, title, children, wide }: ModalProps) {
	useEffect(() => {
		if (!open) return;
		const handleKey = (e: globalThis.KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		document.addEventListener('keydown', handleKey);
		document.body.style.overflow = 'hidden';
		return () => {
			document.removeEventListener('keydown', handleKey);
			document.body.style.overflow = '';
		};
	}, [open, onClose]);

	if (!open) return null;

	return createPortal(
		<div
			className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
			role="dialog"
			aria-modal="true"
			aria-label={title ?? 'Detalhes'}
			onClick={onClose}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className={`nice-scroll max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl ${
					wide ? 'max-w-3xl' : 'max-w-xl'
				}`}
			>
				<div className="mb-4 flex items-center justify-between gap-3">
					<h2 className="font-display text-lg font-black">{title}</h2>
					<button
						type="button"
						onClick={onClose}
						className="btn-ghost !px-3 !py-1.5"
						aria-label="Fechar"
					>
						✕
					</button>
				</div>
				{children}
			</div>
		</div>,
		document.body,
	);
}
