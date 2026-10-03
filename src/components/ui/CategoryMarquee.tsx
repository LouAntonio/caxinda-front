import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import type { Category } from '../../types/api';

const ITEM_STEP = 244;
const MIN_COPIES = 2;

function CategoryMarqueeCard({
	category,
	baseTo,
}: {
	category: Category;
	baseTo: string;
}) {
	return (
		<Link
			to={`${baseTo}?categoryIds=${category.id}`}
			className="group relative block w-44 shrink-0 overflow-hidden rounded-2xl border border-ink/10 transition hover:-translate-y-0.5 hover:shadow-lg md:w-56"
		>
			<div className="relative aspect-[4/3] overflow-hidden bg-snow-dark">
				{category.imageUrl ? (
					<img
						src={category.imageUrl}
						alt={category.name}
						loading="lazy"
						className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full items-center justify-center bg-gradient-to-br from-ink/70 to-ink/90 font-display text-3xl font-black text-white/50">
						{category.name}
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
			</div>
			<div className="absolute inset-x-0 bottom-0 p-4">
				<h3 className="font-display text-base font-black text-white drop-shadow-sm">
					{category.name}
				</h3>
			</div>
		</Link>
	);
}

export function CategoryMarquee({
	categories,
	baseTo,
}: {
	categories: Category[];
	baseTo: string;
}) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [copies, setCopies] = useState(MIN_COPIES);

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) {
			return;
		}
		const update = () => {
			const perList = Math.max(categories.length, 1);
			const needed = Math.ceil(container.clientWidth / ITEM_STEP);
			setCopies(Math.max(MIN_COPIES, Math.ceil(needed / perList)));
		};
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, [categories]);

	if (categories.length === 0) {
		return null;
	}

	const list = Array.from({ length: copies }).flatMap(() => categories);
	const sweepDuration = Math.max(12, list.length);

	return (
		<div
			ref={containerRef}
			className="category-marquee relative overflow-hidden"
			aria-label="Categorias"
		>
			<div
				className="category-marquee-track flex py-1"
				style={
					{
						'--category-sweep-duration': `${sweepDuration}s`,
					} as CSSProperties
				}
			>
				{[0, 1].map((half) => (
					<div key={half} className="flex gap-5 pr-5">
						{list.map((category, index) => (
							<CategoryMarqueeCard
								key={`${half}-${category.id}-${index}`}
								category={category}
								baseTo={baseTo}
							/>
						))}
					</div>
				))}
			</div>
			<style>{`
				.category-marquee-track {
					animation: category-sweep var(--category-sweep-duration) linear infinite;
				}
				.category-marquee:hover .category-marquee-track {
					animation-play-state: paused;
				}
				@keyframes category-sweep {
					from { transform: translateX(0); }
					to { transform: translateX(-50%); }
				}
				@media (prefers-reduced-motion: reduce) {
					.category-marquee-track {
						animation: none !important;
					}
				}
			`}</style>
		</div>
	);
}
