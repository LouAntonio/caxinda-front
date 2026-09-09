import { formatKz } from '../../lib/format';

interface PriceProps {
	value?: number | null;
	fallback?: string;
	free?: string;
}

export function Price({
	value,
	fallback = 'Sob consulta',
	free = 'Grátis',
}: PriceProps) {
	if (value === null || value === undefined) {
		return (
			<span className="font-mono text-sm font-bold text-ink/50">
				{fallback}
			</span>
		);
	}
	if (value === 0) {
		return (
			<span className="price-tag !bg-blue-light !text-white">{free}</span>
		);
	}
	return <span className="price-tag">{formatKz(value)}</span>;
}
