import type { Exercise } from '@/lib/types';

/** Extract a YouTube video ID from common URL shapes. */
export function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  return m ? m[1] : null;
}

/** Real video thumbnail for an exercise: YouTube thumb, else its local image. */
export function exerciseThumbnail(ex: Exercise): string | null {
  const urls = [ex.videoUrl, ...(ex.videoSources?.map(s => s.url) ?? [])].filter(Boolean) as string[];
  for (const u of urls) {
    const id = youtubeId(u);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return ex.image ?? null;
}
