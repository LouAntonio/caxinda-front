import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Me } from '../types/api';

interface AuthState {
	user: Me | null;
	sessionToken: string | null;
	setSession: (sessionToken: string, user?: Me | null) => void;
	setUser: (user: Me | null) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			sessionToken: null,
			setSession: (sessionToken, user) =>
				set((state) => ({
					sessionToken,
					user: user === undefined ? state.user : user,
				})),
			setUser: (user) => set({ user }),
			logout: () => set({ sessionToken: null, user: null }),
		}),
		{
			name: 'caxinda-session',
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({ sessionToken: state.sessionToken }),
		},
	),
);
