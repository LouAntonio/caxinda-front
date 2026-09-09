import { Link } from 'react-router-dom';
import type { Business } from '../../types/api';
import { timeAgo } from '../../lib/format';
import { StatusPill } from '../ui/StatusPill';
import { Stars } from '../ui/Stars';

export function BusinessCard({
	business,
	showStatus = false,
}: {
	business: Business;
	showStatus?: boolean;
}) {
	return (
		<article className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
			<Link
				to={`/empresas/${business.slug}`}
				className="relative block h-40 overflow-hidden bg-snow-dark"
			>
				{business.coverUrl ? (
					<img
						src={business.coverUrl}
						alt={business.name}
						loading="lazy"
						className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full items-center justify-center bg-gradient-to-br from-blue to-blue-dark font-display text-2xl font-black text-white/30">
						{business.name?.slice(0, 12)}
					</div>
				)}
				{business.isVerified && (
					<span className="absolute left-2 top-2 rounded-full bg-blue px-2 py-0.5 text-[10px] font-bold text-white shadow">
						✔ VERIFICADA
					</span>
				)}
				{showStatus && (
					<div className="absolute right-2 top-2">
						<StatusPill status={business.status} />
					</div>
				)}
				<span className="absolute bottom-2 right-2 rounded-lg border-2 border-white bg-ink px-2 py-0.5 font-mono text-[10px] font-bold text-snow shadow">
					{business.province.replace('_', ' ')}
				</span>
			</Link>
			<div className="flex flex-1 flex-col gap-1.5 p-4">
				<Link
					to={`/empresas/${business.slug}`}
					className="line-clamp-1 text-sm font-bold hover:text-blue"
				>
					{business.name}
				</Link>
				<span className="text-xs font-semibold text-blue">
					{business.category.name}
				</span>
				<p className="line-clamp-2 text-sm text-ink/60">
					{business.description}
				</p>
				<div className="mt-auto flex items-center justify-between pt-1">
					<Stars value={business.averageRating} size={14} />
					<span className="font-mono text-xs text-ink/40">
						{timeAgo(business.createdAt)}
					</span>
				</div>
			</div>
		</article>
	);
}
