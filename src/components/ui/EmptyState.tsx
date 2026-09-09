import type { ReactNode } from 'react';

interface EmptyStateProps {
	icon?: ReactNode;
	title: string;
	description?: string;
	action?: ReactNode;
}

export function EmptyState({
	icon,
	title,
	description,
	action,
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ink/15 bg-white px-6 py-14 text-center">
			{icon ? (
				<div className="text-4xl">{icon}</div>
			) : (
				<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-snow-dark font-display text-lg text-ink/40">
					∅
				</div>
			)}
			<h3 className="font-display text-sm font-bold text-ink">{title}</h3>
			{description && (
				<p className="max-w-sm text-sm text-ink/60">{description}</p>
			)}
			{action && <div className="mt-2">{action}</div>}
		</div>
	);
}
