import type { SVGProps } from 'react';

export function EnvelopeSVG(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			width="24"
			height="24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			n <rect x="2" y="4" width="20" height="16" rx="2" />
			<path d="m2 8 10 7 10-7" />
		</svg>
	);
}
