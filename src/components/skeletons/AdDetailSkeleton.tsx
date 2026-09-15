import { Skeleton, SkeletonButton, SkeletonText } from '../ui/Skeleton';

export function AdDetailSkeleton() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-10" aria-hidden>
			<div className="mb-5 flex items-center gap-2">
				<Skeleton className="h-4 w-20 rounded" />
				<span className="text-xs text-kwanza">▸</span>
				<Skeleton className="h-4 w-44 rounded" />
			</div>

			<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
				<div className="flex min-w-0 flex-col gap-6">
					<div className="card overflow-hidden p-3">
						<Skeleton className="aspect-[4/3] w-full rounded-xl" />
					</div>

					<div className="flex flex-col gap-4">
						<Skeleton className="h-8 w-3/4 rounded-md" />
						<Skeleton className="h-4 w-40 rounded" />
						<div className="flex gap-1.5">
							{Array.from({ length: 3 }).map((_, i) => (
								<Skeleton
									key={i}
									className="h-6 w-20 rounded-full"
								/>
							))}
						</div>
						<Skeleton className="h-10 w-48 rounded-md bg-kwanza/25" />
					</div>

					<div className="card p-5">
						<Skeleton className="mb-4 h-4 w-40 rounded" />
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-3">
								<div className="flex justify-between">
									<Skeleton className="h-3 w-16 rounded" />
									<Skeleton className="h-4 w-24 rounded" />
								</div>
								<div className="flex justify-between">
									<Skeleton className="h-3 w-16 rounded" />
									<Skeleton className="h-4 w-24 rounded" />
								</div>
							</div>
							<div className="space-y-3">
								<div className="flex justify-between">
									<Skeleton className="h-3 w-16 rounded" />
									<Skeleton className="h-4 w-24 rounded" />
								</div>
								<div className="flex justify-between">
									<Skeleton className="h-3 w-16 rounded" />
									<Skeleton className="h-4 w-24 rounded" />
								</div>
							</div>
						</div>
					</div>

					<div className="card p-5">
						<Skeleton className="mb-4 h-4 w-32 rounded" />
						<div className="space-y-2">
							<SkeletonText />
							<SkeletonText />
							<SkeletonText width="w-3/4" />
						</div>
					</div>
				</div>

				<aside className="lg:sticky lg:top-20 lg:self-start">
					<div className="card flex flex-col gap-4 p-5">
						<div className="flex gap-1.5">
							<Skeleton className="h-6 w-24 rounded-full" />
							<Skeleton className="h-6 w-24 rounded-full" />
						</div>
						<div>
							<Skeleton className="mb-1 h-3 w-10 rounded" />
							<Skeleton className="h-9 w-40 rounded-md bg-kwanza/25" />
						</div>
						<SkeletonButton className="w-full !py-3 !text-base" />
						<SkeletonButton className="w-full" />
						<div className="border-t border-ink/10 pt-4">
							<div className="flex items-center gap-2.5">
								<Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
								<div className="space-y-1">
									<Skeleton className="h-3 w-28 rounded" />
									<Skeleton className="h-2.5 w-32 rounded" />
								</div>
							</div>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}
