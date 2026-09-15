import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
	useParams,
} from 'react-router-dom';
import {
	AppLayout,
	RequireAuth,
	RequireGuest,
	RequireRole,
} from './components/layout/AppLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { AreaLayout } from './components/layout/AreaLayout';
import LandingPage from './pages/LandingPage';
import {
	SobrePage,
	TermosPage,
	PoliticasPage,
	CookiesPage,
	ContactosPage,
} from './pages/InstitutionalPages';
import {
	AdsPage,
	AdDetailPage,
	BusinessesPage,
	BusinessDetailPage,
	SearchPage,
	PlansPage,
	NotFoundPage,
} from './pages/MarketplacePages';
import {
	AuthLoginPage,
	AuthRegisterPage,
	AuthMagicPage,
	AuthVerifyPage,
	AuthForgotPage,
	AuthResetPage,
} from './pages/AuthPages';
import {
	AreaDashboardPage,
	MyBusinessesPage,
	BusinessFormPage,
	SubscribePage,
	WishlistPage,
	MessagesPage,
	PaymentsPage,
	MySubscriptionsPage,
	KycPage,
	SettingsPage,
} from './pages/AreaPages';
import {
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
} from './pages/AdminPages';

function RedirectAnuncios() {
	const { slug } = useParams<{ slug: string }>();
	return <Navigate to={slug ? `/produtos/${slug}` : '/produtos'} replace />;
}

const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			{ index: true, element: <LandingPage /> },
			{ path: 'produtos', element: <AdsPage /> },
			{ path: 'produtos/:slug', element: <AdDetailPage /> },
			{ path: 'anuncios', element: <RedirectAnuncios /> },
			{ path: 'anuncios/:slug', element: <RedirectAnuncios /> },
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
