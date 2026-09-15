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
					<div className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
						<div className="flex items-center justify-between gap-3 bg-ink px-5 py-2.5">
							<Skeleton className="h-3 w-16 rounded bg-white/20" />
							<Skeleton className="h-3 w-24 rounded bg-white/20" />
						</div>
						<div className="bg-snow p-3">
							<Skeleton className="aspect-[16/10] w-full rounded-2xl" />
							<div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
								{Array.from({ length: 3 }).map((_, i) => (
									<Skeleton
										key={i}
										className="aspect-[4/3] w-full rounded-lg"
									/>
								))}
							</div>
						</div>
					</div>

					<div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
						<div className="flex items-center justify-between gap-3 border-b border-ink/10 bg-snow/60 px-6 py-4">
							<Skeleton className="h-4 w-32 rounded" />
							<Skeleton className="h-3 w-16 rounded" />
						</div>
						<div className="flex flex-col divide-y divide-ink/10">
							{Array.from({ length: 3 }).map((_, i) => (
								<div
									key={i}
									className="flex items-center justify-between px-6 py-3"
								>
									<Skeleton className="h-3 w-16 rounded" />
									<Skeleton className="h-4 w-24 rounded" />
								</div>
							))}
						</div>
					</div>

					<div className="mt-6 rounded-2xl border border-ink/10 bg-snow-dark p-6">
						<div className="mb-3 flex items-center gap-3">
							<Skeleton className="h-1.5 w-14 rounded-full bg-kwanza/40" />
							<Skeleton className="h-4 w-24 rounded" />
						</div>
						<div className="space-y-2">
							<SkeletonText />
							<SkeletonText />
							<SkeletonText width="w-3/4" />
						</div>
					</div>
				</div>

				<aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
					<div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
						<Skeleton className="h-1.5 w-full bg-kwanza/40" />
						<div className="flex flex-col gap-3 p-5">
							<Skeleton className="h-7 w-36 rounded-md bg-kwanza/25" />
							<Skeleton className="h-10 w-32 rounded-md bg-kwanza/25" />
							<Skeleton className="h-px w-full" />
							<SkeletonText width="w-1/2" />
							<SkeletonText width="w-1/3" />
						</div>
						<div className="grid grid-cols-3 divide-x divide-ink/10 border-t border-ink/10 bg-snow">
							{Array.from({ length: 3 }).map((_, i) => (
								<div
									key={i}
									className="flex flex-col items-center gap-1 px-2 py-3"
								>
									<Skeleton className="h-4 w-10 rounded" />
									<Skeleton className="h-2.5 w-14 rounded" />
								</div>
							))}
						</div>
					</div>
					<SkeletonButton className="w-full" />
				</aside>
			</div>
		</div>
	);
}
