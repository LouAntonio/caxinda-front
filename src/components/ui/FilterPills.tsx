interface FilterPill {
	id: string;
	name: string;
	count?: number;
}

interface FilterPillsProps {
	label: string;
	items: FilterPill[];
	selected: string[];
	onToggle: (id: string) => void;
}

export function FilterPills({
	label,
	items,
	selected,
	onToggle,
}: FilterPillsProps) {
	return (
		<div>
			<p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/50">
				{label}
			</p>
			<div className="flex flex-wrap gap-1.5">
				{items.map((item) => {
					const isSelected = selected.includes(item.id);
					return (
						<button
							key={item.id}
							type="button"
							onClick={() => onToggle(item.id)}
							className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${
								isSelected
									? 'bg-ink text-white'
									: 'bg-ink/5 text-ink/70 hover:bg-ink/10'
							}`}
						>
							{item.name}
							{item.count != null && (
								<span
									className={`font-mono ${
										isSelected
											? 'text-white/60'
											: 'text-ink/40'
									}`}
								>
									{item.count}
								</span>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
