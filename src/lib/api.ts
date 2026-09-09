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
			const auth = useAuthStore.getState();
			if (auth.sessionToken) {
				auth.logout();
			}
		}
		return Promise.reject(error);
	},
);

interface ApiErrorShape {
	message?: string | string[];
	error?: string;
}

export function getApiError(
	error: unknown,
	fallback = 'Ocorreu um erro inesperado.',
): string {
	if (axios.isAxiosError(error)) {
		const data = error.response?.data as ApiErrorShape | undefined;
		if (Array.isArray(data?.message)) {
			return data.message.join(', ');
		}
		if (data?.message) {
			return data.message;
		}
		if (data?.error) {
			return data.error;
		}
		if (error.code === 'ERR_NETWORK') {
			return 'Não foi possível contactar o servidor. Verifique a sua ligação.';
		}
		return error.message;
	}
	if (error instanceof Error) {
		return error.message;
	}
	return fallback;
}

export function isNotFoundError(error: unknown): boolean {
	return axios.isAxiosError(error) && error.response?.status === 404;
}
