import axios, { AxiosError } from 'axios';
import { API_BASE } from './env';
import { useAuthStore } from '../store/auth';

export const http = axios.create({
	baseURL: API_BASE,
	withCredentials: true,
	headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
	const token = useAuthStore.getState().sessionToken;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

http.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			const url = error.config?.url ?? '';
			if (url.endsWith('/users/me')) {
				const auth = useAuthStore.getState();
				if (auth.sessionToken) {
					auth.logout();
				}
			}
		}
		return Promise.reject(error);
	},
);

interface ApiErrorShape {
	message?: unknown;
	error?: unknown;
}

export function getApiError(
	error: unknown,
	fallback = 'Ocorreu um erro inesperado.',
): string {
	if (axios.isAxiosError(error)) {
		const data = error.response?.data as ApiErrorShape | undefined;
		if (data) {
			if (typeof data.message === 'string') {
				return data.message;
			}
			if (Array.isArray(data.message)) {
				return data.message.join(', ');
			}
			if (typeof data.error === 'string') {
				return data.error;
			}
			if (
				data.error &&
				typeof data.error === 'object' &&
				typeof (data.error as { message?: unknown }).message ===
					'string'
			) {
				return (data.error as { message: string }).message;
			}
		}
		if (error.code === 'ERR_NETWORK') {
			return 'Não foi possível contactar o servidor. Verifique a sua ligação.';
		}
		if (typeof error.message === 'string' && error.message) {
			return error.message;
		}
		return fallback;
	}
	if (error instanceof Error && error.message) {
		return error.message;
	}
	return fallback;
}

export function isNotFoundError(error: unknown): boolean {
	return axios.isAxiosError(error) && error.response?.status === 404;
}
