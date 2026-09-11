import type { Role } from '../types/api';

export function canCreateAds(role?: Role): boolean {
	return role === 'ADMIN' || role === 'MODERATOR';
}
