import type { AnalyticsQuery, AnalyticsRange } from '../../types/api';

interface RangePickerProps {
	range: AnalyticsRange;
	custom: boolean;
	from: string;
	to: string;
	onRangeChange: (range: AnalyticsRange) => void;
	onCustomToggle: () => void;
	onFromChange: (value: string) => void;
	onToChange: (value: string) => void;
}

const ranges: AnalyticsRange[] = ['7d', '30d', '90d', '180d', '365d'];

export function RangePicker({
	range,
	custom,
	from,
	to,
	onRangeChange,
	onCustomToggle,
	onFromChange,
	onToChange,
}: RangePickerProps) {
	return (
		<div className="flex flex-wrap items-center gap-2">
			<div className="flex flex-wrap gap-1.5">
				{ranges.map((item) => (
					<button
						key={item}
						type="button"
						onClick={() => onRangeChange(item)}
						className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
							!custom && range === item
								? 'bg-ink text-white'
								: 'bg-ink/5 text-ink/70 hover:bg-ink/10'
						}`}
					>
						{item}
					</button>
				))}
				<button
					type="button"
					onClick={onCustomToggle}
					className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
						custom
							? 'bg-blue text-white'
							: 'bg-ink/5 text-ink/70 hover:bg-ink/10'
					}`}
				>
					Personalizado
				</button>
			</div>
			{custom && (
				<div className="flex flex-wrap items-center gap-2">
					<input
						type="date"
						aria-label="Data inicial"
						className="input !py-1.5 text-xs"
						value={from}
						onChange={(event) => onFromChange(event.target.value)}
					/>
					<span className="text-xs text-ink/40">até</span>
					<input
						type="date"
						aria-label="Data final"
						className="input !py-1.5 text-xs"
						value={to}
						onChange={(event) => onToChange(event.target.value)}
					/>
				</div>
			)}
		</div>
	);
}

export function analyticsQuery(
	range: AnalyticsRange,
	custom: boolean,
	from: string,
	to: string,
): AnalyticsQuery {
	if (!custom) {
		return { range };
	}
	return {
		from: from || undefined,
		to: to || undefined,
	};
}
