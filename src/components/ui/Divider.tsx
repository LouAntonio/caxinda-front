export function Divider({ className = '' }: { className?: string }) {
	return <div aria-hidden className={`h-px w-full bg-ink/10 ${className}`} />;
}
