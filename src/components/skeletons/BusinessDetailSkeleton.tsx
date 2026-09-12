import { Skeleton, SkeletonButton, SkeletonText } from '../ui/Skeleton';

export function BusinessDetailSkeleton() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-10" aria-hidden>
			<div className="mb-5 flex items-center gap-2">
				<Skeleton className="h-4 w-24 rounded" />
				<span className="text-xs text-kwanza">▸</span>
				<Skeleton className="h-4 w-48 rounded" />
			</div>

			<div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
				<div className="relative h-64 w-full">
					<Skeleton className="absolute inset-0 h-full w-full" />
					<div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 bg-white/90 p-4 backdrop-blur">
						<div className="flex items-end gap-3">
							<Skeleton className="h-16 w-16 rounded-2xl" />
							<div className="space-y-2 py-1">
								<Skeleton className="h-5 w-48 rounded" />
								<Skeleton className="h-3 w-32 rounded" />
							</div>
						</div>
						<Skeleton className="mb-2 h-6 w-28 rounded-full bg-blue/20" />
					</div>
				</div>
				<Skeleton className="mx-0 my-2 h-px w-full" />

				<div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
					<div>
						<Skeleton className="mb-3 h-5 w-20 rounded" />
						<div className="space-y-2">
							<SkeletonText />
							<SkeletonText />
							<SkeletonText width="w-2/3" />
						</div>
						<SkeletonText className="mt-4" width="w-48" />
						<div className="mt-6 grid grid-cols-3 gap-2">
							{Array.from({ length: 3 }).map((_, i) => (
								<Skeleton
									key={i}
									className="aspect-square w-full rounded-xl"
								/>
							))}
						</div>
					</div>

					<aside className="flex flex-col gap-3">
						<div className="card gap-2 p-4">
							<Skeleton className="mb-3 h-5 w-28 rounded" />
							{Array.from({ length: 3 }).map((_, i) => (
								<SkeletonButton key={i} className="w-full" />
							))}
							<Skeleton className="my-3 h-px w-full" />
							<SkeletonButton className="w-full" />
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}
