const env = import.meta.env as {
	VITE_GOOGLE_CLIENT_ID?: string;
	VITE_API_URL?: string;
};

export const GOOGLE_CLIENT_ID: string = env.VITE_GOOGLE_CLIENT_ID ?? '';

export const API_BASE: string = (env.VITE_API_URL ?? '/api').replace(
	/\/+$/,
	'',
);

export const API_ORIGIN: string = (() => {
	if (API_BASE.startsWith('http')) {
		try {
			return new URL(API_BASE).origin;
		} catch {
			return window.location.origin;
		}
	}
	return window.location.origin;
})();
