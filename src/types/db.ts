export type Course = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  order: number | null; // Adicionada a propriedade 'order'
  created_at: string;
  updated_at: string;
};

export type Lesson = {
  id: string;
  course_id: string;
  title: string;
  description: string | null; // Adicionada a propriedade description
  youtube_video_id: string;
  download_files: any; // JSONB type
  created_at: string;
  updated_at: string;
};