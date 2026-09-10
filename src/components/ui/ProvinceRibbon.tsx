import { useEffect, useState } from 'react';

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
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(true), 600);
		return () => clearTimeout(timer);
	}, []);

	return (
		<section
			className="mx-auto max-w-6xl px-4 py-8"
			aria-label="Lista de províncias presentes no Caxinda Divulga"
		>
			<div className="relative overflow-hidden">
				<div
					className="flex whitespace-nowrap gap-3 py-3"
					style={
						{
							'--sweep-duration': '20s',
						} as React.CSSProperties
					}
				>
					<div
						className="flex gap-3"
						style={
							{
								animation: isVisible
									? 'sweep var(--sweep-duration) linear infinite'
									: 'none',
								'--motion-reduce': 'running',
							} as React.CSSProperties
						}
					>
						{provinces.map(({ code, name }) => (
							<span
								key={code}
								className="inline-flex items-center rounded-full bg-ink/5 px-3 py-1 text-xs font-mono text-ink/60 ring-1 ring-inset ring-ink/10"
								style={{ whiteSpace: 'nowrap' }}
							>
								{name}
							</span>
						))}
					</div>
					<div
						className="flex gap-3"
						style={{
							animation: isVisible
								? 'sweep var(--sweep-duration) linear infinite'
								: 'none',
							animationDelay: 'calc(var(--sweep-duration) / -2)',
						}}
					>
						{provinces.map(({ code, name }) => (
							<span
								key={`dup-${code}`}
								className="inline-flex items-center rounded-full bg-ink/5 px-3 py-1 text-xs font-mono text-ink/60 ring-1 ring-inset ring-ink/10"
								style={{ whiteSpace: 'nowrap' }}
							>
								{name}
							</span>
						))}
					</div>
				</div>

				<style>
					{`
          @keyframes sweep {
            from { transform: translateX(0%); }
            to { transform: translateX(-50%); }
          }
          @media (prefers-reduced-motion: reduce) {
            * {
              animation: none !important;
              transition: none !important;
            }
          }
          `}
				</style>
			</div>
		</section>
	);
}
