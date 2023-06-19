import type { ToastMessage } from '@/server/toast-messages/types';
import { Message } from './Message';
import { useToastMessageStore } from '../toastMessageStore';
import { useEffect } from 'react';

interface Props {
	messages: ToastMessage[];
}

export const MessageContainer = ({ messages }: Props) => {
	const { toastMessages, setMessages } = useToastMessageStore();

	useEffect(() => {
		setMessages(messages);
	}, []);
	return (
		<div className="absolute bottom-0 right-0 flex max-w-screen-sm flex-col px-2 pb-16">
			{toastMessages.map((message, i) => (
				<Message key={i} index={i} message={message} />
			))}
		</div>
	);
};
