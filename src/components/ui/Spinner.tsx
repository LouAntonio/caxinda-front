export function Spinner({ size = 20 }: { size?: number }) {
	return (
		<svg
			className="animate-spin text-current"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			aria-label="A carregar"
		>
			<circle
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeOpacity="0.25"
				strokeWidth="4"
			/>
			<path
				d="M12 2a10 10 0 0 1 10 10"
				stroke="currentColor"
				strokeWidth="4"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function PageLoader() {
	return (
		<div className="flex min-h-[50vh] items-center justify-center text-blue">
			<Spinner size={28} />
		</div>
	);
}

export function ButtonLoader() {
	return (
		<>
			<Spinner size={16} />
		</>
	);
}
