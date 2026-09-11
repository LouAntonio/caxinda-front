export type DeviceKind = 'desktop' | 'mobile' | 'tablet';

export interface ParsedUserAgent {
	kind: DeviceKind;
	browser: string;
	os: string;
	label: string;
}

export function parseUserAgent(ua?: string | null): ParsedUserAgent {
	const value = ua?.trim() ?? '';

	if (
		/(iPad|Tablet|PlayBook|Silk|Kindle|Android(?!.*Mobile)|Macintosh.*Mobile)/i.test(
			value,
		)
	) {
		return {
			kind: 'tablet',
			browser: detectBrowser(value),
			os: detectOs(value),
			label: summary(value, 'tablet'),
		};
	}
	if (
		/(iPhone|iPod|Mobile|Android|Windows Phone|BlackBerry|WebOS|Opera Mini|CriOS)/i.test(
			value,
		)
	) {
		return {
			kind: 'mobile',
			browser: detectBrowser(value),
			os: detectOs(value),
			label: summary(value, 'mobile'),
		};
	}
	return {
		kind: 'desktop',
		browser: detectBrowser(value),
		os: detectOs(value),
		label: summary(value, 'desktop'),
	};
}

function detectBrowser(ua: string): string {
	if (/Edg\//i.test(ua)) return 'Edge';
	if (/CriOS\//i.test(ua)) return 'Chrome (iOS)';
	if (/Chrome\//i.test(ua)) return 'Chrome';
	if (/Firefox\//i.test(ua)) return 'Firefox';
	if (/SamsungBrowser\//i.test(ua)) return 'Samsung Internet';
	if (/OPR\//i.test(ua) || /Opera\//i.test(ua)) return 'Opera';
	if (/Safari\//i.test(ua)) return 'Safari';
	if (/MSIE|Trident\//i.test(ua)) return 'Internet Explorer';
	return 'Navegador';
}

function detectOs(ua: string): string {
	if (/Windows Phone/i.test(ua)) return 'Windows Phone';
	if (/Windows/i.test(ua)) return 'Windows';
	if (/CrOS/i.test(ua)) return 'ChromeOS';
	if (/Mac OS X|Macintosh/i.test(ua)) return 'macOS';
	if (/iPhone|iPod/i.test(ua)) return 'iOS';
	if (/iPad/i.test(ua)) return 'iPadOS';
	if (/Android/i.test(ua)) return 'Android';
	if (/Linux/i.test(ua)) return 'Linux';
	return 'Dispositivo';
}

function summary(ua: string, kind: DeviceKind): string {
	const browser = detectBrowser(ua);
	const os = detectOs(ua);
	if (kind === 'desktop') {
		return `${browser} · ${os}`;
	}
	return `${browser} · ${os}`;
}
