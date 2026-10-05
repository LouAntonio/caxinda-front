import { formatKz } from '../../lib/format';

interface PriceProps {
	value?: number | null;
	fallback?: string;
	free?: string;
	/**
	 * `default` = etiqueta vermelha sobre fundo claro (listagens, admin, área).
	 * `band`    = número mono vermelho sobre a faixa tinta do cartão de produto.
	 */
	variant?: 'default' | 'band';
	/** Classes extra aplicadas ao elemento do preço. */
	className?: string;
}

export function Price({
	value,
	fallback = 'Sob consulta',
	free = 'Grátis',
	variant = 'default',
	className = '',
}: PriceProps) {
	if (variant === 'band') {
		if (value === null || value === undefined) {
			return (
				<span
					className={`font-mono text-sm font-bold text-white/55 ${className}`}
				>
					{fallback}
				</span>
			);
		}
		if (value === 0) {
			return (
				<span
					className={`font-mono text-[0.95rem] font-bold text-blue-light ${className}`}
				>
					{free}
				</span>
			);
		}
		return (
			<span
				className={`font-mono text-[0.95rem] font-bold tracking-tight text-red-light tabular-nums ${className}`}
			>
				{formatKz(value)}
			</span>
		);
	}

	if (value === null || value === undefined) {
		return (
			<span
				className={`font-mono text-sm font-bold text-ink/50 ${className}`}
			>
				{fallback}
			</span>
		);
	}
	if (value === 0) {
		return (
			<span
				className={`price-tag !bg-blue-light !text-white ${className}`}
			>
				{free}
			</span>
		);
	}
	return <span className={`price-tag ${className}`}>{formatKz(value)}</span>;
}
