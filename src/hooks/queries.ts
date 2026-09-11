import { useQuery } from '@tanstack/react-query';
import { http } from '../lib/api';
import type {
	Ad,
	AdQueryParams,
	AdsListResponse,
	AdAnalytics,
	AdListItem,
	AdminUser,
	AnalyticsRange,
	Business,
	BusinessAnalytics,
	BusinessQueryParams,
	Category,
	CategoryType,
	Conversation,
	ConversationType,
	KycRecord,
	MessagesResponse,
	MySubscription,
	Payment,
	PaymentStatus,
	PlansResponse,
	PublicUser,
	Report,
	ReportStatus,
	ReportTarget,
	Review,
	SearchItem,
	SearchSort,
	SearchType,
	Subscription,
	UsersListResponse,
	WishlistItem,
} from '../types/api';

export interface AdminListAdsQuery {
	page?: number;
	limit?: number;
	status?: string;
	visibility?: string;
	q?: string;
	sellerName?: string;
}

export interface AdminReportsQuery {
	page?: number;
	limit?: number;
	status?: ReportStatus;
	targetType?: ReportTarget;
	targetId?: string;
}

export interface KycListItem extends KycRecord {
	user: {
		id: string;
		name: string;
		surname: string;
		email: string;
		image: string | null;
		isVerified: boolean;
		banned: boolean | null;
		createdAt: string;
	};
}

// ---------------- Categorias ----------------

export function useCategories(type?: CategoryType) {
	return useQuery({
		queryKey: ['categories', type ?? 'all'],
		queryFn: async () => {
			const res = await http.get<Category[]>('/categories', {
				params: type ? { type } : {},
			});
			return res.data;
		},
	});
}

export function useCategory(slug?: string) {
	return useQuery({
		queryKey: ['categories', slug],
		queryFn: async () => {
			const res = await http.get<Category>(`/categories/${slug}`);
			return res.data;
		},
		enabled: Boolean(slug),
	});
}

// ---------------- Anúncios ----------------

export function useAds(params: AdQueryParams) {
	return useQuery({
		queryKey: ['ads', params],
		queryFn: async () => {
			const res = await http.get<AdsListResponse>('/ads', { params });
			return res.data;
		},
		placeholderData: (prev) => prev,
	});
}

export function useAd(id?: string) {
	return useQuery({
		queryKey: ['ads', id],
		queryFn: async () => {
			const res = await http.get<Ad>(`/ads/${id}`);
			return res.data;
		},
		enabled: Boolean(id),
	});
}

export function useAdBySlug(slug?: string) {
	return useQuery({
		queryKey: ['ads', 'slug', slug],
		queryFn: async () => {
			const res = await http.get<Ad>(`/ads/by-slug/${slug}`);
			return res.data;
		},
		enabled: Boolean(slug),
	});
}

export function useAdminAds(params: AdminListAdsQuery) {
	return useQuery({
		queryKey: ['ads', 'admin', params],
		queryFn: async () => {
			const res = await http.get<AdsListResponse>('/ads/admin', {
				params,
			});
			return res.data;
		},
	});
}

// ---------------- Empresas ----------------

export function useBusinesses(params: BusinessQueryParams) {
	return useQuery({
		queryKey: ['businesses', params],
		queryFn: async () => {
			const res = await http.get<{
				items: Business[];
				total: number;
				page: number;
				limit: number;
				totalPages: number;
			}>('/businesses', { params });
			return res.data;
		},
		placeholderData: (prev) => prev,
	});
}

export function useBusiness(id?: string) {
	return useQuery({
		queryKey: ['businesses', id],
		queryFn: async () => {
			const res = await http.get<Business>(`/businesses/${id}`);
			return res.data;
		},
		enabled: Boolean(id),
	});
}

export function useBusinessBySlug(slug?: string) {
	return useQuery({
		queryKey: ['businesses', 'slug', slug],
		queryFn: async () => {
			const res = await http.get<Business>(`/businesses/by-slug/${slug}`);
			return res.data;
		},
		enabled: Boolean(slug),
	});
}

// ---------------- Utilizadores ----------------

export function useSellerPublic(userId?: string) {
	return useQuery({
		queryKey: ['users', 'public', userId],
		queryFn: async () => {
			const res = await http.get<PublicUser>(`/users/public/${userId}`);
			return res.data;
		},
		enabled: Boolean(userId),
	});
}

export function useAdminUsers(params: {
	searchValue?: string;
	searchField?: 'email' | 'name';
	limit?: number;
	offset?: number;
	sortBy?: 'name' | 'email' | 'createdAt';
	sortDirection?: 'asc' | 'desc';
	filterField?: string;
	filterValue?: string;
}) {
	return useQuery({
		queryKey: ['users', 'admin', params],
		queryFn: async () => {
			const res = await http.get<UsersListResponse>('/users', {
				params,
			});
			return res.data;
		},
	});
}

export function useAdminUser(id?: string) {
	return useQuery({
		queryKey: ['users', id],
		queryFn: async () => {
			const res = await http.get<AdminUser>(`/users/${id}`);
			return res.data;
		},
		enabled: Boolean(id),
	});
}

// ---------------- Avaliações ----------------

export interface ReviewsTarget {
	adId?: string;
	businessId?: string;
	revieweeId?: string;
	page?: number;
	limit?: number;
}

export function useReviews(target: ReviewsTarget) {
	return useQuery({
		queryKey: ['reviews', target],
		queryFn: async () => {
			const res = await http.get<{
				items: Review[];
				total: number;
				page: number;
				limit: number;
				totalPages: number;
			}>('/reviews', { params: target });
			return res.data;
		},
		enabled: Boolean(target.adId || target.businessId || target.revieweeId),
	});
}

// ---------------- Denúncias ----------------

export function useReportCount(targetType: ReportTarget, targetId?: string) {
	return useQuery({
		queryKey: ['reports', 'count', targetType, targetId],
		queryFn: async () => {
			const res = await http.get<{ count: number }>('/reports/count', {
				params: { targetType, targetId },
			});
			return res.data.count;
		},
		enabled: Boolean(targetId),
	});
}

export function useMyReports() {
	return useQuery({
		queryKey: ['reports', 'mine'],
		queryFn: async () => {
			const res = await http.get<{
				items: Report[];
				total: number;
				page: number;
				limit: number;
				totalPages: number;
			}>('/reports/mine');
			return res.data;
		},
	});
}

export function useAdminReports(params: AdminReportsQuery) {
	return useQuery({
		queryKey: ['reports', 'admin', params],
		queryFn: async () => {
			const res = await http.get<{
				items: Report[];
				total: number;
				page: number;
				limit: number;
				totalPages: number;
			}>('/reports', { params });
			return res.data;
		},
	});
}

// ---------------- Favoritos ----------------

export function useWishlist(page = 1) {
	return useQuery({
		queryKey: ['wishlist', page],
		queryFn: async () => {
			const res = await http.get<{
				items: WishlistItem[];
				total: number;
				page: number;
				limit: number;
				totalPages: number;
			}>('/wishlist', { params: { page } });
			return res.data;
		},
	});
}

export function useWishlistCheck(adId?: string) {
	return useQuery({
		queryKey: ['wishlist', 'check', adId],
		queryFn: async () => {
			const res = await http.get<{ saved: boolean }>(
				`/wishlist/check/${adId}`,
			);
			return res.data.saved;
		},
		enabled: Boolean(adId),
	});
}

// ---------------- Planos & Pagamentos ----------------

export function usePlans() {
	return useQuery({
		queryKey: ['plans'],
		queryFn: async () => {
			const res = await http.get<PlansResponse>('/plans');
			return res.data;
		},
		staleTime: 5 * 60_000,
	});
}

export function useMyPayments() {
	return useQuery({
		queryKey: ['payments', 'mine'],
		queryFn: async () => {
			const res = await http.get<Payment[]>('/payments/mine');
			return res.data;
		},
	});
}

export function useMySubscriptions() {
	return useQuery({
		queryKey: ['payments', 'mine', 'subscriptions'],
		queryFn: async () => {
			const res = await http.get<MySubscription[]>(
				'/payments/mine/subscriptions',
			);
			return res.data;
		},
	});
}

export function usePayment(id?: string) {
	return useQuery({
		queryKey: ['payments', id],
		queryFn: async () => {
			const res = await http.get<Payment>(`/payments/${id}`);
			return res.data;
		},
		enabled: Boolean(id),
	});
}

export function useAdminPayments(params: {
	status?: PaymentStatus;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ['payments', 'admin', params],
		queryFn: async () => {
			const res = await http.get<{
				items: Payment[];
				total: number;
				page: number;
				limit: number;
				totalPages: number;
			}>('/payments', { params });
			return res.data;
		},
	});
}

// ---------------- KYC ----------------

export function useMyKyc() {
	return useQuery({
		queryKey: ['kyc', 'me'],
		queryFn: async () => {
			const res = await http.get<KycRecord | null>('/kyc/me');
			return res.data;
		},
	});
}

export function useAdminKycList(params: {
	status?: string;
	page?: number;
	limit?: number;
}) {
	return useQuery({
		queryKey: ['kyc', 'admin', params],
		queryFn: async () => {
			const res = await http.get<{
				items: KycListItem[];
				total: number;
				page: number;
				limit: number;
				totalPages: number;
			}>('/kyc', { params });
			return res.data;
		},
	});
}

// ---------------- Conversas ----------------

export function useConversations() {
	return useQuery({
		queryKey: ['conversations'],
		queryFn: async () => {
			const res = await http.get<{
				items: Conversation[];
				total: number;
				page: number;
				limit: number;
				totalPages?: number;
			}>('/conversations');
			return res.data;
		},
	});
}

export function useAdminConversations() {
	return useQuery({
		queryKey: ['conversations', 'admin'],
		queryFn: async () => {
			const res = await http.get<{
				items: Conversation[];
				total: number;
				page: number;
				limit: number;
			}>('/conversations/admin');
			return res.data;
		},
	});
}

export function useConversation(id?: string) {
	return useQuery({
		queryKey: ['conversations', id],
		queryFn: async () => {
			const res = await http.get<Conversation>(`/conversations/${id}`);
			return res.data;
		},
		enabled: Boolean(id),
	});
}

export function useMessages(conversationId?: string, before?: string) {
	return useQuery({
		queryKey: ['messages', conversationId, before],
		queryFn: async () => {
			const res = await http.get<MessagesResponse>(
				`/conversations/${conversationId}/messages`,
				{ params: before ? { before } : {} },
			);
			return res.data;
		},
		enabled: Boolean(conversationId),
		placeholderData: (prev) => prev,
	});
}

// ---------------- Analíticas ----------------

export function useAdAnalytics(adId?: string, range: AnalyticsRange = '30d') {
	return useQuery({
		queryKey: ['analytics', 'ad', adId, range],
		queryFn: async () => {
			const res = await http.get<AdAnalytics>(`/analytics/ad/${adId}`, {
				params: { range },
			});
			return res.data;
		},
		enabled: Boolean(adId),
	});
}

export function useBusinessAnalytics(
	businessId?: string,
	range: AnalyticsRange = '30d',
) {
	return useQuery({
		queryKey: ['analytics', 'business', businessId, range],
		queryFn: async () => {
			const res = await http.get<BusinessAnalytics>(
				`/analytics/business/${businessId}`,
				{ params: { range } },
			);
			return res.data;
		},
		enabled: Boolean(businessId),
	});
}

export function usePlatformAnalytics(range: AnalyticsRange = '30d') {
	return useQuery({
		queryKey: ['analytics', 'platform', range],
		queryFn: async () => {
			const res = await http.get<BusinessAnalytics>(
				'/analytics/platform',
				{
					params: { range },
				},
			);
			return res.data;
		},
	});
}

// ---------------- Busca ----------------

export interface GlobalSearchParams {
	q: string;
	type?: SearchType;
	categoryId?: string;
	province?: string;
	sortBy?: SearchSort;
	page?: number;
	limit?: number;
}

export function useGlobalSearch(params: GlobalSearchParams) {
	return useQuery({
		queryKey: ['search', params],
		queryFn: async () => {
			const res = await http.get<{
				items: SearchItem[];
				total: number;
				page: number;
				limit: number;
				totalPages: number;
			}>('/search', { params });
			return res.data;
		},
		enabled: params.q.trim().length > 0,
		placeholderData: (prev) => prev,
	});
}

// ---------------- Subscrições (gestão) ----------------

export interface AdminSubscription extends Subscription {
	business: { id: string; name: string; slug: string };
	plan: {
		id: string;
		name: string;
		price: number;
		currency: string;
		durationDays: number;
	};
	user: { id: string; name: string; email: string };
}

export type ConversationTypeUnion = ConversationType;

export type AdListConversationItem = AdListItem;
