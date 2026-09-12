import { Link } from 'react-router-dom';
import type { Business } from '../../types/api';
import { PROVINCE_LABELS, timeAgo } from '../../lib/format';
import { StatusPill } from '../ui/StatusPill';
import { Stars } from '../ui/Stars';

export function BusinessCard({
	business,
	showStatus = false,
}: {
	business: Business;
	showStatus?: boolean;
}) {
	const featuredActive =
		business.featured &&
		business.featuredUntil &&
		new Date(business.featuredUntil) > new Date();

	return (
		<article className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
			<Link
				to={`/empresas/${business.slug}`}
				className="relative block aspect-[16/10] overflow-hidden bg-snow-dark"
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
				<div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
					{business.isVerified && (
						<span className="inline-flex items-center gap-1 rounded-full bg-blue px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow">
							✔ Verificada
						</span>
					)}
					{featuredActive && (
						<span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow">
							★ Destaque
						</span>
					)}
				</div>
				{showStatus && (
					<div className="absolute right-2 top-2">
						<StatusPill status={business.status} />
					</div>
				)}
				{business.province && (
					<span className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-ink/80 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-snow backdrop-blur">
						{PROVINCE_LABELS[business.province] ??
							business.province}
					</span>
				)}
			</Link>
			<div className="flex flex-1 flex-col gap-2 p-4">
				<Link
					to={`/empresas/${business.slug}`}
					className="line-clamp-1 text-sm font-bold hover:text-blue"
				>
					{business.name}
				</Link>
				<span className="chip self-start border-blue/20 bg-blue/5 text-blue">
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
