import { Skeleton, SkeletonButton, SkeletonText } from '../ui/Skeleton';

export function AdDetailSkeleton() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-10" aria-hidden>
			<div className="mb-5 flex items-center gap-2">
				<Skeleton className="h-4 w-20 rounded" />
				<span className="text-xs text-kwanza">▸</span>
				<Skeleton className="h-4 w-44 rounded" />
			</div>

			<div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)_320px] lg:gap-0">
				<div className="flex flex-col gap-3 lg:border-r lg:border-ink/10 lg:pr-6">
					<Skeleton className="aspect-square w-full rounded-2xl sm:w-[340px] lg:w-[380px]" />
					<div className="flex gap-2 overflow-x-auto sm:flex-col sm:overflow-x-visible">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton
								key={i}
								className="h-16 w-16 shrink-0 rounded-lg sm:h-20 sm:w-20"
							/>
						))}
					</div>
				</div>

				<div className="flex min-w-0 flex-col gap-5 lg:px-6">
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
					<div className="flex gap-1.5">
						<Skeleton className="h-6 w-24 rounded-md" />
						<Skeleton className="h-6 w-24 rounded-md" />
					</div>
				</div>

				<aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
					<div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
						<Skeleton className="h-1.5 w-full bg-kwanza/40" />
						<div className="flex flex-col gap-3 p-5">
							<Skeleton className="h-6 w-32 rounded-full" />
							<SkeletonButton className="w-full" />
							<SkeletonButton className="w-full" />
						</div>
					</div>
					<div className="rounded-2xl border border-ink/10 bg-white p-4">
						<div className="flex flex-col gap-3">
							<Skeleton className="h-4 w-full rounded" />
							<Skeleton className="h-4 w-3/4 rounded" />
							<Skeleton className="h-4 w-5/6 rounded" />
						</div>
					</div>
					<div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
						<div className="h-9 w-full bg-kwanza/25" />
						<div className="p-4">
							<SkeletonText />
							<SkeletonText width="w-3/4" />
						</div>
					</div>
				</aside>
			</div>

			<div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-0">
				<div className="flex flex-col gap-6 lg:border-r lg:border-ink/10 lg:pr-6">
					<div className="rounded-2xl border border-ink/10 bg-snow-dark p-6">
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
					<div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
						<div className="border-b border-ink/10 bg-snow/60 px-6 py-4">
							<Skeleton className="h-4 w-40 rounded" />
						</div>
						<div className="flex flex-col">
							{Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className="flex items-center justify-between border-b border-ink/10 px-6 py-3 even:bg-snow"
								>
									<Skeleton className="h-3 w-16 rounded" />
									<Skeleton className="h-4 w-24 rounded" />
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="lg:px-6">
					<div className="rounded-2xl border border-ink/10 bg-white p-6">
						<Skeleton className="mb-4 h-4 w-24 rounded" />
						<div className="space-y-2">
							<SkeletonText />
							<SkeletonText />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}