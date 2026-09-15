import { Skeleton, SkeletonButton, SkeletonText } from '../ui/Skeleton';

export function BusinessDetailSkeleton() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-10" aria-hidden>
			<div className="mb-5 flex items-center gap-2">
				<Skeleton className="h-4 w-24 rounded" />
				<span className="text-xs text-kwanza">▸</span>
				<Skeleton className="h-4 w-48 rounded" />
			</div>

			<div className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
				<div className="relative">
					<Skeleton className="h-64 w-full lg:h-80" />
					<Skeleton className="absolute right-4 top-4 h-8 w-28 rounded-xl bg-kwanza/40" />
				</div>

				<div className="border-b border-ink/10 bg-snow px-6 py-5">
					<div className="flex items-center gap-4">
						<Skeleton className="h-20 w-20 rounded-2xl" />
						<div className="space-y-2 py-1">
							<Skeleton className="h-5 w-48 rounded" />
							<Skeleton className="h-3 w-32 rounded" />
						</div>
					</div>
					<div className="mt-5 grid grid-cols-3 divide-x divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-white">
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

				<div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
					<div>
						<div className="rounded-2xl border border-ink/10 bg-snow-dark p-6">
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
						<div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
							<div className="flex items-center justify-between gap-3 border-b border-ink/10 bg-snow/60 px-6 py-4">
								<Skeleton className="h-4 w-28 rounded" />
								<Skeleton className="h-3 w-12 rounded" />
							</div>
							<div className="grid grid-cols-3 gap-2 p-5">
								{Array.from({ length: 3 }).map((_, i) => (
									<Skeleton
										key={i}
										className="aspect-square w-full rounded-xl"
									/>
								))}
							</div>
						</div>
					</div>

					<aside className="flex flex-col gap-3">
						<div className="overflow-hidden rounded-2xl border border-ink/10 bg-white p-5">
							<div className="mb-1 flex items-center justify-between gap-3">
								<Skeleton className="h-4 w-24 rounded" />
								<Skeleton className="h-3 w-10 rounded" />
							</div>
							<Skeleton className="my-3 h-px w-full" />
							<div className="flex flex-col gap-2">
								{Array.from({ length: 3 }).map((_, i) => (
									<SkeletonButton
										key={i}
										className="w-full"
									/>
								))}
							</div>
						</div>
						<SkeletonButton className="w-full" />
					</aside>
				</div>
			</div>
		</div>
	);
}
