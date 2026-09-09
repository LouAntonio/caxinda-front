import { initials } from '../../lib/format';

interface AvatarProps {
	src?: string | null;
	name?: string | null;
	size?: 'sm' | 'md' | 'lg';
	online?: boolean;
}

const SIZES = {
	sm: 'h-8 w-8 text-xs',
	md: 'h-10 w-10 text-sm',
	lg: 'h-14 w-14 text-lg',
} as const;

export function Avatar({ src, name, size = 'md', online }: AvatarProps) {
	return (
		<span className={`relative inline-flex shrink-0 ${SIZES[size]}`}>
			{src ? (
				<img
					src={src}
					alt={name ?? ''}
					className="h-full w-full rounded-full border-2 border-white object-cover shadow-sm"
				/>
			) : (
				<span className="flex h-full w-full items-center justify-center rounded-full bg-blue font-display font-bold text-white">
					{initials(name)}
				</span>
			)}
			{online !== undefined && (
				<span
					className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
						online ? 'bg-green-600' : 'bg-ink/25'
					}`}
				/>
			)}
		</span>
	);
}
