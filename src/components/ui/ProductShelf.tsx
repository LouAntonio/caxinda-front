import { Link } from 'react-router-dom';
import type { AdListItem } from '../../types/api';
import { AdCard } from '../ads/AdCard';
import { AdCardSkeletonGrid } from '../ads/AdCardSkeleton';

/**
 * Secção de produtos da homepage: cabeçalho (kicker + título + link) e uma
 * grelha de cartões. É apresentacional — a query fica na página, para que a
 * mesma peça sirva a várias fontes de dados (destaques, mais vistos, novidades).
 */
export function ProductShelf({
	kicker,
	title,
	to,
	items,
	isLoading,
	loadingCount = 8,
	sectionClassName = '',
	linkClassName = 'text-sm font-bold text-red hover:underline',
	gridClassName = 'grid grid-cols-2 gap-5 md:grid-cols-4 lg:items-start',
}: {
	kicker: string;
	title: string;
	to: string;
	items: AdListItem[];
	isLoading: boolean;
	loadingCount?: number;
	sectionClassName?: string;
	linkClassName?: string;
	gridClassName?: string;
}) {
	return (
		<section className={`py-16 ${sectionClassName}`.trim()}>
			<div className="mx-auto max-w-6xl px-4">
				<div className="mb-8 flex items-end justify-between">
					<div>
						<span className="kicker">{kicker}</span>
						<h2 className="mt-2 font-display text-2xl font-black">
							{title}
						</h2>
					</div>
					<Link to={to} className={linkClassName}>
						Ver todos →
					</Link>
				</div>
				{isLoading ? (
					<AdCardSkeletonGrid
						count={loadingCount}
						gridClassName={gridClassName}
					/>
				) : (
					<div className={gridClassName}>
						{items.map((ad) => (
							<AdCard key={ad.id} ad={ad} />
						))}
					</div>
				)}
			</div>
		</section>
	);
}
