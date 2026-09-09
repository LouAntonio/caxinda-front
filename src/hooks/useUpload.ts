import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { http } from '../lib/api';
import type { MediaAsset, MediaSignParams } from '../types/api';

export type MediaFolder =
	'ads' | 'businesses' | 'chat' | 'kyc' | 'reports' | 'payments';

interface UploadResult {
	url: string;
	cloudinaryId: string;
	type: string;
}

async function uploadFile(
	file: File,
	folder: MediaFolder,
	resourceType: 'image' | 'video' = 'image',
): Promise<UploadResult> {
	const signRes = await http.get<MediaSignParams>('/media/sign', {
		params: { folder, resourceType },
	});
	const sign = signRes.data;

	const form = new FormData();
	form.append('file', file);
	form.append('api_key', sign.api_key);
	form.append('timestamp', String(sign.timestamp));
	form.append('signature', sign.signature);
	form.append('folder', sign.folder);
	if (sign.tags) {
		form.append('tags', sign.tags);
	}

	const uploadRes = await axios.post<{
		secure_url: string;
		public_id: string;
	}>(
		`https://api.cloudinary.com/v1_1/${sign.cloud_name}/${resourceType}/upload`,
		form,
	);

	return {
		url: uploadRes.data.secure_url,
		cloudinaryId: uploadRes.data.public_id,
		type: resourceType,
	};
}

export function useUpload(folder: MediaFolder) {
	return useMutation<UploadResult, unknown, File>({
		mutationFn: (file) => uploadFile(file, folder),
	});
}

export function uploadImage(
	file: File,
	folder: MediaFolder,
): Promise<MediaAsset> {
	return uploadFile(file, folder, 'image');
}

export function uploadVideo(
	file: File,
	folder: MediaFolder,
): Promise<MediaAsset> {
	return uploadFile(file, folder, 'video');
}
