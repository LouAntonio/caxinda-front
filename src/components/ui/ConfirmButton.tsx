import { useState } from 'react';
import { Spinner } from './Spinner';

interface ConfirmButtonProps {
	onConfirm: () => void;
	confirmLabel?: string;
	title: string;
	message: string;
	busy?: boolean;
	children: React.ReactNode;
	className?: string;
}

export function ConfirmButton({
	onConfirm,
	confirmLabel = 'Confirmar',
	title,
	message,
	busy,
	children,
	className,
}: ConfirmButtonProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<span className={className} onClick={() => setOpen(true)}>
				{children}
			</span>
			{open && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
					onClick={() => !busy && setOpen(false)}
				>
					<div
						className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
						onClick={(e) => e.stopPropagation()}
					>
						<h3 className="font-display text-base font-bold">
							{title}
						</h3>
						<p className="mt-2 text-sm text-ink/60">{message}</p>
						<div className="mt-6 flex justify-end gap-2">
							<button
								type="button"
								className="btn-outline"
								disabled={busy}
								onClick={() => setOpen(false)}
							>
								Cancelar
							</button>
							<button
								type="button"
								className="btn-primary"
								disabled={busy}
								onClick={() => {
									onConfirm();
									setOpen(false);
								}}
							>
								{busy && <Spinner size={16} />}
								{confirmLabel}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
