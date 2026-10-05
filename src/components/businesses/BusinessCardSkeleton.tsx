import { Skeleton } from '../ui/Skeleton';

export function BusinessCardSkeleton() {
	return (
		<article className="card-elevated overflow-hidden" aria-hidden>
			{/* rail azul */}
			<div className="h-1.5 w-full shrink-0 bg-blue/30" />
			{/* montra 16:9 */}
			<div className="relative aspect-[16/9] w-full overflow-hidden bg-snow-dark">
				<Skeleton className="absolute inset-0 h-full w-full" />
				<Skeleton className="absolute left-3 top-3 h-5 w-20 rounded-full bg-red/25" />
			</div>
			{/* selo a cavalgar a fronteira */}
			<div className="relative z-10 -mt-7 px-4">
				<Skeleton className="h-16 w-16 rounded-2xl border-[3px] border-white" />
			</div>
			<div className="flex flex-1 flex-col gap-2 p-4 pt-3">
				<Skeleton className="h-5 w-3/4 rounded" />
				<Skeleton className="h-4 w-40 rounded-full" />
				<Skeleton className="h-3 w-full rounded" />
				<Skeleton className="h-3 w-2/3 rounded" />
				<div className="mt-auto flex items-center justify-between gap-2 pt-2">
					<Skeleton className="h-4 w-24 rounded" />
					<Skeleton className="h-4 w-20 rounded-full" />
				</div>
				<div className="mt-1 h-px w-full bg-ink/10" />
				<Skeleton className="h-2.5 w-32 rounded" />
			</div>
		</article>
	);
}

export function BusinessCardSkeletonGrid({
	count = 6,
	gridClassName = 'grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:items-start',
}: {
	count?: number;
	gridClassName?: string;
}) {
	return (
		<div className={gridClassName} aria-hidden>
			{Array.from({ length: count }).map((_, i) => (
				<BusinessCardSkeleton key={i} />
			))}
		</div>
	);
}
