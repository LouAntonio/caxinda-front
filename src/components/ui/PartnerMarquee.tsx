import type { CSSProperties } from 'react';

export interface Partner {
	name: string;
	src: string;
	href?: string;
}

/**
 * Logos das empresas parceiras. Substitua os ficheiros em
 * public/images/parceiros e ajuste `src`/`href` conforme necessário.
 */
const PARTNERS: Partner[] = [
	{ name: 'Parceiro 1', src: '/images/parceiros/parceiro-1.svg' },
	{ name: 'Parceiro 2', src: '/images/parceiros/parceiro-2.svg' },
	{ name: 'Parceiro 3', src: '/images/parceiros/parceiro-3.svg' },
	{ name: 'Parceiro 4', src: '/images/parceiros/parceiro-4.svg' },
	{ name: 'Parceiro 5', src: '/images/parceiros/parceiro-5.svg' },
	{ name: 'Parceiro 6', src: '/images/parceiros/parceiro-6.svg' },
	{ name: 'Parceiro 7', src: '/images/parceiros/parceiro-7.svg' },
	{ name: 'Parceiro 8', src: '/images/parceiros/parceiro-8.svg' },
];

const ITEM_GAP = 3;

export function PartnerMarquee({
	partners = PARTNERS,
}: {
	partners?: Partner[];
}) {
	if (partners.length === 0) {
		return null;
	}

	const sweepDuration = Math.max(18, partners.length * 4);

	return (
		<div className="partner-marquee relative overflow-hidden">
			<div
				className="partner-marquee-track flex items-center py-2"
				style={
					{
						'--partner-sweep-duration': `${sweepDuration}s`,
					} as CSSProperties
				}
			>
				{[0, 1].map((half) => (
					<div
						key={half}
						className="flex shrink-0 items-center"
						style={{ gap: `${ITEM_GAP}rem` }}
					>
						{partners.map((partner) => (
							<a
								key={`${half}-${partner.name}`}
								href={partner.href ?? undefined}
								target={partner.href ? '_blank' : undefined}
								rel={
									partner.href
										? 'noopener noreferrer'
										: undefined
								}
								className="shrink-0 rounded-lg p-1 focus-visible:ring-2 focus-visible:ring-blue focus-visible:outline-none"
							>
								<img
									src={partner.src}
									alt={partner.name}
									loading="lazy"
									className="h-10 w-auto max-w-[180px] object-contain opacity-55 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
								/>
							</a>
						))}
					</div>
				))}
			</div>
			<style>{`
				.partner-marquee-track {
					animation: partner-sweep var(--partner-sweep-duration) linear infinite;
				}
				.partner-marquee:hover .partner-marquee-track {
					animation-play-state: paused;
				}
				@keyframes partner-sweep {
					from { transform: translateX(0); }
					to { transform: translateX(-50%); }
				}
				@media (prefers-reduced-motion: reduce) {
					.partner-marquee-track {
						animation: none !important;
					}
				}
			`}</style>
		</div>
	);
}
