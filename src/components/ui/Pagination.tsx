import { Link, useSearchParams } from 'react-router-dom';
import { queryParams } from '../../lib/format';

interface PaginationProps {
	page: number;
	totalPages: number;
	basePath: string;
}

export function Pagination({ page, totalPages, basePath }: PaginationProps) {
	if (totalPages <= 1) {
		return null;
	}
	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

	return (
		<nav
			className="mt-8 flex items-center justify-center gap-1.5"
			aria-label="Paginação"
		>
			{pages.map((p) => (
				<Link
					key={p}
					to={`${basePath}${queryParams(p === 1 ? {} : { page: p })}`}
					className={`flex h-9 min-w-9 items-center justify-center rounded-lg border-2 px-2 font-mono text-sm font-bold transition ${
						p === page
							? 'border-red bg-red text-white'
							: 'border-ink/15 bg-white text-ink hover:border-ink/40'
					}`}
				>
					{p}
				</Link>
			))}
		</nav>
	);
}

export function usePageParam(defaultLimit = 15) {
	const [searchParams] = useSearchParams();
	const page = Math.max(1, Number(searchParams.get('page')) || 1);
	const limit = Math.min(
		50,
		Number(searchParams.get('limit')) || defaultLimit,
	);
	return { page, limit };
}
