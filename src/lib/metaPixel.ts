import { META_PIXEL_ID } from './env';

/**
 * Wrapper mínimo sobre o Meta Pixel (Facebook Pixel).
 *
 * O bootstrap corre no carregamento do módulo, e não dentro de um
 * `useEffect`, porque a Meta recomenda que `fbq` exista *antes* de qualquer
 * chamada: o IIFE oficial transforma `window.fbq` numa fila, pelo que
 * `pixelTrack()` pode ser chamado em qualquer momento — antes ou depois de
 * o `fbevents.js` terminar de descarregar — sem perder eventos.
 *
 * Sem `VITE_META_PIXEL_ID` definido, todas as funções são no-op e o script
 * nunca é injectado (útil em desenvolvimento e em testes).
 */

export type PixelValue = string | number | boolean | null | undefined;
/** Campos extra de eventos standard, que a Meta aceita como `custom_parameters`. */
export type PixelParams = Record<
	string,
	PixelValue | PixelValue[] | Record<string, PixelValue>
>;

declare global {
	interface Window {
		fbq?: (...args: unknown[]) => void;
		_fbq?: unknown;
	}
}

/** Eventos padrão da Meta, mais os eventos custom desta plataforma. */
export type PixelEvent =
	// Standard
	| 'PageView'
	| 'ViewContent'
	| 'Search'
	| 'AddToWishlist'
	| 'Contact'
	| 'CompleteRegistration'
	| 'InitiateCheckout'
	| 'Subscribe'
	| 'Purchase'
	// Custom
	| 'Lead'
	| 'Review'
	| 'SubmitPaymentProof';

export function isPixelEnabled(): boolean {
	return META_PIXEL_ID !== '';
}

/**
 * Injeta o snippet base da Meta. Executado uma única vez por página: o
 * `if (f.fbq) return` do IIFE oficial torna-o idempotente, mas evita
 * ainda assim reconstruir a string do script.
 */
function bootstrap(): void {
	if (!isPixelEnabled() || typeof window === 'undefined') return;
	if (window.fbq) return;

	const w = window as any;
	w.fbq =
		w.fbq ||
		function fbq(...args: unknown[]) {
			if (typeof w.fbq.callMethod === 'function') {
				(w.fbq.callMethod as (...a: unknown[]) => void).apply(
					w.fbq,
					args,
				);
			} else {
				(w.fbq.queue as unknown[]).push(args);
			}
		};
	if (!w._fbq) w._fbq = w.fbq;
	w.fbq.push = w.fbq;
	w.fbq.loaded = true;
	w.fbq.version = '2.0';
	w.fbq.queue = [];

	const script = document.createElement('script');
	script.async = true;
	script.src = 'https://connect.facebook.net/en_US/fbevents.js';
	const first = document.getElementsByTagName('script')[0];
	first?.parentNode?.insertBefore(script, first);
}

bootstrap();

/**
 * Executa um comando `fbq` se o Pixel estiver activo. Silencioso por
 * desenho: uma falha de tracking nunca deve perturb a aplicação.
 */
function call(command: 'init' | 'track' | 'reset', ...args: unknown[]): void {
	if (!isPixelEnabled() || typeof window === 'undefined') return;
	try {
		window.fbq?.(command, ...args);
	} catch {
		// Best-effort.
	}
}

let initialized = false;

/**
 * `fbq('init', PIXEL_ID)`. Idempotente: o `MetaPixel` é montado nos dois
 * layouts raiz e o `<StrictMode>` duplica os efeitos em desenvolvimento, por
 * isso sem este guarda o `init` seria enviado mais do que uma vez.
 */
export function pixelInit(): void {
	if (!isPixelEnabled() || initialized) return;
	initialized = true;
	call('init', META_PIXEL_ID);
}

export function pixelPageView(): void {
	call('track', 'PageView');
}

export function pixelTrack(event: PixelEvent, params?: PixelParams): void {
	call('track', event, params);
}

/**
 * `fbq('reset')` — limpa a fila e o estado de attribution. Deve ser chamado
 * ao terminar a sessão para que o próximo utilizador não herde a
 * atribuição do anterior.
 */
export function pixelReset(): void {
	call('reset');
}
