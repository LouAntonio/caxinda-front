import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { http } from '../lib/api';
import { useAuthStore } from '../store/auth';
import type { Me } from '../types/api';

export function useSession() {
	const sessionToken = useAuthStore((state) => state.sessionToken);
	const user = useAuthStore((state) => state.user);
	const setUser = useAuthStore((state) => state.setUser);

	const query = useQuery({
		queryKey: ['me', sessionToken],
		queryFn: async () => {
			const res = await http.get<Me>('/users/me');
			return res.data;
		},
		enabled: Boolean(sessionToken),
		retry: false,
		staleTime: 60_000,
	});

	useEffect(() => {
		if (query.data) {
			setUser(query.data);
		} else if (!sessionToken) {
			setUser(null);
		}
	}, [query.data, sessionToken, setUser]);

	return {
		user,
		sessionToken,
		isLoading: Boolean(sessionToken) && !user && query.isLoading,
		isAuthenticated: Boolean(sessionToken) && Boolean(user),
	};
}
