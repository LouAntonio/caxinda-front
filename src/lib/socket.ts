import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { API_ORIGIN } from './env';
import { useAuthStore } from '../store/auth';

let socket: Socket | null = null;

export function getSocket(): Socket | null {
	const token = useAuthStore.getState().sessionToken;
	if (!token) {
		return null;
	}
	if (socket) {
		return socket;
	}

	socket = io(API_ORIGIN, {
		withCredentials: true,
		auth: { token },
		transports: ['websocket', 'polling'],
		autoConnect: true,
	});

	return socket;
}

export function disconnectSocket(): void {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
}

export function currentSocket(): Socket | null {
	return socket;
}
