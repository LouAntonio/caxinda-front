import { describe, expect, it } from 'vitest';
import {
	clamp,
	formatKz,
	fullName,
	initials,
	plural,
	queryParams,
	timeAgo,
} from './format';

describe('format', () => {
	it('formatKz formats numbers and placeholders', () => {
		expect(formatKz(1250)).toMatch(/1250\s?Kz$/);
		expect(formatKz(null)).toBe('—');
		expect(formatKz(undefined)).toBe('—');
	});

	it('fullName joins name and surname', () => {
		expect(fullName('Maria', 'Santos')).toBe('Maria Santos');
		expect(fullName('Maria', null)).toBe('Maria');
		expect(fullName(null, null)).toBe('—');
	});

	it('initials extracts up to two initials', () => {
		expect(initials('João Manuel Ferreira')).toBe('JM');
		expect(initials('João')).toBe('J');
		expect(initials(null)).toBe('?');
	});

	it('plural pluralises words', () => {
		expect(plural('anúncio', 1)).toBe('1 anúncio');
		expect(plural('anúncio', 3)).toBe('3 anúncios');
	});

	it('timeAgo returns relative times', () => {
		expect(timeAgo(null)).toBe('');
		expect(timeAgo(new Date().toISOString())).toBe('agora');
		const minuteAgo = new Date(Date.now() - 60_000).toISOString();
		expect(timeAgo(minuteAgo)).toBe('há 1 min');
		const dayAgo = new Date(Date.now() - 24 * 3600_000).toISOString();
		expect(timeAgo(dayAgo)).toBe('há 1 dia');
	});

	it('clamp keeps values within bounds', () => {
		expect(clamp(5, 0, 10)).toBe(5);
		expect(clamp(-2, 0, 10)).toBe(0);
		expect(clamp(12, 0, 10)).toBe(10);
	});

	it('queryParams skips empty/undefined values', () => {
		expect(
			queryParams({ q: 'carro', page: 2, minPrice: null, empty: '' }),
		).toBe('?q=carro&page=2');
		expect(queryParams({})).toBe('');
	});
});
