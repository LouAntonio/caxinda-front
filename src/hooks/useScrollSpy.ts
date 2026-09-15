import { useEffect, useState } from 'react';

export function useScrollSpy(ids: string[], rootMargin = '0px 0px -70% 0px') {
	const [activeId, setActiveId] = useState('');

	useEffect(() => {
		if (ids.length === 0) return;

		const elements = ids
			.map((id) => document.getElementById(id))
			.filter(Boolean) as HTMLElement[];

		if (elements.length === 0) return;

		let lastObserved = '';

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						lastObserved = entry.target.id;
					}
				}
				setActiveId(lastObserved);
			},
			{ rootMargin },
		);

		for (const el of elements) {
			observer.observe(el);
		}

		return () => observer.disconnect();
	}, [ids, rootMargin]);

	return activeId;
}
