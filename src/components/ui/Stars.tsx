import { formatRating } from '../../lib/format';

export function Stars({
	value,
	size = 16,
}: {
	value: number | null | undefined;
	size?: number;
}) {
	if (value === null || value === undefined) {
		return (
			<span className="text-xs font-bold text-ink/40">
				Sem avaliações
			</span>
		);
	}
	const rounded = Math.round(value);
	return (
		<span
			className="inline-flex items-center gap-1"
			title={`${formatRating(value)} de 5`}
		>
			<span className="inline-flex" aria-hidden>
				{[1, 2, 3, 4, 5].map((i) => (
					<svg
						key={i}
						width={size}
						height={size}
						viewBox="0 0 24 24"
						className={i <= rounded ? 'fill-kwanza' : 'fill-ink/15'}
					>
						<path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.4 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
					</svg>
				))}
			</span>
			<span className="font-mono text-xs font-bold text-ink/70">
				{formatRating(value)}
			</span>
		</span>
	);
}
