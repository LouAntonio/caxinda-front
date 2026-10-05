import { Link } from 'react-router-dom';
import type { AdListItem } from '../../types/api';
import { PROVINCE_LABELS, timeAgo } from '../../lib/format';
import { Price } from '../ui/Price';
import { StatusPill } from '../ui/StatusPill';
import { Stars } from '../ui/Stars';

/**
 * Material: etiqueta impressa — plana, sem sombra, com a imagem 1:1
 * dominante e uma faixa de preço de largura total encostada à base.
 * O `.price-band` tem de ser o último filho para que o `overflow-hidden`
 * do cartão arredonde a base.
 */
export function AdCard({
	ad,
	showStatus = false,
}: {
	ad: AdListItem;
	showStatus?: boolean;
}) {
	return (
		<article className="card-flat group hover:border-ink/20">
			<Link
				to={`/produtos/${ad.slug}`}
				className="relative block aspect-square overflow-hidden bg-snow-dark focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:outline-none"
			>
				{ad.image ? (
					<img
						src={ad.image}
						alt={ad.title}
						loading="lazy"
						className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
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
						<span className="absolute left-3 top-3 rounded-full bg-red px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow">
							★ Destaque
						</span>
					)
				)}
			</Link>

			{showStatus && (
				<div className="px-3 pt-3">
					<StatusPill status={ad.status} />
				</div>
			)}

			<div className="flex flex-1 flex-col gap-1.5 p-3">
				{ad.category?.name && (
					<span className="kicker truncate">{ad.category.name}</span>
				)}
				<Link
					to={`/produtos/${ad.slug}`}
					className="line-clamp-2 text-sm leading-snug font-bold focus-visible:rounded focus-visible:ring-2 focus-visible:ring-blue focus-visible:outline-none hover:text-red"
				>
					{ad.title}
				</Link>
				<div className="mt-auto flex flex-wrap items-center gap-1 pt-1">
					{ad.province && (
						<span className="chip">
							{PROVINCE_LABELS[ad.province] ?? ad.province}
						</span>
					)}
					<span className="chip">{timeAgo(ad.createdAt)}</span>
				</div>
			</div>

			<div className="price-band">
				<Price value={ad.price} variant="band" />
				{ad.averageRating !== null && (
					<span className="shrink-0">
						<Stars value={ad.averageRating} size={13} onDark />
					</span>
				)}
			</div>
		</article>
	);
}
