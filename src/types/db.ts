export interface Course {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  youtube_video_id: string;
  download_files: { name: string; url: string; }[] | null;
  created_at: string;
  updated_at: string;
}