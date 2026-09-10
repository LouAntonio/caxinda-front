import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface DrawerProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
	'aria-label'?: string;
}

export function Drawer({
	open,
	onClose,
	children,
	'aria-label': ariaLabel,
}: DrawerProps) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleEscape = (e: globalThis.KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		if (open) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = '';
		};
	}, [open, onClose]);

	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				onClose();
			}
		};
		if (open) {
			document.addEventListener('mousedown', onClick);
		} else {
			document.removeEventListener('mousedown', onClick);
		}
		return () => document.removeEventListener('mousedown', onClick);
	}, [open, onClose]);

	if (!open) return null;

	return createPortal(
		<div
			className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
			role="dialog"
			aria-modal="true"
			aria-label={ariaLabel ?? 'Menu de navegação'}
		>
			<div
				ref={ref}
				className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out"
			>
				{children}
			</div>
		</div>,
		document.body,
	);
}
