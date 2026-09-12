import { Link } from 'react-router-dom';
import type { AdListItem } from '../../types/api';
import { PROVINCE_LABELS, timeAgo } from '../../lib/format';
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
				{ad.status === 'SOLD' ? (
					<span className="absolute left-3 top-3 rounded-full bg-red px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow">
						Vendido
					</span>
				) : (
					ad.featured && (
						<span className="absolute left-3 top-3 rounded-full bg-kwanza px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink shadow">
							★ Destaque
						</span>
					)
				)}
				{showStatus && (
					<div className="absolute right-2 top-2">
						<StatusPill status={ad.status} />
					</div>
				)}
			</Link>
			<div className="flex flex-1 flex-col gap-2.5 p-4">
				<Link
					to={`/anuncios/${ad.slug}`}
					className="line-clamp-1 text-sm font-bold hover:text-red"
				>
					{ad.title}
				</Link>
				<div className="flex flex-wrap items-center gap-1.5">
					{ad.category?.name && (
						<span className="chip border-blue/20 bg-blue/5 text-blue">
							{ad.category.name}
						</span>
					)}
					{ad.province && (
						<span className="chip">
							{PROVINCE_LABELS[ad.province] ?? ad.province}
						</span>
					)}
					<span className="chip">{timeAgo(ad.createdAt)}</span>
				</div>
				<div className="mt-auto flex items-center justify-between gap-2 pt-1">
					<Price value={ad.price} />
					{ad.averageRating !== null && (
						<Stars value={ad.averageRating} size={14} />
					)}
				</div>
			</div>
		</article>
	);
}
