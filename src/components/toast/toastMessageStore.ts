import type { ToastMessage } from '@/server/toast-messages/types';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';

type ToastMessageState = {
	toastMessages: ToastMessage[];
	add: (toastMessage: ToastMessage | ToastMessage[]) => void;
	clear: () => void;
	setMessages: (toastMessages: ToastMessage[]) => void;
};

export const toastMessageStore = createStore<ToastMessageState>((set) => ({
	toastMessages: [],
	add: (toastMessages) => {
		const newMessages = Array.isArray(toastMessages)
			? toastMessages
			: [toastMessages];
		return set((state) => ({
			toastMessages: [...state.toastMessages, ...newMessages],
		}));
	},
	clear: () => set(() => ({ toastMessages: [] })),
	setMessages: (toastMessages) => set(() => ({ toastMessages })),
}));

export const useToastMessageStore = () =>
	useStore(toastMessageStore, (state) => state);
