import { Skeleton } from '../ui/Skeleton';

export function AdCardSkeleton() {
	return (
		<article className="card-flat" aria-hidden>
			{/* imagem 1:1 */}
			<div className="relative aspect-square w-full overflow-hidden bg-snow-dark">
				<Skeleton className="absolute inset-0 h-full w-full" />
				<Skeleton className="absolute left-3 top-3 h-5 w-20 rounded-full bg-red/25" />
			</div>
			<div className="flex flex-1 flex-col gap-2 p-3">
				<Skeleton className="h-2.5 w-24 rounded" />
				<Skeleton className="h-4 w-full rounded" />
				<Skeleton className="h-4 w-3/5 rounded" />
				<div className="mt-auto flex flex-wrap gap-1 pt-1">
					<Skeleton className="h-4 w-16 rounded-full" />
					<Skeleton className="h-4 w-14 rounded-full" />
				</div>
			</div>
			{/* faixa de preço */}
			<div className="price-band">
				<Skeleton className="ml-4 h-4 w-24 rounded bg-white/10" />
				<Skeleton className="h-3 w-12 rounded bg-white/10" />
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
