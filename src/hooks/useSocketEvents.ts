import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket, disconnectSocket } from '../lib/socket';
import { useAuthStore } from '../store/auth';
import { useChatStore } from '../store/chat';
import type { ChatMessage, MessagesResponse } from '../types/api';

interface MessageNewPayload {
	conversationId: string;
	message: ChatMessage;
}

interface UnreadPayload {
	conversationId: string;
	unreadCount: number;
}

interface ConversationUpdatedPayload {
	conversationId: string;
}

interface ReadPayload {
	conversationId: string;
	userId: string;
}

interface TypingPayload {
	conversationId: string;
	userId: string;
	isTyping: boolean;
}

interface PresencePayload {
	userId: string;
	online: boolean;
}

export function useSocketEvents() {
	const sessionToken = useAuthStore((state) => state.sessionToken);
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!sessionToken) {
			disconnectSocket();
			return;
		}

		const socket = getSocket();
		if (!socket) {
			return;
		}
		const s = socket;

		const onMessageNew = (payload: MessageNewPayload) => {
			const currentUser = useAuthStore.getState().user;
			if (currentUser && payload.message.senderId !== currentUser.id) {
				const open = useChatStore.getState().openConversationId;
				if (open === payload.conversationId) {
					useChatStore
						.getState()
						.setUnread(payload.conversationId, 0);
				} else {
					useChatStore
						.getState()
						.incrementUnread(payload.conversationId);
				}
			}

			void queryClient.invalidateQueries({
				queryKey: ['conversations'],
			});

			queryClient.setQueryData<MessagesResponse>(
				['messages', payload.conversationId],
				(old) => {
					if (!old) return old;
					const exists = old.items.some(
						(m) => m.id === payload.message.id,
					);
					if (exists) return old;
					return {
						...old,
						items: [...old.items, payload.message],
					};
				},
			);
		};

		const onUnread = (payload: UnreadPayload) => {
			useChatStore
				.getState()
				.setUnread(payload.conversationId, payload.unreadCount);
			void queryClient.invalidateQueries({
				queryKey: ['conversations'],
			});
		};

		const onConversationUpdated = (payload: ConversationUpdatedPayload) => {
			void queryClient.invalidateQueries({
				queryKey: ['conversations'],
			});
			const open = useChatStore.getState().openConversationId;
			if (open === payload.conversationId) {
				void queryClient.invalidateQueries({
					queryKey: ['messages', payload.conversationId],
				});
			}
		};

		const onRead = (payload: ReadPayload) => {
			useChatStore
				.getState()
				.clearTyping(payload.conversationId, payload.userId);
			queryClient.setQueryData<MessagesResponse>(
				['messages', payload.conversationId],
				(old) => {
					if (!old) return old;
					return {
						...old,
						items: old.items.map((m) =>
							m.senderId === payload.userId
								? { ...m, isRead: true }
								: m,
						),
					};
				},
			);
		};

		const onTyping = (payload: TypingPayload) => {
			useChatStore
				.getState()
				.setTyping(
					payload.conversationId,
					payload.userId,
					payload.isTyping,
				);
			if (!payload.isTyping) {
				useChatStore
					.getState()
					.clearTyping(payload.conversationId, payload.userId);
			}
		};

		const onPresence = (payload: PresencePayload) => {
			useChatStore.getState().setPresence(payload.userId, payload.online);
		};

		const onNewSupportConversation = () => {
			void queryClient.invalidateQueries({
				queryKey: ['conversations', 'admin'],
			});
		};

		s.on('message:new', onMessageNew);
		s.on('conversation:unread', onUnread);
		s.on('conversation:updated', onConversationUpdated);
		s.on('message:read', onRead);
		s.on('typing', onTyping);
		s.on('presence', onPresence);
		s.on('conversation:new', onNewSupportConversation);

		return () => {
			s.off('message:new', onMessageNew);
			s.off('conversation:unread', onUnread);
			s.off('conversation:updated', onConversationUpdated);
			s.off('message:read', onRead);
			s.off('typing', onTyping);
			s.off('presence', onPresence);
			s.off('conversation:new', onNewSupportConversation);
		};
	}, [sessionToken, queryClient]);
}
