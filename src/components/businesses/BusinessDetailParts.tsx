import type { ReactNode } from 'react';
import type { Business } from '../../types/api';
import { PROVINCE_LABELS } from '../../lib/format';
import { StatusPill } from '../ui/StatusPill';
import { Stars } from '../ui/Stars';
import { PanelIcon, type PanelIconName } from '../ui/icons/PanelIcons';

function ContactRow({
	label,
	value,
	icon,
}: {
	label: string;
	value: string;
	icon: PanelIconName;
}) {
	return (
		<div className="flex items-center gap-2">
			<PanelIcon name={icon} size={14} className="shrink-0 text-ink/30" />
			<span className="truncate text-sm">{value}</span>
			<span className="ml-auto shrink-0 text-xs text-ink/40">
				{label}
			</span>
		</div>
	);
}

export function BusinessHeader({
	business,
	ownerLabel,
}: {
	business: Business;
	ownerLabel?: ReactNode;
}) {
	return (
		<div className="flex items-start gap-4">
			{business.logoUrl ? (
				<img
					src={business.logoUrl}
					alt={business.name}
					className="h-16 w-16 shrink-0 rounded-xl object-cover"
				/>
			) : (
				<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue to-blue-dark font-display text-2xl font-black text-white/40">
					{business.name?.slice(0, 2).toUpperCase()}
				</div>
			)}
			<div className="min-w-0 flex-1">
				<h3 className="font-display text-lg font-black">
					{business.name}
				</h3>
				<div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
					<span className="chip border-blue/20 bg-blue/5 text-blue">
						{business.category.name}
					</span>
					<span className="chip border-ink/10 bg-ink/5 text-ink/60">
						{PROVINCE_LABELS[business.province] ??
							business.province}
					</span>
				</div>
				<div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-ink/50">
					<Stars value={business.averageRating} size={13} />
					<span>{business.reviewCount} avaliações</span>
					{ownerLabel}
				</div>
			</div>
		</div>
	);
}

export function BusinessInfoSection({
	business,
	ownerLabel,
	planLabel,
}: {
	business: Business;
	ownerLabel?: ReactNode;
	planLabel?: ReactNode;
}) {
	const isFeatured =
		business.featured &&
		business.featuredUntil &&
		new Date(business.featuredUntil) > new Date();

	return (
		<div className="flex flex-col gap-4">
			<BusinessHeader business={business} ownerLabel={ownerLabel} />

			<div className="flex flex-wrap gap-1.5">
				<StatusPill status={business.status} />
				{business.isVerified && (
					<span className="chip border-blue/25 bg-blue/10 font-bold text-blue">
						Verificado
					</span>
				)}
				{isFeatured && (
					<span className="chip border-amber/30 bg-amber/10 font-bold text-amber-600">
						★ Destaque
					</span>
				)}
			</div>

			{planLabel}

			<div className="grid grid-cols-2 gap-3 rounded-lg bg-ink/[0.03] p-3">
				<div>
					<p className="text-[10px] font-bold uppercase tracking-wide text-ink/40">
						Visualizações
					</p>
					<p className="font-mono text-lg font-bold">
						{business.viewCount}
					</p>
				</div>
				<div>
					<p className="text-[10px] font-bold uppercase tracking-wide text-ink/40">
						Cliques
					</p>
					<p className="font-mono text-lg font-bold">
						{business.clickCount}
					</p>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<h4 className="font-display text-sm font-black">Contactos</h4>
				<div className="flex flex-col gap-1.5 rounded-lg bg-ink/[0.03] p-3">
					<ContactRow
						label="Telefone"
						value={business.phone}
						icon="id"
					/>
					{business.whatsapp && (
						<ContactRow
							label="WhatsApp"
							value={business.whatsapp}
							icon="eye"
						/>
					)}
					{business.email && (
						<ContactRow
							label="Email"
							value={business.email}
							icon="tag"
						/>
					)}
					{business.website && (
						<ContactRow
							label="Website"
							value={business.website}
							icon="cursor"
						/>
					)}
					{business.address && (
						<ContactRow
							label="Morada"
							value={business.address}
							icon="building"
						/>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<h4 className="font-display text-sm font-black">Descrição</h4>
				<p className="whitespace-pre-wrap text-sm text-ink/70">
					{business.description}
				</p>
			</div>
		</div>
	);
}
