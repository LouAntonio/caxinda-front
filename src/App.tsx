import { lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
	AppLayout,
	RequireAuth,
	RequireGuest,
	RequireRole,
} from './components/layout/AppLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { AreaLayout } from './components/layout/AreaLayout';
import { AdDetailSkeleton } from './components/skeletons/AdDetailSkeleton';
import { BusinessDetailSkeleton } from './components/skeletons/BusinessDetailSkeleton';
import {
	AdsListSkeleton,
	BusinessesListSkeleton,
	PlansListSkeleton,
	RowsSkeleton,
	SearchListSkeleton,
} from './components/skeletons/ListSkeletons';
import {
	AuthSkeleton,
	FormSkeleton,
	TextPageSkeleton,
} from './components/skeletons/FormSkeletons';
import {
	DashboardSkeleton,
	TableSkeleton,
} from './components/skeletons/SkeletonsTables';
import {
	ChatSkeleton,
	LandingSkeleton,
} from './components/skeletons/AppSkeletons';

const lazyComponent = (
	loader: () => Promise<{ default: ComponentType }>,
	fallback?: ReactNode,
) => {
	const Comp = lazy(loader);
	return function LazyWrapper(props: Record<string, never>) {
		return (
			<Suspense fallback={fallback ?? null}>
				<Comp {...props} />
			</Suspense>
		);
	};
};

const LandingPage = lazyComponent(
	() => import('./pages/LandingPage'),
	<LandingSkeleton />,
);
const { SobrePage, TermosPage, PoliticasPage, CookiesPage, ContactosPage } = {
	SobrePage: lazyComponent(
		() =>
			import('./pages/InstitutionalPages').then((m) => ({
				default: m.SobrePage,
			})),
		<TextPageSkeleton />,
	),
	TermosPage: lazyComponent(
		() =>
			import('./pages/InstitutionalPages').then((m) => ({
				default: m.TermosPage,
			})),
		<TextPageSkeleton />,
	),
	PoliticasPage: lazyComponent(
		() =>
			import('./pages/InstitutionalPages').then((m) => ({
				default: m.PoliticasPage,
			})),
		<TextPageSkeleton />,
	),
	CookiesPage: lazyComponent(
		() =>
			import('./pages/InstitutionalPages').then((m) => ({
				default: m.CookiesPage,
			})),
		<TextPageSkeleton />,
	),
	ContactosPage: lazyComponent(
		() =>
			import('./pages/InstitutionalPages').then((m) => ({
				default: m.ContactosPage,
			})),
		<TextPageSkeleton />,
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
	AdsPage: lazyComponent(
		() =>
			import('./pages/MarketplacePages').then((m) => ({
				default: m.AdsPage,
			})),
		<AdsListSkeleton />,
	),
	AdDetailPage: lazyComponent(
		() =>
			import('./pages/MarketplacePages').then((m) => ({
				default: m.AdDetailPage,
			})),
		<AdDetailSkeleton />,
	),
	BusinessesPage: lazyComponent(
		() =>
			import('./pages/MarketplacePages').then((m) => ({
				default: m.BusinessesPage,
			})),
		<BusinessesListSkeleton />,
	),
	BusinessDetailPage: lazyComponent(
		() =>
			import('./pages/MarketplacePages').then((m) => ({
				default: m.BusinessDetailPage,
			})),
		<BusinessDetailSkeleton />,
	),
	SearchPage: lazyComponent(
		() =>
			import('./pages/MarketplacePages').then((m) => ({
				default: m.SearchPage,
			})),
		<SearchListSkeleton />,
	),
	PlansPage: lazyComponent(
		() =>
			import('./pages/MarketplacePages').then((m) => ({
				default: m.PlansPage,
			})),
		<PlansListSkeleton />,
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
	AuthLoginPage: lazyComponent(
		() =>
			import('./pages/AuthPages').then((m) => ({
				default: m.AuthLoginPage,
			})),
		<AuthSkeleton />,
	),
	AuthRegisterPage: lazyComponent(
		() =>
			import('./pages/AuthPages').then((m) => ({
				default: m.AuthRegisterPage,
			})),
		<AuthSkeleton />,
	),
	AuthMagicPage: lazyComponent(
		() =>
			import('./pages/AuthPages').then((m) => ({
				default: m.AuthMagicPage,
			})),
		<AuthSkeleton />,
	),
	AuthVerifyPage: lazyComponent(
		() =>
			import('./pages/AuthPages').then((m) => ({
				default: m.AuthVerifyPage,
			})),
		<AuthSkeleton />,
	),
	AuthForgotPage: lazyComponent(
		() =>
			import('./pages/AuthPages').then((m) => ({
				default: m.AuthForgotPage,
			})),
		<AuthSkeleton />,
	),
	AuthResetPage: lazyComponent(
		() =>
			import('./pages/AuthPages').then((m) => ({
				default: m.AuthResetPage,
			})),
		<AuthSkeleton />,
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
	AreaDashboardPage: lazyComponent(
		() =>
			import('./pages/AreaPages').then((m) => ({
				default: m.AreaDashboardPage,
			})),
		<DashboardSkeleton />,
	),
	MyAdsPage: lazyComponent(
		() =>
			import('./pages/AreaPages').then((m) => ({ default: m.MyAdsPage })),
		<AdsListSkeleton />,
	),
	AdFormPage: lazyComponent(
		() =>
			import('./pages/AreaPages').then((m) => ({
				default: m.AdFormPage,
			})),
		<FormSkeleton />,
	),
	MyBusinessesPage: lazyComponent(
		() =>
			import('./pages/AreaPages').then((m) => ({
				default: m.MyBusinessesPage,
			})),
		<BusinessesListSkeleton />,
	),
	BusinessFormPage: lazyComponent(
		() =>
			import('./pages/AreaPages').then((m) => ({
				default: m.BusinessFormPage,
			})),
		<FormSkeleton />,
	),
	SubscribePage: lazyComponent(
		() =>
			import('./pages/AreaPages').then((m) => ({
				default: m.SubscribePage,
			})),
		<PlansListSkeleton />,
	),
	WishlistPage: lazyComponent(
		() =>
			import('./pages/AreaPages').then((m) => ({
				default: m.WishlistPage,
			})),
		<AdsListSkeleton />,
	),
	MessagesPage: lazyComponent(
		() =>
			import('./pages/AreaPages').then((m) => ({
				default: m.MessagesPage,
			})),
		<ChatSkeleton />,
	),
	PaymentsPage: lazyComponent(
		() =>
			import('./pages/AreaPages').then((m) => ({
				default: m.PaymentsPage,
			})),
		<RowsSkeleton />,
	),
	MySubscriptionsPage: lazyComponent(
		() =>
			import('./pages/AreaPages').then((m) => ({
				default: m.MySubscriptionsPage,
			})),
		<RowsSkeleton />,
	),
	KycPage: lazyComponent(
		() => import('./pages/AreaPages').then((m) => ({ default: m.KycPage })),
		<FormSkeleton />,
	),
	SettingsPage: lazyComponent(
		() =>
			import('./pages/AreaPages').then((m) => ({
				default: m.SettingsPage,
			})),
		<FormSkeleton />,
	),
};

const {
	AdminDashboardPage,
	AdminAdsPage,
	AdminAdFormPage,
	AdminBusinessesPage,
	AdminUsersPage,
	AdminUserPage,
	AdminPaymentsPage,
	AdminReportsPage,
	AdminKycPage,
	AdminSupportPage,
	AdminCategoriesPage,
	AdminPlansPage,
	AdminBankAccountsPage,
	AdminAnalyticsPage,
} = {
	AdminDashboardPage: lazyComponent(
		() =>
			import('./pages/AdminPages').then((m) => ({
				default: m.AdminDashboardPage,
			})),
		<DashboardSkeleton />,
	),
	AdminAdsPage: lazyComponent(
		() =>
			import('./pages/AdminPages').then((m) => ({
				default: m.AdminAdsPage,
			})),
		<TableSkeleton />,
	),
	AdminAdFormPage: lazyComponent(
		() =>
			import('./pages/AdminPages').then((m) => ({
				default: m.AdminAdFormPage,
			})),
		<FormSkeleton />,
	),
	AdminBusinessesPage: lazyComponent(
		() =>
			import('./pages/AdminPages').then((m) => ({
				default: m.AdminBusinessesPage,
			})),
		<TableSkeleton />,
	),
	AdminUsersPage: lazyComponent(
		() =>
			import('./pages/AdminPages').then((m) => ({
				default: m.AdminUsersPage,
			})),
		<TableSkeleton />,
	),
	AdminUserPage: lazyComponent(
		() =>
			import('./pages/AdminPages').then((m) => ({
				default: m.AdminUserPage,
			})),
		<FormSkeleton />,
	),
	AdminPaymentsPage: lazyComponent(
		() =>
			import('./pages/AdminPages').then((m) => ({
				default: m.AdminPaymentsPage,
			})),
		<TableSkeleton />,
	),
	AdminReportsPage: lazyComponent(
		() =>
			import('./pages/AdminPages').then((m) => ({
				default: m.AdminReportsPage,
			})),
		<TableSkeleton />,
	),
	AdminKycPage: lazyComponent(
		() =>
			import('./pages/AdminPages').then((m) => ({
				default: m.AdminKycPage,
			})),
		<TableSkeleton />,
	),
	AdminSupportPage: lazyComponent(
		() =>
			import('./pages/AdminPages').then((m) => ({
				default: m.AdminSupportPage,
			})),
		<RowsSkeleton />,
	),
	AdminCategoriesPage: lazyComponent(
		() =>
			import('./pages/AdminPages').then((m) => ({
				default: m.AdminCategoriesPage,
			})),
		<TableSkeleton />,
	),
	AdminPlansPage: lazyComponent(
		() =>
			import('./pages/AdminPages').then((m) => ({
				default: m.AdminPlansPage,
			})),
		<TableSkeleton />,
	),
	AdminBankAccountsPage: lazyComponent(
		() =>
			import('./pages/AdminPages').then((m) => ({
				default: m.AdminBankAccountsPage,
			})),
		<RowsSkeleton />,
	),
	AdminAnalyticsPage: lazyComponent(
		() =>
			import('./pages/AdminPages').then((m) => ({
				default: m.AdminAnalyticsPage,
			})),
		<DashboardSkeleton />,
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
					{ path: 'anuncios/novo', element: <AdminAdFormPage /> },
					{ path: 'empresas', element: <AdminBusinessesPage /> },
					{ path: 'utilizadores', element: <AdminUsersPage /> },
					{ path: 'utilizadores/:id', element: <AdminUserPage /> },
					{ path: 'pagamentos', element: <AdminPaymentsPage /> },
					{ path: 'denuncias', element: <AdminReportsPage /> },
					{ path: 'kyc', element: <AdminKycPage /> },
					{ path: 'suporte', element: <AdminSupportPage /> },
					{ path: 'categorias', element: <AdminCategoriesPage /> },
					{ path: 'planos', element: <AdminPlansPage /> },
					{
						path: 'contas-bancarias',
						element: <AdminBankAccountsPage />,
					},
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
