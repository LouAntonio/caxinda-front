import { Skeleton } from '../ui/Skeleton';

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
	return (
		<div
			className="flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white"
			aria-hidden
		>
			<div className="grid grid-cols-4 gap-4 border-b border-ink/10 bg-snow px-4 py-3">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} className="h-3 w-4/5 rounded" />
				))}
			</div>
			<div className="divide-y divide-ink/5">
				{Array.from({ length: rows }).map((_, r) => (
					<div
						key={r}
						className="grid grid-cols-4 items-center gap-4 px-4 py-3"
					>
						{Array.from({ length: 4 }).map((_, c) => (
							<Skeleton
								key={c}
								className={
									c === 0
										? 'h-4 w-3/4 rounded'
										: c === 3
											? 'h-4 w-1/3 rounded'
											: 'h-4 w-1/2 rounded'
								}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

export function DashboardSkeleton() {
	return (
		<div className="flex flex-col gap-4" aria-hidden>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="card gap-2 p-5">
						<Skeleton className="h-7 w-16 rounded" />
						<Skeleton className="h-3 w-24 rounded" />
					</div>
				))}
			</div>
			<div className="grid gap-4 lg:grid-cols-2">
				<div className="card justify-start gap-3 p-5">
					<Skeleton className="h-5 w-32 rounded" />
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton
							key={i}
							className="h-10 w-full rounded-xl border"
						/>
					))}
				</div>
				<div className="card justify-start gap-3 p-5">
					<Skeleton className="h-5 w-32 rounded" />
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton
							key={i}
							className="h-10 w-full rounded-xl border"
						/>
					))}
				</div>
			</div>
		</div>
	);
}
