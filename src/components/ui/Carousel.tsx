import { useEffect, useRef, useState, type ReactNode } from 'react';

interface CarouselProps {
	images: string[];
	onImageClick?: (index: number) => void;
	overlay?: ReactNode;
	/** Classes extra no contentor externo. */
	className?: string;
}

/**
 * A imagem principal tem altura limitada em vez de `aspect-[4/3]`: numa
 * galeria à largura total do contentor, a proporção resultava num banner de
 * ~850px de altura, que ocupava o ecrã inteiro antes de qualquer conteúdo.
 */
const MAIN_HEIGHT = 'h-64 sm:h-80 lg:h-[26rem]';

export function Carousel({
	images,
	onImageClick,
	overlay,
	className = '',
}: CarouselProps) {
	const [active, setActive] = useState(0);
	const stripRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = stripRef.current;
		if (!el) return;
		const thumb = el.children[active] as HTMLElement | undefined;
		if (thumb) {
			thumb.scrollIntoView({
				behavior: 'smooth',
				inline: 'center',
				block: 'nearest',
			});
		}
	}, [active]);

	if (images.length === 0) return null;

	const prev = () =>
		setActive((i) => (i - 1 + images.length) % images.length);
	const next = () => setActive((i) => (i + 1) % images.length);

	return (
		<div className={`flex flex-col gap-3 ${className}`}>
			<div className="relative overflow-hidden rounded-2xl bg-snow-dark">
				<button
					type="button"
					onClick={() => onImageClick?.(active)}
					className={`block ${MAIN_HEIGHT} w-full cursor-zoom-in focus-visible:ring-2 focus-visible:ring-blue focus-visible:outline-none`}
					aria-label="Ampliar fotografia"
				>
					<img
						src={images[active]}
						alt=""
						className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
					/>
				</button>

				{overlay}

				{images.length > 1 && (
					<>
						<button
							type="button"
							onClick={prev}
							className="carousel-arrow left-3"
							aria-label="Anterior"
						>
							◀
						</button>
						<button
							type="button"
							onClick={next}
							className="carousel-arrow right-3"
							aria-label="Seguinte"
						>
							▶
						</button>
					</>
				)}

				<span className="absolute bottom-2 right-2 rounded-full bg-ink/70 px-2.5 py-0.5 font-mono text-[10px] font-bold text-white">
					{active + 1} / {images.length}
				</span>
			</div>

			{images.length > 1 && (
				<div
					ref={stripRef}
					className="flex gap-2 overflow-x-auto nice-scroll"
				>
					{images.map((url, i) => (
						<button
							type="button"
							key={`${url}-${i}`}
							onClick={() => setActive(i)}
							className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg transition sm:h-16 sm:w-24 ${
								active === i
									? 'ring-2 ring-red ring-offset-2 ring-offset-white'
									: 'opacity-60 hover:opacity-100'
							}`}
						>
							<img
								src={url}
								alt=""
								className="h-full w-full object-cover"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
