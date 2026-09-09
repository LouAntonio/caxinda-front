interface StatusMeta {
	label: string;
	className: string;
}

const STATUS_META: Record<string, StatusMeta> = {
	ACTIVE: {
		label: 'Ativo',
		className: 'border-green-600 bg-green-600/10 text-green-700',
	},
	PENDING: {
		label: 'Pendente',
		className: 'border-kwanza bg-kwanza/15 text-ink',
	},
	HIDDEN: {
		label: 'Oculto',
		className: 'border-ink/20 bg-ink/5 text-ink/70',
	},
	VISIBLE: {
		label: 'Visível',
		className: 'border-green-600 bg-green-600/10 text-green-700',
	},
	SOLD: { label: 'Vendido', className: 'border-blue bg-blue/10 text-blue' },
	ARCHIVED: {
		label: 'Arquivado',
		className: 'border-ink/20 bg-ink/5 text-ink/70',
	},
	REJECTED: {
		label: 'Rejeitado',
		className: 'border-red bg-red/10 text-red',
	},
	SHOW: {
		label: 'Em exibição',
		className: 'border-green-600 bg-green-600/10 text-green-700',
	},
	HIDE: { label: 'Oculto', className: 'border-ink/20 bg-ink/5 text-ink/70' },
	UNDER_REVIEW: {
		label: 'Em análise',
		className: 'border-blue bg-blue/10 text-blue',
	},
	APPROVED: {
		label: 'Aprovado',
		className: 'border-green-600 bg-green-600/10 text-green-700',
	},
	CANCELLED: {
		label: 'Cancelado',
		className: 'border-ink/20 bg-ink/5 text-ink/70',
	},
	EXPIRED: {
		label: 'Expirado',
		className: 'border-ink/20 bg-ink/5 text-ink/70',
	},
	RESOLVED: {
		label: 'Resolvido',
		className: 'border-green-600 bg-green-600/10 text-green-700',
	},
	DISMISSED: {
		label: 'Arquivado',
		className: 'border-ink/20 bg-ink/5 text-ink/70',
	},
	IN_PROGRESS: {
		label: 'Em progresso',
		className: 'border-blue bg-blue/10 text-blue',
	},
	OPEN: {
		label: 'Aberta',
		className: 'border-green-600 bg-green-600/10 text-green-700',
	},
	CLOSED: {
		label: 'Fechada',
		className: 'border-ink/20 bg-ink/5 text-ink/70',
	},
	REVIEWED: {
		label: 'Revisto',
		className: 'border-blue bg-blue/10 text-blue',
	},
	USER: {
		label: 'Utilizador',
		className: 'border-ink/20 bg-ink/5 text-ink/70',
	},
	PROMOTER: {
		label: 'Promotor',
		className: 'border-blue bg-blue/10 text-blue',
	},
	MODERATOR: {
		label: 'Moderador',
		className: 'border-kwanza bg-kwanza/15 text-ink',
	},
	ADMIN: { label: 'Admin', className: 'border-red bg-red/10 text-red' },
};

export function StatusPill({
	status,
	label,
}: {
	status: string;
	label?: string;
}) {
	const meta = STATUS_META[status] ?? {
		label: status,
		className: 'border-ink/20 bg-ink/5 text-ink/70',
	};
	return (
		<span
			className={`inline-flex items-center rounded-full border-2 px-2.5 py-0.5 text-xs font-bold ${meta.className}`}
		>
			{label ?? meta.label}
		</span>
	);
}
