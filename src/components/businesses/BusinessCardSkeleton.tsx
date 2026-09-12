import { Skeleton } from '../ui/Skeleton';

export function BusinessCardSkeleton() {
	return (
		<article className="card overflow-hidden" aria-hidden>
			<div className="relative h-40 w-full overflow-hidden bg-snow-dark">
				<Skeleton className="absolute inset-0 h-full w-full" />
				<Skeleton className="absolute left-2 top-2 h-5 w-24 rounded-full bg-blue/25" />
				<Skeleton className="absolute bottom-2 right-2 h-5 w-16 rounded-lg" />
			</div>
			<div className="flex flex-1 flex-col gap-1.5 p-4">
				<Skeleton className="h-4 w-3/4 rounded" />
				<Skeleton className="h-3 w-1/2 rounded" />
				<Skeleton className="h-3 w-full rounded" />
				<Skeleton className="h-3 w-2/3 rounded" />
				<div className="mt-auto flex items-center justify-between pt-1">
					<Skeleton className="h-4 w-24 rounded" />
					<Skeleton className="h-3 w-14 rounded" />
				</div>
			</div>
		</article>
	);
}

export function BusinessCardSkeletonGrid({
	count = 6,
	gridClassName = 'grid gap-4 sm:grid-cols-2 md:grid-cols-3',
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
