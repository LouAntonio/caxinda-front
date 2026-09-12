import { Skeleton } from '../ui/Skeleton';
import { PerfDivider } from '../ui/PerfDivider';
import { AdCardSkeletonGrid } from '../ads/AdCardSkeleton';
import { BusinessCardSkeletonGrid } from '../businesses/BusinessCardSkeleton';

export function PageShellSkeleton() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-10" aria-hidden>
			<Skeleton className="mb-6 h-8 w-32 rounded" />
			<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="card overflow-hidden">
						<div className="aspect-[4/3] bg-snow-dark">
							<Skeleton className="h-full w-full" />
						</div>
						<div className="space-y-2 p-4">
							<Skeleton className="h-4 w-4/5 rounded" />
							<Skeleton className="h-3 w-1/3 rounded" />
							<Skeleton className="h-7 w-28 rounded-md bg-kwanza/20" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function AdsListSkeleton() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-10" aria-hidden>
			<Skeleton className="mb-6 h-8 w-24 rounded" />
			<div className="mb-4 flex items-center justify-between gap-2">
				<Skeleton className="h-4 w-40 rounded" />
				<Skeleton className="h-8 w-36 rounded-xl border" />
			</div>
			<AdCardSkeletonGrid count={6} />
		</div>
	);
}

export function BusinessesListSkeleton() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-10" aria-hidden>
			<div className="mb-6 flex items-end justify-between gap-4">
				<Skeleton className="h-8 w-28 rounded" />
				<Skeleton className="h-9 w-40 rounded-xl bg-blue/20" />
			</div>
			<div className="mb-4 flex items-center justify-between gap-2">
				<Skeleton className="h-4 w-40 rounded" />
				<Skeleton className="h-8 w-36 rounded-xl border" />
			</div>
			<BusinessCardSkeletonGrid count={6} />
		</div>
	);
}

export function SearchListSkeleton() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-10" aria-hidden>
			<Skeleton className="mb-6 h-8 w-24 rounded" />
			<div className="mb-6 flex gap-2">
				<Skeleton className="h-11 w-full max-w-sm rounded-xl border" />
				<Skeleton className="h-11 w-20 rounded-xl bg-red/20" />
			</div>
			<div className="flex flex-col gap-3">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="card flex gap-4 p-4">
						<Skeleton className="h-24 w-32 shrink-0 rounded-xl md:h-28 md:w-40" />
						<div className="min-w-0 flex-1 space-y-2 py-1">
							<Skeleton className="h-4 w-1/2 rounded" />
							<Skeleton className="h-3 w-1/3 rounded" />
							<Skeleton className="h-3 w-full rounded" />
							<div className="flex items-center justify-between gap-2 pt-1">
								<Skeleton className="h-7 w-24 rounded-md bg-kwanza/25" />
								<Skeleton className="h-3 w-16 rounded" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function PlansListSkeleton() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-10" aria-hidden>
			<Skeleton className="mb-6 h-8 w-20 rounded" />
			<div className="grid gap-4 md:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="card items-center p-6">
						<Skeleton className="mb-3 h-6 w-28 rounded-full bg-kwanza/20" />
						<Skeleton className="h-4 w-32 rounded" />
						<PerfDivider className="my-4 w-full" />
						<div className="space-y-2">
							<Skeleton className="h-3 w-24 rounded" />
							<Skeleton className="h-3 w-20 rounded" />
						</div>
						<Skeleton className="mt-6 h-11 w-full max-w-[200px] rounded-xl" />
					</div>
				))}
			</div>
		</div>
	);
}

export function RowsSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="mx-auto max-w-6xl px-4 py-10" aria-hidden>
			<Skeleton className="mb-6 h-8 w-28 rounded" />
			<div className="flex flex-col gap-4">
				{Array.from({ length: count }).map((_, i) => (
					<div key={i} className="card gap-3 p-5">
						<div className="flex items-center justify-between gap-2">
							<Skeleton className="h-4 w-40 rounded" />
							<Skeleton className="h-6 w-20 rounded-full" />
						</div>
						<Skeleton className="h-3 w-64 max-w-full rounded" />
						<Skeleton className="h-10 w-full rounded-xl border" />
					</div>
				))}
			</div>
		</div>
	);
}
