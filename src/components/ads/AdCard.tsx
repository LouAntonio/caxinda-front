import { Link } from 'react-router-dom';
import type { AdListItem } from '../../types/api';
import { timeAgo } from '../../lib/format';
import { Price } from '../ui/Price';
import { StatusPill } from '../ui/StatusPill';
import { Stars } from '../ui/Stars';

export function AdCard({
	ad,
	showStatus = false,
}: {
	ad: AdListItem;
	showStatus?: boolean;
}) {
	return (
		<article className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
			<Link
				to={`/anuncios/${ad.slug}`}
				className="relative block aspect-[4/3] overflow-hidden bg-snow-dark"
			>
				{ad.image ? (
					<img
						src={ad.image}
						alt={ad.title}
						loading="lazy"
						className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full items-center justify-center bg-gradient-to-br from-snow-dark to-blue-dark/10 font-display text-3xl font-black text-ink/20">
						CX
					</div>
				)}
				<div className="absolute -left-1 top-2.5">
					<span
						className="inline-block bg-ink px-3 py-1 font-mono text-xs font-bold text-snow"
						style={{
							clipPath:
								'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
						}}
					>
						{ad.status === 'SOLD'
							? 'VENDIDO'
							: ad.featured
								? 'DESTAQUE'
								: 'CX'}
					</span>
				</div>
				{showStatus && (
					<div className="absolute right-2 top-2">
						<StatusPill status={ad.status} />
					</div>
				)}
			</Link>
			<div className="flex flex-1 flex-col gap-2 p-4">
				<Link
					to={`/anuncios/${ad.slug}`}
					className="line-clamp-1 text-sm font-bold hover:text-red"
				>
					{ad.title}
				</Link>
				<div className="mt-auto flex items-center justify-between gap-2">
					<Price value={ad.price} />
					<span className="font-mono text-xs text-ink/40">
						{timeAgo(ad.createdAt)}
					</span>
				</div>
				{ad.averageRating !== null && (
					<div className="flex items-center justify-between">
						<Stars value={ad.averageRating} size={14} />
						{ad.user && (
							<span className="text-xs text-ink/50">
								{ad.user.name} {ad.user.surname}
							</span>
						)}
					</div>
				)}
			</div>
		</article>
	);
}
