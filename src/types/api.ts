export type UUID = string;

export interface Paginated<T> {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export type Role = 'USER' | 'PROMOTER' | 'MODERATOR' | 'ADMIN';
export type KYCStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type AdStatus = 'ACTIVE' | 'SOLD' | 'ARCHIVED' | 'REJECTED';
export type AdVisibility = 'VISIBLE' | 'HIDDEN';
export type CategoryType = 'AD' | 'BUSINESS';
export type BusinessStatus = 'SHOW' | 'HIDE';
export type ConversationType = 'AD' | 'BUSINESS' | 'SUPPORT';
export type ConversationStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type SubscriptionStatus = 'ACTIVE' | 'PENDING' | 'CANCELLED' | 'EXPIRED';
export type PaymentStatus =
	'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type ReportTarget = 'AD' | 'USER' | 'REVIEW' | 'MESSAGE';
export type ReportReason =
	| 'SPAM'
	| 'FRAUD'
	| 'FAKE_AD'
	| 'INAPPROPRIATE'
	| 'DEFECTIVE_PRODUCT'
	| 'NOT_AS_DESCRIBED'
	| 'OTHER';
export type ReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';

export const PROVINCES = [
	'BENGO',
	'BENGUELA',
	'BIÉ',
	'CABINDA',
	'CUANDO_CUBANGO',
	'CUANZA_NORTE',
	'CUANZA_SUL',
	'CUNENE',
	'HUAMBO',
	'HUÍLA',
	'LUANDA',
	'LUNDA_NORTE',
	'LUNDA_SUL',
	'MALANJE',
	'MOXICO',
	'NAMIBE',
	'UÍGE',
	'ZAIRE',
] as const;
export type Province = (typeof PROVINCES)[number];

export const REPORT_REASONS: ReportReason[] = [
	'SPAM',
	'FRAUD',
	'FAKE_AD',
	'INAPPROPRIATE',
	'DEFECTIVE_PRODUCT',
	'NOT_AS_DESCRIBED',
	'OTHER',
];

export interface MediaAsset {
	url: string;
	cloudinaryId: string;
	type?: string;
}

// ---------------- Users ----------------

export interface SafeUser {
	id: UUID;
	name: string;
	surname: string;
	email: string;
	emailVerified: boolean;
	image: string | null;
	role: Role;
	banned: boolean | null;
	banReason: string | null;
	banExpires: string | null;
	phone: string | null;
	trustScore: number;
	isVerified: boolean;
	createdAt: string;
	updatedAt: string;
	kyc: { status: KYCStatus } | null;
}

export interface Me extends SafeUser {
	accounts: { id: string; providerId: string; accountId: string }[];
	hasPassword: boolean;
}

export interface PublicUser {
	id: UUID;
	name: string;
	surname: string;
	image: string | null;
	trustScore: number;
	isVerified: boolean;
	verifiedAt: string | null;
	createdAt: string;
}

export interface AdminUser extends SafeUser {
	kyc: { status: KYCStatus; id: string } | null;
	adCount: number;
	subscriptions: (Subscription & { plan: PlanSummary })[];
}

export interface UsersListResponse {
	users: SafeUser[];
	total: number;
}

// ---------------- Categories ----------------

export interface Category {
	id: UUID;
	slug: string;
	name: string;
	type: CategoryType;
	adCount: number;
	businessCount: number;
}

// ---------------- Ads ----------------

export type AdSort =
	'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'distance';

export interface Ad {
	id: UUID;
	slug: string;
	title: string;
	description: string;
	price: number | null;
	status: AdStatus;
	visibility: AdVisibility;
	verified: boolean;
	createdAt: string;
	updatedAt: string;
	image: string | null;
	imageId: string | null;
	gallery: MediaAsset[];
	userId: UUID;
	averageRating: number | null;
	reviewCount: number;
	featured: boolean;
	featuredUntil: string | null;
	views: number;
	location: null;
	category?: { id: UUID; slug: string; name: string } | null;
}

export interface AdListItem extends Ad {
	user?: PublicUser;
}

export interface AdsListResponse extends Paginated<AdListItem> {
	proximity?: boolean;
}

export interface AdQueryParams {
	page?: number;
	limit?: number;
	sortBy?: AdSort;
	q?: string;
	categoryIds?: string;
	categorySlugs?: string;
	minPrice?: number;
	maxPrice?: number;
	includeInactive?: boolean;
	featured?: boolean;
	userId?: string;
}

// ---------------- Businesses ----------------

export interface Business {
	id: UUID;
	slug: string;
	name: string;
	description: string;
	address: string | null;
	province: Province;
	phone: string;
	whatsapp: string | null;
	email: string | null;
	website: string | null;
	logoUrl: string | null;
	logoId: string | null;
	coverUrl: string | null;
	coverId: string | null;
	gallery: MediaAsset[];
	category: { id: UUID; slug: string; name: string };
	owner: {
		id: UUID;
		name: string;
		surname: string;
		image: string | null;
		isVerified: boolean;
	};
	isVerified: boolean;
	status: BusinessStatus;
	viewCount: number;
	clickCount: number;
	reviewCount: number;
	averageRating: number | null;
	createdAt: string;
	updatedAt: string;
}

export interface BusinessQueryParams {
	page?: number;
	limit?: number;
	sortBy?: 'newest' | 'oldest' | 'name_asc' | 'name_desc';
	q?: string;
	province?: Province;
	provinces?: string;
	categoryId?: string;
	categoryIds?: string;
	featured?: boolean;
	ownerId?: string;
}

// ---------------- Reviews ----------------

export interface Review {
	id: UUID;
	rating: number;
	comment: string | null;
	response: string | null;
	createdAt: string;
	reviewer: { id: UUID; name: string; surname: string; image: string | null };
	reviewee: { id: UUID; name: string; surname: string; image: string | null };
	ad: {
		id: UUID;
		title: string;
		slug: string;
		image: string | null;
		price: number | null;
	} | null;
	business: {
		id: UUID;
		slug: string;
		name: string;
		coverUrl: string | null;
	} | null;
}

// ---------------- Reports ----------------

export interface Report {
	id: UUID;
	targetType: ReportTarget;
	targetId: UUID;
	targetLabel: string | null;
	reason: ReportReason;
	description: string | null;
	media: MediaAsset[];
	status: ReportStatus;
	createdAt: string;
	reporter: { id: UUID; name: string; surname: string; image: string | null };
}

// ---------------- Wishlist ----------------

export interface WishlistItem {
	id: UUID;
	createdAt: string;
	ad: AdListItem & { user: PublicUser };
}

// ---------------- KYC ----------------

export interface KycRecord {
	id: UUID;
	userId: UUID;
	status: KYCStatus;
	rejectionReason: string | null;
	biFrontUrl: string;
	biFrontId: string;
	biBackUrl: string;
	biBackId: string;
	selfies: MediaAsset[];
	verifiedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

// ---------------- Plans & Payments ----------------

export interface Plan {
	id: UUID;
	name: string;
	description: string | null;
	price: number;
	currency: string;
	durationDays: number;
	benefits: string[];
	businessVisibilityLimit: number;
	featuredAdsLimit: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface PlatformBankAccount {
	bankName: string;
	bankHolder: string;
	bankIban: string;
}

export interface PlansResponse {
	plans: Plan[];
	platformAccounts: PlatformBankAccount[];
}

export interface Subscription {
	id: UUID;
	userId: UUID;
	businessId: UUID;
	planId: UUID;
	status: SubscriptionStatus;
	startDate: string;
	endDate: string;
	autoRenew: boolean;
	cancelledAt: string | null;
	renewedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface PlanSummary {
	id: UUID;
	name: string;
	price: number;
	currency: string;
	durationDays: number;
}

export interface Payment {
	id: UUID;
	amount: number;
	status: PaymentStatus;
	platformAccount: PlatformBankAccount[] | null;
	proofUrl: string | null;
	proofId: string | null;
	proofAt: string | null;
	reviewedAt: string | null;
	reviewedBy: string | null;
	adminNote: string | null;
	createdAt: string;
	updatedAt: string;
	subscription: {
		id: UUID;
		status: SubscriptionStatus;
		startDate: string;
		endDate: string;
		autoRenew: boolean;
		business: { id: UUID; name: string; slug: string; ownerId: UUID };
		plan: PlanSummary;
	};
}

// ---------------- Chat ----------------

export interface ChatMessage {
	id: UUID;
	content: string;
	createdAt: string;
	senderId: UUID;
	isRead: boolean;
	media: MediaAsset[];
}

export interface Conversation {
	id: UUID;
	type: ConversationType;
	status: ConversationStatus;
	assignedTo: {
		id: UUID;
		name: string;
		surname: string;
		image: string | null;
	} | null;
	createdAt: string;
	updatedAt: string;
	ad: {
		id: UUID;
		title: string;
		slug: string;
		image: string | null;
		price: number | null;
	} | null;
	business: {
		id: UUID;
		name: string;
		slug: string;
		logoUrl: string | null;
	} | null;
	other:
		| { id: UUID; name: string; surname: string; image: string | null }
		| 'SUPPORT_AGENT'
		| null;
	lastMessage: ChatMessage | null;
	unreadCount: number;
}

export interface MessagesResponse {
	items: ChatMessage[];
	hasMore: boolean;
}

// ---------------- Analytics ----------------

export type AnalyticsRange = '7d' | '30d' | '90d' | '180d' | '365d' | '730d';
export type ContactChannel = 'phone' | 'whatsapp' | 'email' | 'website';

export interface AdAnalytics {
	adId: UUID;
	totals: { views: number; uniqueViews: number };
	daily: { date: string; views: number; uniqueViews: number }[];
}

export interface BusinessAnalytics {
	totals: {
		views: number;
		uniqueViews: number;
		clicks: number;
		clicksByChannel: { channel: ContactChannel; count: number }[];
	};
	daily: {
		date: string;
		views: number;
		uniqueViews: number;
		clicks: number;
	}[];
}

// ---------------- Search ----------------

export type SearchType = 'AD' | 'BUSINESS';

export type SearchItem =
	| (AdListItem & {
			type: 'AD';
			relevance: number;
			user: PublicUser;
	  })
	| (Business & {
			type: 'BUSINESS';
			relevance: number;
			owner: PublicUser;
	  });

// ---------------- Media (Cloudinary) ----------------

export interface MediaSignParams {
	cloud_name: string;
	api_key: string;
	timestamp: number;
	signature: string;
	folder: string;
	tags?: string;
	resourceType?: string;
}

// ---------------- Google ----------------

export interface GoogleAuthResult {
	status: boolean;
	sessionToken: string;
	user: {
		id: UUID;
		email: string;
		name: string;
		emailVerified: boolean;
		image: string | null;
		role: Role;
	};
}
