import type { CSSProperties } from 'react';

const PROVINCE_NAMES: Record<string, string> = {
	BENGO: 'Bengo',
	BENGUELA: 'Benguela',
	BIÉ: 'Bié',
	CABINDA: 'Cabinda',
	CUANDO_CUBANGO: 'Cuando-Cubango',
	CUANZA_NORTE: 'Cuanza Norte',
	CUANZA_SUL: 'Cuanza Sul',
	CUNENE: 'Cunene',
	HUAMBO: 'Huambo',
	HUÍLA: 'Huíla',
	LUANDA: 'Luanda',
	LUNDA_NORTE: 'Lunda Norte',
	LUNDA_SUL: 'Lunda Sul',
	MALANJE: 'Malanje',
	MOXICO: 'Moxico',
	NAMIBE: 'Namibe',
	UÍGE: 'Uíge',
	ZAIRE: 'Zaire',
};

const provinces = Object.entries(PROVINCE_NAMES).map(([code, name]) => ({
	code,
	name,
}));

export function ProvinceRibbon() {
	return (
		<section
			className="mx-auto max-w-6xl px-4 py-8"
			aria-label="Lista de províncias presentes no Caxinda Divulga"
		>
			<div className="province-ribbon relative overflow-hidden">
				<div
					className="province-ribbon-track flex whitespace-nowrap py-3"
					style={
						{
							'--sweep-duration': '20s',
						} as CSSProperties
					}
				>
					{[0, 1].map((half) => (
						<div key={half} className="flex gap-3 pr-3">
							{provinces.map(({ code, name }) => (
								<span
									key={`${half}-${code}`}
									className="inline-flex items-center rounded-full bg-ink/5 px-3 py-1 text-xs font-mono text-ink/60 ring-1 ring-inset ring-ink/10"
								>
									{name}
								</span>
							))}
						</div>
					))}
				</div>

				<style>
					{`
          .province-ribbon-track {
            animation: province-sweep var(--sweep-duration) linear infinite;
          }
          .province-ribbon:hover .province-ribbon-track {
            animation-play-state: paused;
          }
          @keyframes province-sweep {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .province-ribbon-track {
              animation: none !important;
            }
          }
          `}
				</style>
			</div>
		</section>
	);
}
