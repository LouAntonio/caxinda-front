import { Link } from 'react-router-dom';

interface LogoProps {
	compact?: boolean;
	variant?: 'default' | 'dark';
}

export function Logo({ compact = false, variant = 'default' }: LogoProps) {
	const src = compact
		? '/images/logo/icon.png'
		: variant === 'dark'
			? '/images/logo/logoWhite.png'
			: '/images/logo/logo.png';

	return (
		<Link
			to="/"
			aria-label="Caxinda Divulga — página inicial"
			className="flex items-center"
		>
			<img
				src={src}
				alt="Caxinda Divulga"
				className={
					compact
						? 'h-9 w-9 rounded-xl object-contain'
						: 'h-9 w-auto object-contain'
				}
			/>
		</Link>
	);
}
