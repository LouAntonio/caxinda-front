export function Logo({ compact = false }: { compact?: boolean }) {
	return (
		<a href="/" className="flex items-center gap-2.5">
			<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink font-display text-sm font-black text-snow">
				C<span className="text-kwanza">X</span>
			</span>
			{!compact && (
				<span className="font-display text-sm font-black leading-tight tracking-tight">
					Caxinda
					<span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-red">
						Divulga
					</span>
				</span>
			)}
		</a>
	);
}
