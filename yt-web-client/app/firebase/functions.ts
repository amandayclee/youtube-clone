import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

const generateUploadUrlFunction = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos');
const makeThumbnailPublicFunction = httpsCallable(functions, 'makeThumbnailPublic');

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed',
  title?: string,
  description?: string,
  thumbnailUrl?: string
}

export async function uploadVideo(file: File, thumbnail: File, title: string, description: string) {
  const response: any = await generateUploadUrlFunction({
    fileExtension: file.name.split('.').pop(),
    title,
    description
  });

  // Upload the file to the signed URL
  await fetch(response?.data?.url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  await fetch(response?.data?.thumbnailUrl, {
    method: 'PUT',
    body: thumbnail,
    headers: {
      'Content-Type': thumbnail.type,
    },
  });

  await makeThumbnailPublicFunction({ thumbnailFileName: response.data.thumbnailFileName });

  return response.data;
}

export async function getVideos() {
  const response: any = await getVideosFunction();
  return (response.data as any[]).map(video => ({
    id: video.id,
    uid: video.uid,
    filename: video.filename,
    status: video.status,
    title: video.title || 'Untitled Video',
    description: video.description || 'No description',
    thumbnailUrl: video.thumbnailUrl
  })) as Video[];
}