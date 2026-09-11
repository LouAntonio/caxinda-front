import type { SVGProps } from 'react';

export function DeviceTabletSVG(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			width="20"
			height="20"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<rect x="4" y="2" width="16" height="20" rx="2.5" />
			<path d="M12 18h.01" />
		</svg>
	);
}
