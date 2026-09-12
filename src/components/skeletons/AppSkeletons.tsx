import { Skeleton } from '../ui/Skeleton';
import { AdCardSkeletonGrid } from '../ads/AdCardSkeleton';
import { BusinessCardSkeletonGrid } from '../businesses/BusinessCardSkeleton';

export function LandingSkeleton() {
	return (
		<div aria-hidden>
			<div className="relative -mt-16 flex min-h-screen items-center justify-center bg-ink">
				<Skeleton className="absolute inset-0 h-full w-full" />
				<div className="absolute inset-0 bg-ink/60" />
				<div className="relative z-10 mx-auto max-w-2xl space-y-5 px-4 text-center">
					<Skeleton className="mx-auto h-4 w-3/4 rounded" />
					<Skeleton className="mx-auto h-4 w-2/3 rounded" />
					<div className="flex justify-center gap-3 pt-2">
						<Skeleton className="h-11 w-36 rounded-xl" />
						<Skeleton className="h-11 w-36 rounded-xl border border-white/40" />
					</div>
				</div>
			</div>

			<section className="bg-white py-14">
				<div className="mx-auto max-w-6xl px-4">
					<div className="mb-6 flex items-end justify-between">
						<Skeleton className="h-7 w-40 rounded" />
						<Skeleton className="h-4 w-16 rounded" />
					</div>
					<AdCardSkeletonGrid
						count={4}
						gridClassName="grid grid-cols-2 gap-4 md:grid-cols-4"
					/>
				</div>
			</section>

			<section className="bg-white py-14">
				<div className="mx-auto max-w-6xl px-4">
					<div className="mb-6 flex items-end justify-between">
						<Skeleton className="h-7 w-44 rounded" />
						<Skeleton className="h-4 w-16 rounded" />
					</div>
					<BusinessCardSkeletonGrid
						count={4}
						gridClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
					/>
				</div>
			</section>
		</div>
	);
}

export function ChatSkeleton() {
	return (
		<div className="grid gap-4 lg:grid-cols-[260px_1fr]" aria-hidden>
			<div className="flex flex-col gap-1 rounded-2xl border border-ink/10 bg-white p-2">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="flex items-center gap-2 px-3 py-2">
						<Skeleton className="h-8 w-8 shrink-0 rounded-full" />
						<div className="min-w-0 flex-1 space-y-1.5">
							<Skeleton className="h-3 w-2/3 rounded" />
							<Skeleton className="h-3 w-1/3 rounded" />
						</div>
					</div>
				))}
			</div>
			<div className="flex h-[540px] flex-col rounded-2xl border border-ink/10 bg-white">
				<div className="flex items-center gap-2 border-b border-ink/10 p-3">
					<Skeleton className="h-8 w-8 shrink-0 rounded-full" />
					<div className="min-w-0 flex-1 space-y-1.5">
						<Skeleton className="h-3 w-1/2 rounded" />
						<Skeleton className="h-3 w-1/4 rounded" />
					</div>
				</div>
				<div className="flex-1 space-y-3 p-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton
							key={i}
							className={
								i % 2 === 0
									? 'h-9 w-3/4 rounded-2xl rounded-bl-sm'
									: 'ml-auto h-9 w-1/2 rounded-2xl rounded-br-sm'
							}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
