import { Skeleton } from '../ui/Skeleton';
import { PerfDivider } from '../ui/PerfDivider';

export function FormSkeleton() {
	return (
		<div className="mx-auto max-w-2xl px-4 py-10" aria-hidden>
			<Skeleton className="mb-6 h-7 w-48 rounded" />
			<div className="card gap-5 p-6">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="space-y-2">
						<Skeleton className="h-3 w-24 rounded" />
						<Skeleton className="h-11 w-full rounded-xl border" />
					</div>
				))}
				<Skeleton className="h-11 w-40 rounded-xl bg-blue/20" />
			</div>
		</div>
	);
}

export function TextPageSkeleton() {
	return (
		<div className="mx-auto max-w-3xl px-4 py-10" aria-hidden>
			<Skeleton className="mb-6 h-7 w-40 rounded" />
			<div className="card gap-4 p-6">
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton key={i} className="h-3 w-full rounded" />
				))}
				<PerfDivider className="my-2" />
				<div className="space-y-2">
					{Array.from({ length: 3 }).map((_, i) => (
						<Skeleton key={i} className="h-3 w-full rounded" />
					))}
				</div>
			</div>
		</div>
	);
}

export function AuthSkeleton() {
	return (
		<div
			className="mx-auto flex min-h-[50vh] items-center justify-center px-4"
			aria-hidden
		>
			<div className="w-full max-w-sm space-y-4 p-6">
				<div className="flex justify-center">
					<Skeleton className="h-10 w-10 rounded-xl" />
				</div>
				<Skeleton className="mx-auto h-6 w-48 rounded" />
				{Array.from({ length: 2 }).map((_, i) => (
					<div key={i} className="space-y-2">
						<Skeleton className="h-3 w-16 rounded" />
						<Skeleton className="h-11 w-full rounded-xl border" />
					</div>
				))}
				<Skeleton className="h-11 w-full rounded-xl bg-red/20" />
			</div>
		</div>
	);
}
