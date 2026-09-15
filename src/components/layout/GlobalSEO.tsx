import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function GlobalSEO() {
	const location = useLocation();

	useEffect(() => {
		// Update page title in browser tab
		document.title = 'Caxinda Divulga';
	}, [location.pathname]);

	return null;
}
