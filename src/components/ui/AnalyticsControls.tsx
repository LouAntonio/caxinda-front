import type { AnalyticsGroupBy } from '../../types/api';

export function SegmentToggle<T extends string>({
	options,
	value,
	onChange,
	ariaLabel,
}: {
	options: Array<{ value: T; label: string; disabled?: boolean }>;
	value: T;
	onChange: (value: T) => void;
	ariaLabel: string;
}) {
	return (
		<div
			className="flex rounded-full bg-ink/5 p-0.5"
			aria-label={ariaLabel}
		>
			{options.map((option) => {
				const active = !option.disabled && value === option.value;
				return (
					<button
						key={option.value}
						type="button"
						disabled={option.disabled}
						onClick={() => onChange(option.value)}
						className={`rounded-full px-3 py-1 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
							active
								? 'bg-blue text-white'
								: 'text-ink/60 hover:text-ink'
						}`}
					>
						{option.label}
					</button>
				);
			})}
		</div>
	);
}

const GROUP_BY_OPTIONS: Array<{ value: AnalyticsGroupBy; label: string }> = [
	{ value: 'day', label: 'Dia' },
	{ value: 'week', label: 'Semana' },
	{ value: 'month', label: 'Mês' },
];

export function GroupByToggle({
	value,
	onChange,
}: {
	value: AnalyticsGroupBy;
	onChange: (value: AnalyticsGroupBy) => void;
}) {
	return (
		<SegmentToggle
			ariaLabel="Agrupamento do gráfico"
			options={GROUP_BY_OPTIONS}
			value={value}
			onChange={onChange}
		/>
	);
}

export function MetricToggle({
	value,
	onChange,
	showClicks,
}: {
	value: 'views' | 'clicks';
	onChange: (value: 'views' | 'clicks') => void;
	showClicks: boolean;
}) {
	return (
		<SegmentToggle
			ariaLabel="Métrica do gráfico"
			options={[
				{ value: 'views', label: 'Visualizações' },
				{ value: 'clicks', label: 'Cliques', disabled: !showClicks },
			]}
			value={value}
			onChange={onChange}
		/>
	);
}

const RANGE_LABELS: Record<string, string> = {
	'7d': 'Últimos 7 dias',
	'30d': 'Últimos 30 dias',
	'90d': 'Últimos 90 dias',
	'180d': 'Últimos 180 dias',
	'365d': 'Últimos 365 dias',
	'730d': 'Últimos 2 anos',
};

export function periodLabel(
	range: string,
	custom: boolean,
	from: string,
	to: string,
): string {
	if (custom) {
		return `${from || '—'} a ${to || '—'}`;
	}
	return RANGE_LABELS[range] ?? `Últimos ${range}`;
}
