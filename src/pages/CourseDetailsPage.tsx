import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Course, Lesson } from "@/types/db";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const CourseDetailsPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const navigate = useNavigate();

  const { data: course, isLoading: isLoadingCourse, error: courseError } = useQuery<Course>({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").eq("id", courseId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  const { data: lessons, isLoading: isLoadingLessons, error: lessonsError } = useQuery<Lesson[]>({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      const { data, error } = await supabase.from("lessons").select("*").eq("course_id", courseId).order("order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);

  useEffect(() => {
    if (lessons && lessonId) {
      const index = lessons.findIndex((lesson) => lesson.id === lessonId);
      if (index !== -1) {
        setCurrentLessonIndex(index);
      } else {
        // If lessonId is invalid, navigate to the first lesson
        navigate(`/courses/${courseId}/lessons/${lessons[0].id}`, { replace: true });
      }
    } else if (lessons && lessons.length > 0 && !lessonId) {
      // If no lessonId in URL, navigate to the first lesson
      navigate(`/courses/${courseId}/lessons/${lessons[0].id}`, { replace: true });
    }
  }, [lessons, lessonId, courseId, navigate]);

  if (isLoadingCourse || isLoadingLessons) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
        <AppHeader title="Detalhes do Curso" showBackButton={true} backPath="/" />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lg">Carregando detalhes do curso...</p>
        </div>
      </div>
    );
  }

  if (courseError || lessonsError) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
        <AppHeader title="Detalhes do Curso" showBackButton={true} backPath="/" />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lg text-destructive">
            Erro ao carregar: {courseError?.message || lessonsError?.message}
          </p>
        </div>
      </div>
    );
  }

  if (!course || !lessons || lessons.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
        <AppHeader title="Detalhes do Curso" showBackButton={true} backPath="/" />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lg">Nenhum curso ou lição encontrada.</p>
        </div>
      </div>
    );
  }

  const currentLesson = lessons[currentLessonIndex];
  const hasPrevious = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < lessons.length - 1;

  const goToPreviousLesson = () => {
    if (hasPrevious) {
      const newIndex = currentLessonIndex - 1;
      navigate(`/courses/${courseId}/lessons/${lessons[newIndex].id}`);
    }
  };

  const goToNextLesson = () => {
    if (hasNext) {
      const newIndex = currentLessonIndex + 1;
      navigate(`/courses/${courseId}/lessons/${lessons[newIndex].id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader title={course.title} showBackButton={true} backPath={`/courses/${courseId}`} />
      <main className="flex-grow flex flex-col lg:flex-row p-4 gap-6 max-w-7xl mx-auto w-full">
        {/* Main Content Area */}
        <div className="flex-1 lg:order-2">
          {currentLesson.youtube_video_id && (
            <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
              <AspectRatio ratio={16 / 9}>
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${currentLesson.youtube_video_id}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </AspectRatio>
            </div>
          )}

          <h2 className="text-3xl font-bold mb-4">{currentLesson.title}</h2>
          {currentLesson.description && (
            <p className="text-foreground mb-4 whitespace-pre-wrap">{currentLesson.description}</p>
          )}
          {currentLesson.download_files && currentLesson.download_files.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Materiais para Download:</h3>
              <div className="space-y-2">
                {currentLesson.download_files.map((file: any, index: number) => (
                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <Download className="h-5 w-5" />
                    {file.name || `Arquivo ${index + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-4 border-t border-border">
            <Button onClick={goToPreviousLesson} disabled={!hasPrevious} variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
            </Button>
            <Button onClick={goToNextLesson} disabled={!hasNext} variant="outline">
              Próxima <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar for Lessons List */}
        <aside className="w-full lg:w-80 lg:order-1 bg-card p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Aulas do Curso</h3>
          <nav>
            <ul className="space-y-2">
              {lessons.map((lesson, index) => (
                <li key={lesson.id}>
                  <Button
                    variant={lesson.id === currentLesson.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.id}`)}
                  >
                    <span className="mr-2 text-sm opacity-70">{index + 1}.</span>
                    <span className="flex-1 text-base">{lesson.title}</span>
                  </Button>
                  {index < lessons.length - 1 && <Separator className="my-1" />}
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </main>
    </div>
  );
};

export default CourseDetailsPage;