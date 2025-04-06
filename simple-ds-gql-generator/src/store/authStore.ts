import { create } from 'zustand';

export type UserRole = 'admin' | 'organizer' | 'volunteer' | null;

interface User {
	id: string;
	name: string;
	role: UserRole;
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	login: (username: string, password: string) => Promise<boolean>;
	logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isAuthenticated: false,

	login: async (username: string, password: string) => {
		// В реальном приложении здесь будет запрос к API
		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (username === 'admin' && password === 'admin') {
			set({
				user: { id: '1', name: 'Администратор', role: 'admin' },
				isAuthenticated: true,
			});
			return true;
		} else if (username === 'organizer' && password === 'organizer') {
			set({
				user: { id: '2', name: 'Организатор', role: 'organizer' },
				isAuthenticated: true,
			});
			return true;
		} else if (username === 'volunteer' && password === 'volunteer') {
			set({
				user: { id: '3', name: 'Волонтер', role: 'volunteer' },
				isAuthenticated: true,
			});
			return true;
		}

		return false;
	},

	logout: () => {
		set({ user: null, isAuthenticated: false });
	},
}));
