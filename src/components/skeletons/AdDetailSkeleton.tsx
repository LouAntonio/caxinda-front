import { Skeleton, SkeletonButton, SkeletonText } from '../ui/Skeleton';
import { PerfDivider } from '../ui/PerfDivider';

export function AdDetailSkeleton() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-10" aria-hidden>
			<div className="mb-5 flex items-center gap-2">
				<Skeleton className="h-4 w-20 rounded" />
				<span className="text-xs text-kwanza">▸</span>
				<Skeleton className="h-4 w-44 rounded" />
			</div>

			<div className="grid gap-6 lg:grid-cols-[1fr_360px]">
				<div>
					<div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
						<div className="relative aspect-video w-full bg-snow-dark">
							<Skeleton className="absolute inset-0 h-full w-full" />
						</div>
					</div>
					<div className="mt-2 grid grid-cols-3 gap-2">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton
								key={i}
								className="aspect-square w-full rounded-lg"
							/>
						))}
					</div>
				</div>

				<aside className="flex flex-col gap-4 lg:sticky lg:top-20">
					<div className="card p-5">
						<Skeleton className="mb-3 h-6 w-24 rounded-full bg-kwanza/25" />
						<Skeleton className="h-7 w-11/12 rounded" />
						<div className="mt-4">
							<Skeleton className="h-10 w-40 rounded-md bg-kwanza/25" />
						</div>
						<SkeletonText className="mt-4" width="w-3/4" />
						<PerfDivider className="my-4" />
						<div className="flex items-center gap-3">
							<Skeleton className="h-12 w-12 rounded-full" />
							<div className="min-w-0 flex-1 space-y-2">
								<SkeletonText width="w-2/3" />
								<SkeletonText width="w-1/3" />
							</div>
						</div>
					</div>
					<SkeletonButton className="w-full" />
					<SkeletonButton className="w-full" />
				</aside>
			</div>

			<div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
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
					<SkeletonButton className="w-full" />
				</div>
			</div>
		</div>
	);
}
