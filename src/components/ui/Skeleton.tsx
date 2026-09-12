export function Skeleton({ className = '' }: { className?: string }) {
	return <span aria-hidden className={`skeleton block ${className}`} />;
}

export function SkeletonText({
	width = 'w-full',
	className = '',
}: {
	width?: string;
	className?: string;
}) {
	return <Skeleton className={`h-3 rounded ${width} ${className}`} />;
}

export function SkeletonTag({ className = '' }: { className?: string }) {
	return <Skeleton className={`inline-block rounded-full ${className}`} />;
}

export function SkeletonButton({ className = '' }: { className?: string }) {
	return <Skeleton className={`h-11 rounded-xl ${className}`} />;
}
