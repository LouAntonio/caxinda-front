import { create } from 'zustand';

interface ChatState {
	unreadByConversation: Record<string, number>;
	openConversationId: string | null;
	typingByConversation: Record<string, string | undefined>;
	presence: Record<string, boolean>;
	setUnread: (conversationId: string, count: number) => void;
	incrementUnread: (conversationId: string) => void;
	clearUnread: (conversationId: string) => void;
	setOpenConversation: (conversationId: string | null) => void;
	setTyping: (
		conversationId: string,
		userId: string | undefined,
		isTyping: boolean,
	) => void;
	clearTyping: (conversationId: string, userId: string) => void;
	setPresence: (userId: string, online: boolean) => void;
	reset: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
	unreadByConversation: {},
	openConversationId: null,
	typingByConversation: {},
	presence: {},
	setUnread: (conversationId, count) =>
		set((state) => ({
			unreadByConversation: {
				...state.unreadByConversation,
				[conversationId]: count,
			},
		})),
	incrementUnread: (conversationId) =>
		set((state) => ({
			unreadByConversation: {
				...state.unreadByConversation,
				[conversationId]:
					(state.unreadByConversation[conversationId] ?? 0) + 1,
			},
		})),
	clearUnread: (conversationId) =>
		set((state) => {
			const next = { ...state.unreadByConversation };
			delete next[conversationId];
			return { unreadByConversation: next };
		}),
	setOpenConversation: (conversationId) =>
		set({ openConversationId: conversationId }),
	setTyping: (conversationId, userId, isTyping) =>
		set((state) => ({
			typingByConversation: {
				...state.typingByConversation,
				[conversationId]: isTyping ? userId : undefined,
			},
		})),
	clearTyping: (conversationId, userId) =>
		set((state) => {
			if (state.typingByConversation[conversationId] !== userId) {
				return state;
			}
			const next = { ...state.typingByConversation };
			delete next[conversationId];
			return { typingByConversation: next };
		}),
	setPresence: (userId, online) =>
		set((state) => ({
			presence: { ...state.presence, [userId]: online },
		})),
	reset: () =>
		set({
			unreadByConversation: {},
			openConversationId: null,
			typingByConversation: {},
			presence: {},
		}),
}));
