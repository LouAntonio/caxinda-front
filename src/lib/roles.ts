import type { Role } from '../types/api';

/** Todas as roles, por ordem crescente de privilégio. */
export const ALL_ROLES: Role[] = ['USER', 'PROMOTER', 'MODERATOR', 'ADMIN'];

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
	USER: 'Consome a plataforma: publica anúncios, deixa avaliações eDenúncias.',
	PROMOTER:
		'Divulgador: gere as suas próprias empresas e os Respectivos anúncios.',
	MODERATOR: 'Modera o conteúdo e gere utilizadores, planos e pagamentos.',
	ADMIN: 'Acesso total, incluindo gestão de roles, contas bancárias e definições da plataforma.',
};

export function canCreateAds(role?: Role): boolean {
	return role === 'ADMIN' || role === 'MODERATOR';
}
