import type { ToastMessage } from '@/server/toast-messages/types';
import './messages.css';

export type Props = {
	message: ToastMessage;
	index: number;
};

export const Message = ({ message: { type, message }, index }: Props) => {
	const TIMEOUT = '15s';
	const checkboxId = `toast-message-${index}`;

	return (
		<>
			<input type="checkbox" className="hidden" id={checkboxId} />
			<div
				className="toast-message"
				style={{ ['--toastTimeout' as any]: TIMEOUT }}
				data-message-type={type}
			>
				{message}

				<label className="cursor-pointer" htmlFor={checkboxId}>
					<CrossIcon className="ml-3 inline-block h-6 w-6 text-white" />
				</label>
			</div>
		</>
	);
};

const CrossIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth={1.5}
		stroke="currentColor"
		{...props}
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M6 18L18 6M6 6l12 12"
		/>
	</svg>
);
