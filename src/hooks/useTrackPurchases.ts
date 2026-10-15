import { useEffect, useRef } from 'react';
import { pixelTrack } from '../lib/metaPixel';
import type { Payment } from '../types/api';

const STORAGE_KEY = 'cx_pixel_purchases';
const MAX_ENTRIES = 50;

function readFired(): Set<string> {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return new Set();
		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed)
			? new Set(parsed.filter((v): v is string => typeof v === 'string'))
			: new Set();
	} catch {
		// localStorage indisponível (modo privado) — deduplica só nesta sessão.
		return new Set();
	}
}

function rememberFired(ids: Iterable<string>): void {
	try {
		const merged = new Set([...readFired(), ...ids]);
		// Mais recente primeiro, para que o corte nunca reinvoque um evento
		// antigo que ainda esteja na lista.
		window.localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify([...merged].slice(-MAX_ENTRIES)),
		);
	} catch {
		// Best-effort.
	}
}

/**
 * Dispara `Purchase` para cada pagamento aprovado que ainda não foi
 * reportado ao Meta.
 *
 * Como não há Conversions API, o evento é emitido no browser do cliente
 * quando ele vê o pagamento como `APPROVED` — o que acontece ao reabrir a
 * página de pagamentos ou ao voltar a esta janela (o `useMyPayments`
 * revalida no foco). Limitações inerentes a esta abordagem: um cliente que
 * feche o browser depois de pagar nunca gera o evento, e o `_fbp`/_fbc`
 * registados são os do cliente (que é o correcto) mas não são verificáveis
 * contra um evento servidor.
 *
 * A deduplicação é em dois níveis porque o componente pode remontar
 * (StrictMode, navegação) ou a página ser recarregada: `useRef` cobre a
 * remontagem, `localStorage` cobre o recarregamento. Sem os dois, cada
 * `refetch` contaria uma compra nova.
 */
export function useTrackPurchases(payments: Payment[] | undefined): void {
	const firedThisMount = useRef<Set<string>>(new Set());

	useEffect(() => {
		if (!payments || payments.length === 0) return;

		const persisted = readFired();
		const approved = payments.filter((p) => p.status === 'APPROVED');
		if (approved.length === 0) return;

		for (const payment of approved) {
			if (persisted.has(payment.id)) continue;
			if (firedThisMount.current.has(payment.id)) continue;
			firedThisMount.current.add(payment.id);

			pixelTrack('Purchase', {
				content_ids: [payment.subscription.plan.id],
				content_name: payment.subscription.plan.name,
				content_type: 'product',
				num_items: 1,
				value: payment.amount,
				currency: payment.subscription.plan.currency || 'AOA',
			});
		}

		// Persiste todos os aprovados (já reportados ou não) para que um
		// simples refetch não volte a disparar.
		rememberFired(approved.map((p) => p.id));
	}, [payments]);
}
