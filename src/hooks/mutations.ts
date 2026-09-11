import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http, getApiError } from '../lib/api';
import { useAuthStore } from '../store/auth';
import type {
	AdStatus,
	AdVisibility,
	BusinessStatus,
	Category,
	CategoryType,
	ChatMessage,
	Conversation,
	ConversationStatus,
	ConversationType,
	GoogleAuthResult,
	KYCStatus,
	MediaAsset,
	Me,
	Payment,
	PaymentStatus,
	Province,
	ReportReason,
	ReportStatus,
	ReportTarget,
	Review,
	Role,
} from '../types/api';

interface MutationOptions {
	onSuccess?: () => void;
	onError?: (error: unknown) => void;
}

async function extractSession(): Promise<{ token: string | null; user: null }> {
	const res = await http.get<{
		user: Me;
		session: { token: string };
	}>('/auth/get-session');
	return { token: res.data.session.token, user: null };
}

// ================= Auth =================

interface EmailSignInDto {
	email: string;
	password: string;
}

export function useLoginEmail() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (dto: EmailSignInDto) => {
			await http.post('/auth/sign-in/email', dto);
			return extractSession();
		},
		onSuccess: (result) => {
			if (result.token) {
				useAuthStore
					.getState()
					.setSession(result.token, result.user ?? undefined);
			}
			void queryClient.invalidateQueries({ queryKey: ['me'] });
		},
	});
}

interface EmailSignUpDto {
	name: string;
	surname: string;
	email: string;
	password: string;
}

export function useSignUpEmail() {
	return useMutation({
		mutationFn: async (dto: EmailSignUpDto) => {
			const res = await http.post<{ token?: string; user?: Me }>(
				'/auth/sign-up/email',
				dto,
			);
			return res.data;
		},
	});
}

export function useVerifyEmail() {
	return useMutation({
		mutationFn: async (payload: {
			token: string;
			callbackURL?: string;
		}) => {
			const res = await http.post('/auth/verify-email', payload);
			return res.data;
		},
	});
}

export function useSendVerificationEmail() {
	return useMutation({
		mutationFn: async (payload: {
			email: string;
			callbackURL?: string;
		}) => {
			const res = await http.post(
				'/auth/send-verification-email',
				payload,
			);
			return res.data;
		},
	});
}

export function useForgetPassword() {
	return useMutation({
		mutationFn: async (payload: { email: string; redirectTo?: string }) => {
			const res = await http.post('/auth/forget-password', payload);
			return res.data;
		},
	});
}

export function useResetPassword() {
	return useMutation({
		mutationFn: async (payload: { newPassword: string; token: string }) => {
			const res = await http.post('/auth/reset-password', payload);
			return res.data;
		},
	});
}

export function useMagicLinkRequest() {
	return useMutation({
		mutationFn: async (payload: { email: string }) => {
			const res = await http.post('/auth/magic-link/request', payload);
			return res.data;
		},
	});
}

export function useMagicLinkVerify() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (token: string) => {
			const res = await http.post<{ sessionToken?: string; user?: Me }>(
				'/auth/magic-link/verify',
				{ token },
			);
			return res.data;
		},
		onSuccess: (data) => {
			if (data?.sessionToken) {
				useAuthStore
					.getState()
					.setSession(data.sessionToken, data.user ?? undefined);
				void queryClient.invalidateQueries({ queryKey: ['me'] });
			}
		},
	});
}

export function useGoogleSignIn() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (credentialIdToken: string) => {
			const res = await http.post<GoogleAuthResult>('/auth/google', {
				credential: credentialIdToken,
			});
			return res.data;
		},
		onSuccess: (data) => {
			useAuthStore.getState().setSession(data.sessionToken, null);
			void queryClient.invalidateQueries({ queryKey: ['me'] });
		},
	});
}

export function useLogout() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			await http.post('/auth/sign-out');
		},
		onSettled: () => {
			useAuthStore.getState().logout();
			void queryClient.clear();
		},
	});
}

export function useChangePassword() {
	return useMutation({
		mutationFn: async (payload: {
			currentPassword: string;
			newPassword: string;
			revokeOtherSessions?: boolean;
		}) => {
			const res = await http.post('/auth/change-password', payload);
			return res.data;
		},
	});
}

export function useSetPassword() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (newPassword: string) => {
			const res = await http.post('/auth/set-password', { newPassword });
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['me'] });
		},
	});
}

export function useChangeEmail() {
	return useMutation({
		mutationFn: async (newEmail: string) => {
			const res = await http.post('/auth/change-email', { newEmail });
			return res.data;
		},
	});
}

export function useListSessions() {
	return useMutation({
		mutationFn: async () => {
			const res = await http.get('/auth/list-sessions');
			return res.data;
		},
	});
}

export function useRevokeSession() {
	return useMutation({
		mutationFn: async (token: string) => {
			const res = await http.post('/auth/revoke-session', { token });
			return res.data;
		},
	});
}

export function useRevokeOtherSessions() {
	return useMutation({
		mutationFn: async () => {
			const res = await http.post('/auth/revoke-other-sessions');
			return res.data;
		},
	});
}

export function useUnlinkAccount() {
	return useMutation({
		mutationFn: async () => {
			const res = await http.post('/auth/unlink-google');
			return res.data;
		},
	});
}

export function useLinkGoogle() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (credential: string) => {
			const res = await http.post('/auth/link-google', {
				credential,
			});
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['me'] });
		},
	});
}

// ================= Utilizador =================

export interface UpdateProfileDto {
	name?: string;
	surname?: string;
	phone?: string;
	image?: string;
}

export function useUpdateProfile() {
	return useMutation({
		mutationFn: async (payload: UpdateProfileDto) => {
			const res = await http.patch<Me>('/users/me', payload);
			useAuthStore.getState().setUser(res.data);
			return res.data;
		},
	});
}

export interface CreateUserDto {
	name: string;
	surname: string;
	email: string;
	role: Role;
	password?: string;
}

export function useCreateUser() {
	return useMutation({
		mutationFn: async (payload: CreateUserDto) => {
			const res = await http.post('/users', payload);
			return res.data;
		},
	});
}

export function useBanUser() {
	return useMutation({
		mutationFn: async (payload: {
			id: string;
			reason?: string;
			banExpiresIn?: number;
		}) => {
			const res = await http.post(`/users/${payload.id}/ban`, {
				reason: payload.reason,
				banExpiresIn: payload.banExpiresIn,
			});
			return res.data;
		},
	});
}

export function useUnbanUser() {
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await http.post(`/users/${id}/unban`);
			return res.data;
		},
	});
}

export function useSetUserRole() {
	return useMutation({
		mutationFn: async (payload: { id: string; role: Role }) => {
			const res = await http.patch(`/users/${payload.id}/role`, {
				role: payload.role,
			});
			return res.data;
		},
	});
}

// ================= Categorias =================

export interface CreateCategoryDto {
	name: string;
	type: CategoryType;
	slug?: string;
}

export function useCreateCategory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: CreateCategoryDto) => {
			const res = await http.post<Category>('/categories', payload);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['categories'] }),
	});
}

export function useUpdateCategory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (
			payload: { id: string } & Partial<CreateCategoryDto>,
		) => {
			const { id, ...rest } = payload;
			const res = await http.patch<Category>(`/categories/${id}`, rest);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['categories'] }),
	});
}

export function useDeleteCategory() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await http.delete(`/categories/${id}`);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['categories'] }),
	});
}

// ================= Anúncios =================

export interface CreateAdPayload {
	title: string;
	description: string;
	price?: number;
	province?: Province | null;
	categoryIds: string[];
	image?: string;
	imageId?: string;
	gallery?: MediaAsset[];
}

export type UpdateAdPayload = Partial<CreateAdPayload>;

export function useCreateAd() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: CreateAdPayload) => {
			const res = await http.post('/ads', payload);
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['ads'] });
			void queryClient.invalidateQueries({ queryKey: ['analytics'] });
		},
	});
}

export function useUpdateAd() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: { id: string } & UpdateAdPayload) => {
			const { id, ...rest } = payload;
			const res = await http.patch(`/ads/${id}`, rest);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['ads'] }),
	});
}

export function useDeleteAd() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await http.delete(`/ads/${id}`);
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['ads'] });
			void queryClient.invalidateQueries({ queryKey: ['me'] });
		},
	});
}

export function useSetAdVisibility() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: {
			id: string;
			visibility: AdVisibility;
		}) => {
			const res = await http.patch(`/ads/${payload.id}/visibility`, {
				visibility: payload.visibility,
			});
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['ads'] }),
	});
}

export function useFeatureAd() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await http.post(`/ads/${id}/feature`);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['ads'] }),
	});
}

export function useUnfeatureAd() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await http.delete(`/ads/${id}/feature`);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['ads'] }),
	});
}

export function useModerateAd() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: {
			id: string;
			verified?: boolean;
			status?: AdStatus;
		}) => {
			const { id, ...rest } = payload;
			const res = await http.patch(`/ads/${id}/moderation`, rest);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['ads'] }),
	});
}

// ================= Empresas =================

export interface CreateBusinessPayload {
	name: string;
	slug?: string;
	description: string;
	address?: string;
	province: Province;
	phone?: string;
	whatsapp?: string;
	email?: string;
	website?: string;
	categoryId?: string;
	logoUrl?: string;
	logoId?: string;
	coverUrl?: string;
	coverId?: string;
	gallery?: MediaAsset[];
}

export type UpdateBusinessPayload = Partial<CreateBusinessPayload>;

export function useCreateBusiness() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: CreateBusinessPayload) => {
			const res = await http.post('/businesses', payload);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['businesses'] }),
	});
}

export function useUpdateBusiness() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: { id: string } & UpdateBusinessPayload) => {
			const { id, ...rest } = payload;
			const res = await http.patch(`/businesses/${id}`, rest);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['businesses'] }),
	});
}

export function useDeleteBusiness() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await http.delete(`/businesses/${id}`);
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['businesses'] });
			void queryClient.invalidateQueries({ queryKey: ['me'] });
		},
	});
}

export function useSetBusinessStatus() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: { id: string; status: BusinessStatus }) => {
			const res = await http.patch(`/businesses/${payload.id}/status`, {
				status: payload.status,
			});
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['businesses'] }),
	});
}

export function useModerateBusiness() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: {
			id: string;
			isVerified?: boolean;
			status?: BusinessStatus;
		}) => {
			const { id, ...rest } = payload;
			const res = await http.patch(`/businesses/${id}/moderation`, rest);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['businesses'] }),
	});
}

// ================= Avaliações =================

export interface CreateReviewPayload {
	adId?: string;
	businessId?: string;
	revieweeId?: string;
	rating: number;
	comment?: string;
}

export function useCreateReview() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: CreateReviewPayload) => {
			const res = await http.post<Review>('/reviews', payload);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['reviews'] }),
	});
}

export function useRespondReview() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: { id: string; response: string }) => {
			const res = await http.patch(`/reviews/${payload.id}/response`, {
				response: payload.response,
			});
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['reviews'] }),
	});
}

export function useDeleteReview() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await http.delete(`/reviews/${id}`);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['reviews'] }),
	});
}

// ================= Denúncias =================

export interface CreateReportPayload {
	targetType: ReportTarget;
	targetId: string;
	reason: ReportReason;
	description?: string;
	media?: MediaAsset[];
}

export function useCreateReport() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: CreateReportPayload) => {
			const res = await http.post('/reports', payload);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['reports'] }),
	});
}

export function useModerateReport() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: {
			id: string;
			status: ReportStatus;
			moderationNote?: string;
		}) => {
			const res = await http.patch(
				`/reports/${payload.id}/status`,
				payload,
			);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['reports'] }),
	});
}

// ================= Favoritos =================

export function useAddToWishlist() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (adId: string) => {
			const res = await http.post('/wishlist', { adId });
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['wishlist'] });
			void queryClient.invalidateQueries({ queryKey: ['ads'] });
		},
	});
}

export function useRemoveFromWishlist() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (adId: string) => {
			const res = await http.delete(`/wishlist/${adId}`);
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['wishlist'] });
			void queryClient.invalidateQueries({ queryKey: ['ads'] });
		},
	});
}

// ================= Conversas =================

export interface OpenConversationPayload {
	adId?: string;
	businessId?: string;
	type?: ConversationType;
}

export function useOpenConversation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: OpenConversationPayload) => {
			const res = await http.post<Conversation>(
				'/conversations',
				payload,
			);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['conversations'] }),
	});
}

export function useSendMessage() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: {
			conversationId: string;
			content: string;
			media?: MediaAsset[];
		}) => {
			const res = await http.post<ChatMessage>(
				`/conversations/${payload.conversationId}/messages`,
				{ content: payload.content, media: payload.media },
			);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['conversations'] }),
	});
}

export function useMarkConversationRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (conversationId: string) => {
			const res = await http.post(
				`/conversations/${conversationId}/read`,
			);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['conversations'] }),
	});
}

export function useClaimConversation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (conversationId: string) => {
			const res = await http.post(
				`/conversations/${conversationId}/claim`,
			);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['conversations'] }),
	});
}

export function useReleaseConversation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (conversationId: string) => {
			const res = await http.post(
				`/conversations/${conversationId}/release`,
			);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['conversations'] }),
	});
}

export function useResolveConversation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: {
			id: string;
			status: ConversationStatus;
		}) => {
			const res = await http.patch(
				`/conversations/${payload.id}/resolve`,
				{
					status: payload.status,
				},
			);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['conversations'] }),
	});
}

// ================= Pagamentos & Subscrições =================

export interface CreatePaymentPayload {
	businessId: string;
	planId: string;
	autoRenew?: boolean;
}

export function useCreatePayment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: CreatePaymentPayload) => {
			const res = await http.post<Payment>('/payments', payload);
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['payments'] });
			void queryClient.invalidateQueries({ queryKey: ['businesses'] });
			void queryClient.invalidateQueries({ queryKey: ['me'] });
		},
	});
}

export function useSubmitPaymentProof() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: {
			id: string;
			proofUrl: string;
			proofId: string;
		}) => {
			const res = await http.post(
				`/payments/${payload.id}/proof`,
				payload,
			);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['payments'] }),
	});
}

export function useCancelPayment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await http.post(`/payments/${id}/cancel`);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['payments'] }),
	});
}

export function useReviewPayment() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: {
			id: string;
			status: PaymentStatus;
			note?: string;
		}) => {
			const res = await http.patch(
				`/payments/${payload.id}/review`,
				payload,
			);
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['payments'] });
			void queryClient.invalidateQueries({ queryKey: ['businesses'] });
		},
	});
}

// ================= Planos (admin) =================

export interface PlanInput {
	name: string;
	description?: string;
	price: number;
	currency?: string;
	durationDays?: number;
	benefits?: string[];
	businessVisibilityLimit?: number;
	featuredAdsLimit?: number;
	isActive?: boolean;
}

export function useCreatePlan() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: PlanInput) => {
			const res = await http.post('/plans', payload);
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: ['admin', 'plans'],
			});
			void queryClient.invalidateQueries({ queryKey: ['plans'] });
		},
	});
}

export function useUpdatePlan() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: { id: string } & PlanInput) => {
			const { id, ...data } = payload;
			const res = await http.patch(`/plans/${id}`, data);
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: ['admin', 'plans'],
			});
			void queryClient.invalidateQueries({ queryKey: ['plans'] });
		},
	});
}

export function useDeletePlan() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			await http.delete(`/plans/${id}`);
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: ['admin', 'plans'],
			});
			void queryClient.invalidateQueries({ queryKey: ['plans'] });
		},
	});
}

// ================= KYC =================

export interface SubmitKycPayload {
	biFrontUrl: string;
	biFrontId: string;
	biBackUrl: string;
	biBackId: string;
	selfies: MediaAsset[];
	fullBodyUrl: string;
	fullBodyId: string;
}

export function useSubmitKyc() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: SubmitKycPayload) => {
			const res = await http.post('/kyc', payload);
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['kyc'] });
			void queryClient.invalidateQueries({ queryKey: ['me'] });
		},
	});
}

export function useReviewKyc() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: {
			id: string;
			status: KYCStatus;
			rejectionReason?: string;
		}) => {
			const { id, ...rest } = payload;
			const res = await http.patch(`/kyc/${id}/review`, rest);
			return res.data;
		},
		onSuccess: () =>
			void queryClient.invalidateQueries({ queryKey: ['kyc'] }),
	});
}

// ================= Analíticas =================

export function useTrackBusinessClick() {
	return useMutation({
		mutationFn: async (payload: {
			businessId: string;
			channel: 'phone' | 'whatsapp' | 'email' | 'website';
		}) => {
			const res = await http.post('/analytics/business-click', payload);
			return res.data;
		},
	});
}

// ================= Helpers =================

export function friendlyError(
	error: unknown,
	fallback = 'Ocorreu um erro. Tente novamente.',
): string {
	return getApiError(error, fallback);
}

export type { MutationOptions };
