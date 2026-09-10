import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { GOOGLE_CLIENT_ID } from '../../lib/env';

type GoogleAccountsId = {
	initialize: (config: {
		client_id: string;
		ux_mode: 'popup';
		auto_select?: boolean;
		callback: (response: { credential?: string }) => void;
	}) => void;
	renderButton: (
		element: HTMLElement,
		options: {
			theme?: string;
			size?: string;
			shape?: string;
			text?: string;
			width?: number;
		},
	) => void;
};

type GoogleAccountsWindow = Window & {
	google?: {
		accounts?: {
			id?: GoogleAccountsId;
		};
	};
};

export function GoogleButton({
	onSuccess,
	width = 320,
}: {
	onSuccess: (credential: string) => void;
	width?: number;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const renderedRef = useRef(false);
	const onSuccessRef = useRef(onSuccess);

	useEffect(() => {
		onSuccessRef.current = onSuccess;
	}, [onSuccess]);

	useEffect(() => {
		if (!GOOGLE_CLIENT_ID || !containerRef.current) return;

		const container = containerRef.current;
		const render = () => {
			const id = (window as GoogleAccountsWindow).google?.accounts?.id;
			if (!id || renderedRef.current) return;
			id.initialize({
				client_id: GOOGLE_CLIENT_ID,
				ux_mode: 'popup',
				auto_select: false,
				callback: (response) => {
					if (response.credential) {
						onSuccessRef.current(response.credential);
					} else {
						toast.error('O login Google falhou. Tenta novamente.');
					}
				},
			});
			id.renderButton(container, {
				theme: 'outline',
				size: 'large',
				shape: 'rectangular',
				text: 'continue_with',
				width,
			});
			renderedRef.current = true;
		};

		render();

		if (renderedRef.current) return;

		const timer = window.setInterval(() => {
			const id = (window as GoogleAccountsWindow).google?.accounts?.id;
			if (id && !renderedRef.current) {
				window.clearInterval(timer);
				render();
			}
		}, 300);

		return () => window.clearInterval(timer);
	}, [width]);

	if (!GOOGLE_CLIENT_ID) {
		return null;
	}

	return <div ref={containerRef} className="flex justify-center" />;
}
