import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { isPixelEnabled, pixelInit, pixelPageView } from '../../lib/metaPixel';

/**
 * Inicializa o Meta Pixel e reporta um `PageView` por navegação.
 *
 * Tem de ser montado *dentro* do contexto do router (daí ficar nos layouts
 * raiz e não em `App.tsx`, que está acima do `RouterProvider`).
 *
 * O guarda `lastPath` em `useRef` não é cosmético: `main.tsx` envolve a
 * aplicação em `<StrictMode>`, que em desenvolvimento executa os efeitos
 * duas vezes. Sem o guarda, cada navegação dispararia dois `PageView` e o
 * Events Manager contaria o dobro.
 */
export function MetaPixel() {
	const location = useLocation();
	const lastPath = useRef<string | null>(null);

	useEffect(() => {
		if (!isPixelEnabled()) return;
		pixelInit();
	}, []);

	useEffect(() => {
		if (!isPixelEnabled()) return;
		if (lastPath.current === location.pathname) return;
		lastPath.current = location.pathname;
		pixelPageView();
	}, [location.pathname]);

	return null;
}
