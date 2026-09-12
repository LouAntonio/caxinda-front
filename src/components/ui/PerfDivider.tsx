export function PerfDivider({ className = '' }: { className?: string }) {
	return <div aria-hidden className={`perf ${className}`} />;
}
