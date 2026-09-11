import { lazy, Suspense, type ComponentType } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
	AppLayout,
	RequireAuth,
	RequireGuest,
	RequireRole,
} from './components/layout/AppLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { AreaLayout } from './components/layout/AreaLayout';
import { PageLoader } from './components/ui/Spinner';

const lazyComponent = (loader: () => Promise<{ default: ComponentType }>) => {
	const Comp = lazy(loader);
	return function LazyWrapper(props: Record<string, never>) {
		return (
			<Suspense fallback={<PageLoader />}>
				<Comp {...props} />
			</Suspense>
		);
	};
};

const LandingPage = lazyComponent(() => import('./pages/LandingPage'));
const { SobrePage, TermosPage, PoliticasPage, CookiesPage, ContactosPage } = {
	SobrePage: lazyComponent(() =>
		import('./pages/InstitutionalPages').then((m) => ({
			default: m.SobrePage,
		})),
	),
	TermosPage: lazyComponent(() =>
		import('./pages/InstitutionalPages').then((m) => ({
			default: m.TermosPage,
		})),
	),
	PoliticasPage: lazyComponent(() =>
		import('./pages/InstitutionalPages').then((m) => ({
			default: m.PoliticasPage,
		})),
	),
	CookiesPage: lazyComponent(() =>
		import('./pages/InstitutionalPages').then((m) => ({
			default: m.CookiesPage,
		})),
	),
	ContactosPage: lazyComponent(() =>
		import('./pages/InstitutionalPages').then((m) => ({
			default: m.ContactosPage,
		})),
	),
};
const {
	AdsPage,
	AdDetailPage,
	BusinessesPage,
	BusinessDetailPage,
	SearchPage,
	PlansPage,
	NotFoundPage,
} = {
	AdsPage: lazyComponent(() =>
		import('./pages/MarketplacePages').then((m) => ({
			default: m.AdsPage,
		})),
	),
	AdDetailPage: lazyComponent(() =>
		import('./pages/MarketplacePages').then((m) => ({
			default: m.AdDetailPage,
		})),
	),
	BusinessesPage: lazyComponent(() =>
		import('./pages/MarketplacePages').then((m) => ({
			default: m.BusinessesPage,
		})),
	),
	BusinessDetailPage: lazyComponent(() =>
		import('./pages/MarketplacePages').then((m) => ({
			default: m.BusinessDetailPage,
		})),
	),
	SearchPage: lazyComponent(() =>
		import('./pages/MarketplacePages').then((m) => ({
			default: m.SearchPage,
		})),
	),
	PlansPage: lazyComponent(() =>
		import('./pages/MarketplacePages').then((m) => ({
			default: m.PlansPage,
		})),
	),
	NotFoundPage: lazyComponent(() =>
		import('./pages/MarketplacePages').then((m) => ({
			default: m.NotFoundPage,
		})),
	),
};

const {
	AuthLoginPage,
	AuthRegisterPage,
	AuthMagicPage,
	AuthVerifyPage,
	AuthForgotPage,
	AuthResetPage,
} = {
	AuthLoginPage: lazyComponent(() =>
		import('./pages/AuthPages').then((m) => ({ default: m.AuthLoginPage })),
	),
	AuthRegisterPage: lazyComponent(() =>
		import('./pages/AuthPages').then((m) => ({
			default: m.AuthRegisterPage,
		})),
	),
	AuthMagicPage: lazyComponent(() =>
		import('./pages/AuthPages').then((m) => ({ default: m.AuthMagicPage })),
	),
	AuthVerifyPage: lazyComponent(() =>
		import('./pages/AuthPages').then((m) => ({
			default: m.AuthVerifyPage,
		})),
	),
	AuthForgotPage: lazyComponent(() =>
		import('./pages/AuthPages').then((m) => ({
			default: m.AuthForgotPage,
		})),
	),
	AuthResetPage: lazyComponent(() =>
		import('./pages/AuthPages').then((m) => ({ default: m.AuthResetPage })),
	),
};

const {
	AreaDashboardPage,
	MyAdsPage,
	AdFormPage,
	MyBusinessesPage,
	BusinessFormPage,
	SubscribePage,
	WishlistPage,
	MessagesPage,
	PaymentsPage,
	MySubscriptionsPage,
	KycPage,
	SettingsPage,
} = {
	AreaDashboardPage: lazyComponent(() =>
		import('./pages/AreaPages').then((m) => ({
			default: m.AreaDashboardPage,
		})),
	),
	MyAdsPage: lazyComponent(() =>
		import('./pages/AreaPages').then((m) => ({ default: m.MyAdsPage })),
	),
	AdFormPage: lazyComponent(() =>
		import('./pages/AreaPages').then((m) => ({ default: m.AdFormPage })),
	),
	MyBusinessesPage: lazyComponent(() =>
		import('./pages/AreaPages').then((m) => ({
			default: m.MyBusinessesPage,
		})),
	),
	BusinessFormPage: lazyComponent(() =>
		import('./pages/AreaPages').then((m) => ({
			default: m.BusinessFormPage,
		})),
	),
	SubscribePage: lazyComponent(() =>
		import('./pages/AreaPages').then((m) => ({ default: m.SubscribePage })),
	),
	WishlistPage: lazyComponent(() =>
		import('./pages/AreaPages').then((m) => ({ default: m.WishlistPage })),
	),
	MessagesPage: lazyComponent(() =>
		import('./pages/AreaPages').then((m) => ({ default: m.MessagesPage })),
	),
	PaymentsPage: lazyComponent(() =>
		import('./pages/AreaPages').then((m) => ({ default: m.PaymentsPage })),
	),
	MySubscriptionsPage: lazyComponent(() =>
		import('./pages/AreaPages').then((m) => ({
			default: m.MySubscriptionsPage,
		})),
	),
	KycPage: lazyComponent(() =>
		import('./pages/AreaPages').then((m) => ({ default: m.KycPage })),
	),
	SettingsPage: lazyComponent(() =>
		import('./pages/AreaPages').then((m) => ({ default: m.SettingsPage })),
	),
};

const {
	AdminDashboardPage,
	AdminAdsPage,
	AdminBusinessesPage,
	AdminUsersPage,
	AdminUserPage,
	AdminPaymentsPage,
	AdminReportsPage,
	AdminKycPage,
	AdminSupportPage,
	AdminCategoriesPage,
	AdminAnalyticsPage,
} = {
	AdminDashboardPage: lazyComponent(() =>
		import('./pages/AdminPages').then((m) => ({
			default: m.AdminDashboardPage,
		})),
	),
	AdminAdsPage: lazyComponent(() =>
		import('./pages/AdminPages').then((m) => ({ default: m.AdminAdsPage })),
	),
	AdminBusinessesPage: lazyComponent(() =>
		import('./pages/AdminPages').then((m) => ({
			default: m.AdminBusinessesPage,
		})),
	),
	AdminUsersPage: lazyComponent(() =>
		import('./pages/AdminPages').then((m) => ({
			default: m.AdminUsersPage,
		})),
	),
	AdminUserPage: lazyComponent(() =>
		import('./pages/AdminPages').then((m) => ({
			default: m.AdminUserPage,
		})),
	),
	AdminPaymentsPage: lazyComponent(() =>
		import('./pages/AdminPages').then((m) => ({
			default: m.AdminPaymentsPage,
		})),
	),
	AdminReportsPage: lazyComponent(() =>
		import('./pages/AdminPages').then((m) => ({
			default: m.AdminReportsPage,
		})),
	),
	AdminKycPage: lazyComponent(() =>
		import('./pages/AdminPages').then((m) => ({ default: m.AdminKycPage })),
	),
	AdminSupportPage: lazyComponent(() =>
		import('./pages/AdminPages').then((m) => ({
			default: m.AdminSupportPage,
		})),
	),
	AdminCategoriesPage: lazyComponent(() =>
		import('./pages/AdminPages').then((m) => ({
			default: m.AdminCategoriesPage,
		})),
	),
	AdminAnalyticsPage: lazyComponent(() =>
		import('./pages/AdminPages').then((m) => ({
			default: m.AdminAnalyticsPage,
		})),
	),
};

const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			{ index: true, element: <LandingPage /> },
			{ path: 'anuncios', element: <AdsPage /> },
			{ path: 'anuncios/:slug', element: <AdDetailPage /> },
			{ path: 'empresas', element: <BusinessesPage /> },
			{ path: 'empresas/:slug', element: <BusinessDetailPage /> },
			{ path: 'busca', element: <SearchPage /> },
			{ path: 'planos', element: <PlansPage /> },
			{ path: 'sobre', element: <SobrePage /> },
			{ path: 'termos', element: <TermosPage /> },
			{ path: 'politicas', element: <PoliticasPage /> },
			{ path: 'cookies', element: <CookiesPage /> },
			{ path: 'contactos', element: <ContactosPage /> },
			{
				path: 'area',
				element: (
					<RequireAuth>
						<AreaLayout />
					</RequireAuth>
				),
				children: [
					{ index: true, element: <AreaDashboardPage /> },
					{ path: 'anuncios', element: <MyAdsPage /> },
					{ path: 'anuncios/novo', element: <AdFormPage /> },
					{ path: 'anuncios/:id/editar', element: <AdFormPage /> },
					{ path: 'empresas', element: <MyBusinessesPage /> },
					{ path: 'empresas/nova', element: <BusinessFormPage /> },
					{
						path: 'empresas/:id/editar',
						element: <BusinessFormPage />,
					},
					{
						path: 'empresas/:id/subscricao',
						element: <SubscribePage />,
					},
					{ path: 'favoritos', element: <WishlistPage /> },
					{ path: 'mensagens', element: <MessagesPage /> },
					{ path: 'pagamentos', element: <PaymentsPage /> },
					{ path: 'subscricoes', element: <MySubscriptionsPage /> },
					{ path: 'verificacao', element: <KycPage /> },
					{ path: 'definicoes', element: <SettingsPage /> },
				],
			},
			{
				path: 'admin',
				element: (
					<RequireRole roles={['ADMIN', 'MODERATOR']}>
						<AreaLayout admin />
					</RequireRole>
				),
				children: [
					{ index: true, element: <AdminDashboardPage /> },
					{ path: 'anuncios', element: <AdminAdsPage /> },
					{ path: 'empresas', element: <AdminBusinessesPage /> },
					{ path: 'utilizadores', element: <AdminUsersPage /> },
					{ path: 'utilizadores/:id', element: <AdminUserPage /> },
					{ path: 'pagamentos', element: <AdminPaymentsPage /> },
					{ path: 'denuncias', element: <AdminReportsPage /> },
					{ path: 'kyc', element: <AdminKycPage /> },
					{ path: 'suporte', element: <AdminSupportPage /> },
					{ path: 'categorias', element: <AdminCategoriesPage /> },
					{ path: 'analiticas', element: <AdminAnalyticsPage /> },
				],
			},
			{ path: '*', element: <NotFoundPage /> },
		],
	},
	{
		element: (
			<RequireGuest>
				<AuthLayout />
			</RequireGuest>
		),
		children: [
			{ path: 'auth/entrar', element: <AuthLoginPage /> },
			{ path: 'auth/registar', element: <AuthRegisterPage /> },
			{ path: 'auth/magic', element: <AuthMagicPage /> },
			{ path: 'auth/verificar', element: <AuthVerifyPage /> },
			{ path: 'auth/esqueci', element: <AuthForgotPage /> },
			{ path: 'auth/redefinir', element: <AuthResetPage /> },
		],
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
