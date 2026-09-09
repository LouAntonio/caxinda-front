import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App';
import { queryClient } from './lib/queryClient';
import { GOOGLE_CLIENT_ID } from './lib/env';

const root = document.getElementById('root')!;

const providers = (
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			{GOOGLE_CLIENT_ID ? (
				<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
					<App />
				</GoogleOAuthProvider>
			) : (
				<App />
			)}
			<Toaster
				position="top-center"
				toastOptions={{
					className: 'font-sans text-sm',
					style: { borderRadius: '12px' },
				}}
			/>
		</QueryClientProvider>
	</StrictMode>
);

createRoot(root).render(providers);
