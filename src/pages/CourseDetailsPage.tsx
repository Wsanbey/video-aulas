import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Course, Lesson } from "@/types/db";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Download, FileText, Video } from "lucide-react";

const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const currentLesson = lessons?.[currentLessonIndex];

  if (courseLoading || lessonsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Carregando detalhes do curso...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Curso não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader title={course.title} showBackButton={true} />
      <main className="flex-grow flex flex-col items-center p-4 bg-pattern-dots">
        <div className="w-full max-w-4xl">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">
                  {lessons?.length || 0} aulas
                </Badge>
                <Badge variant="outline">
                  Ordem: {course.order || "Não definido"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Conteúdo do Curso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lessons?.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      index === currentLessonIndex
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setCurrentLessonIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {lesson.youtube_video_id ? (
                          <Video className="h-4 w-4 text-blue-500" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        <span className="font-medium">{lesson.title}</span>
                      </div>
                      {lesson.download_files && lesson.download_files.length > 0 && (
                        <Download className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    {lesson.description && (
                      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{lesson.description}</p>
                    )}
                    {lesson.download_files && lesson.download_files.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Arquivos para download:</h4>
                        <div className="space-y-2">
                          {lesson.download_files.map((file, fileIndex) => (
                            <div
                              key={fileIndex}
                              className="flex items-center justify-between p-2 bg-muted rounded"
                            >
                              <span className="text-sm">{file.name}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(file.url, "_blank");
                                }}
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Baixar
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CourseDetailsPage;