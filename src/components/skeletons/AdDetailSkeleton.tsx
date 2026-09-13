import { Skeleton, SkeletonButton, SkeletonText } from '../ui/Skeleton';

export function AdDetailSkeleton() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-10" aria-hidden>
			<div className="mb-5 flex items-center gap-2">
				<Skeleton className="h-4 w-20 rounded" />
				<span className="text-xs text-kwanza">▸</span>
				<Skeleton className="h-4 w-44 rounded" />
			</div>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
				<div className="min-w-0">
					<div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
						<div className="relative aspect-[16/10] w-full bg-snow-dark">
							<Skeleton className="absolute inset-0 h-full w-full" />
						</div>
					</div>
					<div className="mt-2 grid grid-cols-3 gap-2">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton
								key={i}
								className="aspect-[4/3] w-full rounded-lg"
							/>
						))}
					</div>

					<div className="mt-6 flex flex-col gap-6">
						<div className="card p-6">
							<Skeleton className="mb-3 h-5 w-32 rounded" />
							<div className="space-y-2">
								<SkeletonText />
								<SkeletonText />
								<SkeletonText width="w-3/4" />
							</div>
						</div>
						<div className="card p-6">
							<Skeleton className="mb-3 h-5 w-24 rounded" />
							<SkeletonText width="w-1/2" />
						</div>
					</div>
				</div>

				<aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
					<div className="card items-stretch gap-3 p-5">
						<Skeleton className="h-7 w-28 rounded-full bg-kwanza/25" />
						<Skeleton className="h-10 w-32 rounded-md bg-kwanza/25" />
						<SkeletonText width="w-3/4" />
						<Skeleton className="h-px w-full" />
						<SkeletonText width="w-1/2" />
						<SkeletonText width="w-1/3" />
					</div>
					<SkeletonButton className="w-full" />
					<SkeletonButton className="w-full" />
				</aside>
			</div>
		</div>
	);
}
