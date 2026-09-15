import { Skeleton } from '../ui/Skeleton';

export function AdCardSkeleton() {
	return (
		<article className="card overflow-hidden" aria-hidden>
			<div className="relative aspect-[4/3] w-full overflow-hidden bg-snow-dark">
				<Skeleton className="absolute inset-0 h-full w-full" />
				<Skeleton className="absolute left-0 top-2.5 h-6 w-24 rounded-r-full" />
			</div>
			<div className="flex flex-1 flex-col gap-2 p-4">
				<Skeleton className="h-4 w-4/5 rounded" />
				<Skeleton className="h-5 w-24 rounded-md bg-blue/25" />
				<div className="mt-auto flex items-center justify-between gap-2">
					<Skeleton className="h-7 w-28 rounded-md bg-kwanza/25" />
					<Skeleton className="h-3 w-14 rounded" />
				</div>
				<Skeleton className="h-4 w-full rounded" />
			</div>
		</article>
	);
}

export function AdCardSkeletonGrid({
	count = 6,
	gridClassName = 'grid grid-cols-2 gap-4 md:grid-cols-3 lg:items-start',
}: {
	count?: number;
	gridClassName?: string;
}) {
	return (
		<div className={gridClassName} aria-hidden>
			{Array.from({ length: count }).map((_, i) => (
				<AdCardSkeleton key={i} />
			))}
		</div>
	);
}
