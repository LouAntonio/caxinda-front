import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface LightboxProps {
	images: string[];
	index: number | null;
	onClose: () => void;
}

export function Lightbox({ images, index, onClose }: LightboxProps) {
	const [active, setActive] = useState(index ?? 0);

	useEffect(() => {
		if (index !== null) setActive(index);
	}, [index]);

	useEffect(() => {
		if (index === null) return;
		const handleKey = (e: globalThis.KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			} else if (e.key === 'ArrowRight') {
				setActive((i) => (i + 1) % images.length);
			} else if (e.key === 'ArrowLeft') {
				setActive((i) => (i - 1 + images.length) % images.length);
			}
		};
		document.addEventListener('keydown', handleKey);
		document.body.style.overflow = 'hidden';
		return () => {
			document.removeEventListener('keydown', handleKey);
			document.body.style.overflow = '';
		};
	}, [index, images.length, onClose]);

	if (index === null || images.length === 0) return null;

	const current = images[active];

	return createPortal(
		<div
			className="fixed inset-0 z-[60] flex flex-col bg-black/90"
			role="dialog"
			aria-modal="true"
			aria-label="Visualizador de fotografias"
			onClick={onClose}
		>
			<div className="flex items-center justify-between px-4 py-3 text-white">
				<span className="font-mono text-xs uppercase tracking-widest text-white/70">
					{active + 1} / {images.length}
				</span>
				<button
					type="button"
					onClick={onClose}
					className="rounded-lg border border-white/20 px-3 py-1.5 text-sm font-bold text-white transition hover:bg-white/10"
					aria-label="Fechar"
				>
					✕
				</button>
			</div>
			<div className="relative flex min-h-0 flex-1 items-center justify-center px-16">
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						setActive((active - 1 + images.length) % images.length);
					}}
					className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
					aria-label="Anterior"
				>
					◀
				</button>
				<img
					src={current}
					alt=""
					onClick={(e) => e.stopPropagation()}
					className="max-h-full max-w-full rounded-lg object-contain"
				/>
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						setActive((i) => (i + 1) % images.length);
					}}
					className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
					aria-label="Seguinte"
				>
					▶
				</button>
			</div>
			<div className="flex justify-center gap-2 overflow-x-auto px-4 py-3">
				{images.map((url, i) => (
					<button
						type="button"
						key={`${url}-${i}`}
						onClick={(e) => {
							e.stopPropagation();
							setActive(i);
						}}
						className={`h-12 w-16 shrink-0 overflow-hidden rounded-md border-2 transition ${
							i === active
								? 'border-white'
								: 'border-transparent opacity-60 hover:opacity-100'
						}`}
					>
						<img
							src={url}
							alt=""
							className="h-full w-full object-cover"
						/>
					</button>
				))}
			</div>
		</div>,
		document.body,
	);
}
