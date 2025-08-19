export interface Lesson {
  id: string;
  title: string;
  youtubeVideoId: string;
  downloadFiles?: { name: string; url: string; }[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  lessons: Lesson[];
}

export const courses: Course[] = []; // Dados agora virão do Supabase