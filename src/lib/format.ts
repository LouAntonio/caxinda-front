const numberFormat = new Intl.NumberFormat('pt-PT', {
	maximumFractionDigits: 0,
});

const decimalFormat = new Intl.NumberFormat('pt-PT', {
	minimumFractionDigits: 0,
	maximumFractionDigits: 2,
});

export const PROVINCE_LABELS: Record<string, string> = {
	BENGO: 'Bengo',
	BENGUELA: 'Benguela',
	BIÉ: 'Bié',
	CABINDA: 'Cabinda',
	CUANDO_CUBANGO: 'Cuando-Cubango',
	CUANZA_NORTE: 'Cuanza Norte',
	CUANZA_SUL: 'Cuanza Sul',
	CUNENE: 'Cunene',
	HUAMBO: 'Huambo',
	HUÍLA: 'Huíla',
	LUANDA: 'Luanda',
	LUNDA_NORTE: 'Lunda Norte',
	LUNDA_SUL: 'Lunda Sul',
	MALANJE: 'Malanje',
	MOXICO: 'Moxico',
	NAMIBE: 'Namibe',
	UÍGE: 'Uíge',
	ZAIRE: 'Zaire',
};

export function formatKz(value: number | null | undefined): string {
	if (value === null || value === undefined) {
		return '—';
	}
	return `${numberFormat.format(value)} Kz`;
}

export function formatNumber(value: number): string {
	return numberFormat.format(value);
}

export function formatDecimal(value: number | null | undefined): string {
	if (value === null || value === undefined) {
		return '—';
	}
	return decimalFormat.format(value);
}

export function formatRating(value: number | null | undefined): string {
	if (value === null || value === undefined) {
		return '—';
	}
	return decimalFormat.format(value);
}

const dateFormat = new Intl.DateTimeFormat('pt-PT', {
	day: '2-digit',
	month: 'short',
	year: 'numeric',
});

const dateTimeFormat = new Intl.DateTimeFormat('pt-PT', {
	day: '2-digit',
	month: 'short',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
});

export function formatDate(value?: string | null): string {
	if (!value) {
		return '—';
	}
	return dateFormat.format(new Date(value));
}

export function formatDateTime(value?: string | null): string {
	if (!value) {
		return '—';
	}
	return dateTimeFormat.format(new Date(value));
}

const shortDateFormat = new Intl.DateTimeFormat('pt-PT', {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
});

export function formatShortDate(value?: string | null): string {
	if (!value) {
		return '—';
	}
	return shortDateFormat.format(new Date(value));
}

export function timeAgo(value?: string | null): string {
	if (!value) {
		return '';
	}
	const diffMs = Date.now() - new Date(value).getTime();
	const minutes = Math.floor(diffMs / 60_000);
	if (minutes < 1) {
		return 'agora';
	}
	if (minutes < 60) {
		return `há ${minutes} min`;
	}
	const hours = Math.floor(minutes / 60);
	if (hours < 24) {
		return `há ${hours} h`;
	}
	const days = Math.floor(hours / 24);
	if (days < 30) {
		return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;
	}
	const months = Math.floor(days / 30);
	if (months < 12) {
		return `há ${months} ${months === 1 ? 'mês' : 'meses'}`;
	}
	const years = Math.floor(months / 12);
	return `há ${years} ${years === 1 ? 'ano' : 'anos'}`;
}

export function plural(word: string, count: number): string {
	return `${count} ${word}${count === 1 ? '' : 's'}`;
}

export function initials(name?: string | null): string {
	if (!name) {
		return '?';
	}
	return name
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0])
		.join('')
		.toUpperCase();
}

export function fullName(
	name?: string | null,
	surname?: string | null,
): string {
	return [name, surname].filter(Boolean).join(' ').trim() || '—';
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function queryParams(
	params: Record<string, string | number | boolean | undefined | null>,
): string {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === '') {
			continue;
		}
		search.set(key, String(value));
	}
	const str = search.toString();
	return str ? `?${str}` : '';
}
