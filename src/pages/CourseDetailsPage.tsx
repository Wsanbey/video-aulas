import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Course, Lesson } from "@/types/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";

const CourseDetailsPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();

  const { data: course, isLoading: isLoadingCourse, error: errorCourse } = useQuery<Course>({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").eq("id", courseId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  const { data: lessons, isLoading: isLoadingLessons, error: errorLessons } = useQuery<Lesson[]>({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      const { data, error } = await supabase.from("lessons").select("*").eq("course_id", courseId).order("order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  if (isLoadingCourse || isLoadingLessons) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
        <p className="text-lg">Carregando detalhes do curso...</p>
      </div>
    );
  }

  if (errorCourse || errorLessons) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
        <p className="text-lg text-destructive">
          Erro ao carregar: {errorCourse?.message || errorLessons?.message}
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
        <p className="text-lg">Curso não encontrado.</p>
      </div>
    );
  }

  const currentLesson = lessonId ? lessons?.find((l) => l.id === lessonId) : lessons?.[0];
  const currentLessonIndex = lessons?.findIndex((l) => l.id === currentLesson?.id);

  const previousLesson = currentLessonIndex !== undefined && currentLessonIndex > 0 ? lessons?.[currentLessonIndex - 1] : undefined;
  const nextLesson = currentLessonIndex !== undefined && currentLessonIndex < (lessons?.length || 0) - 1 ? lessons?.[currentLessonIndex + 1] : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
      <div className="w-full max-w-6xl mx-auto">
        <Link to="/courses" className="mb-4 inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Cursos
        </Link>

        <h1 className="text-3xl font-bold mb-6 text-center">{course.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {currentLesson ? (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-2xl">{currentLesson.title}</CardTitle>
                  {currentLesson.description && (
                    <CardDescription>{currentLesson.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {currentLesson.youtube_video_id && (
                    <div className="aspect-video w-full mb-4">
                      <iframe
                        className="w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${currentLesson.youtube_video_id}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                  {currentLesson.download_files && currentLesson.download_files.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Materiais para Download:</h3>
                      <ul className="list-disc pl-5">
                        {currentLesson.download_files.map((file: any, index: number) => (
                          <li key={index}>
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {file.name || `Arquivo ${index + 1}`}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-6">
                <CardContent className="p-6 text-center">
                  <p className="text-lg">Selecione uma aula na barra lateral para começar.</p>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {previousLesson && (
                <Link to={`/courses/${courseId}/lessons/${previousLesson.id}`}>
                  <Button variant="outline" className="bg-[#0B354E] hover:bg-[#0B354E]/90 text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Aula Anterior
                  </Button>
                </Link>
              )}
              {nextLesson && (
                <Link to={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                  <Button className="bg-[#0B354E] hover:bg-[#0B354E]/90 text-white">
                    Próxima Aula <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Aulas do Curso</CardTitle>
              </CardHeader>
              <CardContent>
                <nav>
                  <ul className="space-y-2">
                    {lessons?.map((lesson) => (
                      <li key={lesson.id}>
                        <Link
                          to={`/courses/${courseId}/lessons/${lesson.id}`}
                          className={`block p-3 rounded-md transition-colors ${
                            currentLesson?.id === lesson.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          {lesson.order}. {lesson.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CourseDetailsPage;