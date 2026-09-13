import type { AnalyticsDaily } from '../../types/api';

interface MiniChartProps {
	data: AnalyticsDaily[];
	metric?: 'views' | 'clicks';
	label?: string;
}

export function MiniChart({
	data,
	metric = 'views',
	label = 'Visualizações',
}: MiniChartProps) {
	const max = Math.max(1, ...(data ?? []).map((item) => item[metric] ?? 0));

	return (
		<div className="flex h-40 items-end gap-1" aria-label={label}>
			{(data ?? []).map((item) => {
				const value = item[metric] ?? 0;
				return (
					<div
						key={item.date}
						className="flex flex-1 flex-col items-center gap-1"
						title={`${item.date}: ${value} ${label.toLowerCase()}`}
					>
						<div
							className="w-full rounded-t bg-blue"
							style={{ height: `${(value / max) * 100}%` }}
						/>
					</div>
				);
			})}
			{data.length === 0 && (
				<p className="flex h-full flex-1 items-center justify-center text-xs text-ink/40">
					Sem dados neste período.
				</p>
			)}
		</div>
	);
}
