import { Link } from 'react-router-dom';
import type { Business } from '../../types/api';
import { PROVINCE_LABELS, timeAgo } from '../../lib/format';
import { StatusPill } from '../ui/StatusPill';
import { Stars } from '../ui/Stars';

/**
 * Material: ficha — elevada, com *hover lift*, rail fino azul no topo,
 * montra baixa 16:9, selo a cavalgar a fronteira e um rodapé de reputação
 * separado por `divider`. Lê-se como um registo, ao contrário da etiqueta
 * impressa do cartão de produto.
 */
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
		<article className="card-elevated group overflow-hidden">
			<div className="h-1.5 w-full shrink-0 bg-blue" />
			<Link
				to={`/empresas/${business.slug}`}
				className="relative block aspect-[16/9] overflow-hidden bg-snow-dark focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:outline-none"
			>
				{business.coverUrl ? (
					<img
						src={business.coverUrl}
						alt={business.name}
						loading="lazy"
						className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
					/>
				) : (
					<div className="h-full w-full bg-gradient-to-br from-blue to-blue-dark" />
				)}
				{featuredActive && (
					<span className="absolute left-3 top-3 rounded-full bg-red px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow">
						★ Destaque
					</span>
				)}
				{showStatus && (
					<div className="absolute right-2 top-2">
						<StatusPill status={business.status} />
					</div>
				)}
			</Link>

			{/* Selo: o logo a cavalgar a fronteira montra/rodapé, com anel
			    azul quando a empresa está verificada. */}
			<div className="relative z-10 -mt-7 px-4">
				<span
					className={`business-seal flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-[3px] bg-white shadow-md transition duration-300 group-hover:-translate-y-0.5 ${
						business.isVerified ? 'border-blue' : 'border-ink/15'
					}`}
				>
					{business.logoUrl ? (
						<img
							src={business.logoUrl}
							alt=""
							loading="lazy"
							className="h-full w-full object-contain p-1"
						/>
					) : (
						<span className="font-display text-xl font-black text-ink">
							{(business.name ?? '?')
								.trim()
								.slice(0, 1)
								.toUpperCase()}
						</span>
					)}
				</span>
			</div>

			<div className="flex flex-1 flex-col gap-2 p-4 pt-3">
				<Link
					to={`/empresas/${business.slug}`}
					className="line-clamp-2 font-display text-lg leading-tight font-black focus-visible:rounded focus-visible:ring-2 focus-visible:ring-blue focus-visible:outline-none hover:text-blue"
				>
					{business.name}
				</Link>
				<div className="flex flex-wrap gap-1.5">
					<span className="chip max-w-[11rem] self-start border-blue/25 bg-blue/5 text-blue">
						<span className="truncate">
							{business.category.name}
						</span>
					</span>
					{business.province && (
						<span className="chip self-start">
							{PROVINCE_LABELS[business.province] ??
								business.province}
						</span>
					)}
				</div>
				<p className="line-clamp-2 text-sm leading-relaxed text-ink/60">
					{business.description}
				</p>

				{/* Reputação: o que ancora um prestador de serviços. */}
				<div className="mt-auto flex items-center justify-between gap-2 pt-2">
					<div className="flex min-w-0 items-center gap-1.5">
						<Stars value={business.averageRating} size={14} />
						{business.reviewCount > 0 && (
							<span className="font-mono text-[0.65rem] font-bold text-ink/45">
								({business.reviewCount})
							</span>
						)}
					</div>
					{business.isVerified && (
						<span className="stamp shrink-0">Verificado</span>
					)}
				</div>
				<div className="divider mt-1" />
				<p className="font-mono text-[0.6rem] font-bold tracking-wider text-ink/40 uppercase">
					Na Caxinda {timeAgo(business.createdAt)}
				</p>
			</div>
		</article>
	);
}
