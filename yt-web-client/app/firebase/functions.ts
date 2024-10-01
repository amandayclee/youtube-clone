import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

const generateUploadUrlFunction = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos');

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed',
  title?: string,
  description?: string  
}

export async function uploadVideo(file: File, title: string, description: string) {
  const response: any = await generateUploadUrlFunction({
    fileExtension: file.name.split('.').pop(),
    title,
    description
  });

  // Upload the file to the signed URL
  const uploadResult = await fetch(response?.data?.url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  return uploadResult;
}

export async function getVideos() {
  const response: any = await getVideosFunction();
  return (response.data as any[]).map(video => ({
    id: video.id,
    uid: video.uid,
    filename: video.filename,
    status: video.status,
    title: video.title || 'Untitled Video',
    description: video.description || 'No description'
  })) as Video[];
}