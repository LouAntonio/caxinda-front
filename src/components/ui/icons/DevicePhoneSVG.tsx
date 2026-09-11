import type { SVGProps } from 'react';

export function DevicePhoneSVG(props: SVGProps<SVGSVGElement>) {
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
			<rect x="7" y="2" width="10" height="20" rx="2.5" />
			<path d="M11 18h2" />
		</svg>
	);
}
