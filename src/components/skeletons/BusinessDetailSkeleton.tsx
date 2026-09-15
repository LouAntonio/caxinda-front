import { Skeleton, SkeletonButton, SkeletonText } from '../ui/Skeleton';

export function BusinessDetailSkeleton() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-10" aria-hidden>
			<div className="mb-5 flex items-center gap-2">
				<Skeleton className="h-4 w-24 rounded" />
				<span className="text-xs text-kwanza">▸</span>
				<Skeleton className="h-4 w-48 rounded" />
			</div>

			<div className="card overflow-hidden p-3">
				<Skeleton className="aspect-[4/3] w-full rounded-xl" />
			</div>

			<div className="mt-5 rounded-2xl bg-snow px-6 py-5">
				<div className="flex flex-wrap items-center gap-4">
					<Skeleton className="h-14 w-14 rounded-2xl" />
					<div className="min-w-0 flex-1 space-y-2">
						<Skeleton className="h-6 w-48 rounded" />
						<div className="flex gap-1.5">
							<Skeleton className="h-5 w-20 rounded-full" />
							<Skeleton className="h-5 w-16 rounded-full" />
						</div>
					</div>
					<div className="flex items-center gap-4">
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								className="flex flex-col items-center gap-1"
							>
								<Skeleton className="h-4 w-10 rounded" />
								<Skeleton className="h-2.5 w-14 rounded" />
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
				<div className="flex min-w-0 flex-col gap-6">
					<div className="card p-5">
						<div className="mb-3 flex items-center gap-3">
							<Skeleton className="h-1.5 w-14 rounded-full bg-kwanza/40" />
							<Skeleton className="h-4 w-20 rounded" />
						</div>
						<div className="space-y-2">
							<SkeletonText />
							<SkeletonText />
							<SkeletonText width="w-2/3" />
						</div>
					</div>
					<div className="card p-5">
						<Skeleton className="mb-4 h-4 w-24 rounded" />
						<div className="space-y-3">
							<SkeletonText />
							<SkeletonText width="w-3/4" />
						</div>
					</div>
				</div>

				<aside className="lg:sticky lg:top-20 lg:self-start">
					<div className="flex flex-col gap-3">
						<div className="card overflow-hidden">
							<div className="flex items-center gap-2 border-b border-ink/10 px-4 py-3">
								<Skeleton className="h-4 w-4 rounded" />
								<Skeleton className="h-3 w-32 rounded" />
							</div>
							<div className="flex flex-col gap-2 p-4">
								{Array.from({ length: 3 }).map((_, i) => (
									<SkeletonButton
										key={i}
										className="w-full"
									/>
								))}
							</div>
						</div>
						<SkeletonButton className="w-full" />
						<Skeleton className="h-24 w-full rounded-2xl" />
					</div>
				</aside>
			</div>
		</div>
	);
}
