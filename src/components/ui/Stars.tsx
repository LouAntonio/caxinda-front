import { formatRating } from '../../lib/format';

export function Stars({
	value,
	size = 16,
	onDark = false,
}: {
	value: number | null | undefined;
	size?: number;
	/** Sobre fundo escuro (ex.: a faixa de preço do cartão de produto). */
	onDark?: boolean;
}) {
	if (value === null || value === undefined) {
		return (
			<span
				className={`text-xs font-bold ${onDark ? 'text-white/55' : 'text-ink/40'}`}
			>
				Sem avaliações
			</span>
		);
	}
	const rounded = Math.round(value);
	const empty = onDark ? 'fill-white/25' : 'fill-ink/15';
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
						className={i <= rounded ? 'fill-red' : empty}
					>
						<path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.4 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
					</svg>
				))}
			</span>
			<span
				className={`font-mono text-xs font-bold ${onDark ? 'text-white/70' : 'text-ink/70'}`}
			>
				{formatRating(value)}
			</span>
		</span>
	);
}
