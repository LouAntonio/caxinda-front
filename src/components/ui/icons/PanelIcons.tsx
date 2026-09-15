type PanelIconName =
	| 'grid'
	| 'building'
	| 'layers'
	| 'card'
	| 'heart'
	| 'chat'
	| 'shield'
	| 'gear'
	| 'chart'
	| 'flag'
	| 'id'
	| 'megaphone'
	| 'users'
	| 'lifebuoy'
	| 'tag'
	| 'bank'
	| 'eye'
	| 'cursor'
	| 'clock';

const SHAPES: Record<PanelIconName, React.ReactNode> = {
	grid: (
		<>
			<rect x="4.5" y="4.5" width="6" height="6" rx="1.5" />
			<rect x="14" y="4.5" width="5.5" height="6" rx="1.5" />
			<rect x="4.5" y="14" width="6" height="5.5" rx="1.5" />
			<rect x="14" y="14" width="5.5" height="5.5" rx="1.5" />
		</>
	),
	building: (
		<>
			<rect x="5" y="3.5" width="14" height="17" rx="1.5" />
			<path d="M3.5 20.5h17" />
			<path d="M9 7.5h2m-2 3.5h2m-2 3.5h2m4-7h2m-2 3.5h2m-2 3.5h2" />
		</>
	),
	layers: (
		<>
			<path d="M12 3.5l8.5 4.7L12 12.9 3.5 8.2 12 3.5z" />
			<path d="M3.5 12.6l8.5 4.7 8.5-4.7" />
			<path d="M3.5 17l8.5 4.7 8.5-4.7" />
		</>
	),
	card: (
		<>
			<rect x="3" y="6" width="18" height="12" rx="2" />
			<path d="M3 10h18" />
			<path d="M7 15h4" />
		</>
	),
	heart: (
		<path d="M12 20.5C6.5 16.4 2.5 13 2.5 9.6 2.5 7 4.6 5 7 5c1.8 0 3.4.9 4.5 2.3C12.6 5.9 14.2 5 16 5c2.4 0 4.5 2 4.5 4.6 0 3.4-4 6.8-8.5 10.9z" />
	),
	chat: (
		<path d="M21 11.5a8 8 0 0 1-8 8H5.8l-2.6 2.3V19.5A8 8 0 0 1 21 11.5z" />
	),
	shield: (
		<>
			<path d="M12 3l7 2.4V11c0 4.6-3 7.6-7 9-4-1.4-7-4.4-7-9V5.4L12 3z" />
			<path d="M8.8 12l2.2 2.2 4.2-4.4" />
		</>
	),
	gear: (
		<>
			<circle cx="12" cy="12" r="3" />
			<path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.9 5.9l1.8 1.8M16.3 16.3l1.8 1.8M18.1 5.9l-1.8 1.8M7.7 16.3l-1.8 1.8" />
		</>
	),
	chart: (
		<>
			<path d="M3.5 3.5v17h17" />
			<path d="M8 16v-5M13 16V7M18 16v-8" />
		</>
	),
	flag: (
		<>
			<path d="M5.5 3.5v17" />
			<path d="M5.5 5.5h13l-2.6 4 2.6 4h-13" />
		</>
	),
	id: (
		<>
			<rect x="3" y="5" width="18" height="14" rx="2" />
			<circle cx="8.5" cy="10.5" r="1.8" />
			<path d="M5 17c.8-1.6 1.8-2.3 3.5-2.3S10.2 15.4 11 17" />
			<path d="M14 10h5M14 13h3" />
		</>
	),
	megaphone: (
		<>
			<path d="M3 10v4.2a1 1 0 0 0 1 1h2l5.7 3.6V6.2L6 9.8H4a1 1 0 0 0-1 1z" />
			<path d="M16.5 9.8a4.5 4.5 0 0 1 0 4.4M19.5 6.8a9 9 0 0 1 0 10.4" />
		</>
	),
	users: (
		<>
			<circle cx="9" cy="8" r="3" />
			<path d="M3.5 19c.6-3 2.4-4.5 5.5-4.5s4.9 1.5 5.5 4.5" />
			<circle cx="17" cy="9.5" r="2.5" />
			<path d="M15.5 14.8c2.3.4 3.9 1.7 4.4 3.7" />
		</>
	),
	lifebuoy: (
		<>
			<circle cx="12" cy="12" r="9" />
			<circle cx="12" cy="12" r="3.5" />
			<path d="M4.5 4.5L8 8M16 16l3.5 3.5M19.5 4.5L16 8M8 16l-3.5 3.5" />
		</>
	),
	tag: (
		<>
			<path d="M3.5 11.6V5.5a2 2 0 0 1 2-2h6.1a2 2 0 0 1 1.4.6l7.5 7.4a2 2 0 0 1 0 2.9l-5.6 5.6a2 2 0 0 1-2.9 0l-7.4-7.5a2 2 0 0 1-.6-1.4z" />
			<circle cx="8" cy="8" r="1.1" fill="currentColor" stroke="none" />
		</>
	),
	bank: (
		<>
			<path d="M3.5 10.5L12 4l8.5 6.5z" />
			<path d="M4.5 10.5h15" />
			<path d="M7 10.5v5.5M12 10.5V16M17 10.5v5.5" />
			<path d="M3.5 20.5h17" />
		</>
	),
	eye: (
		<>
			<path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
			<circle cx="12" cy="12" r="2.5" />
		</>
	),
	cursor: <path d="M5 3l15 8-6 2-2.5 6.5z" />,
	clock: (
		<>
			<circle cx="12" cy="12" r="9" />
			<path d="M12 7v5l3 2" />
		</>
	),
};

export function PanelIcon({
	name,
	size = 18,
	className,
}: {
	name: PanelIconName;
	size?: number;
	className?: string;
}) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.8}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden="true"
		>
			{SHAPES[name]}
		</svg>
	);
}

export type { PanelIconName };
