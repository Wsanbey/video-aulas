"use client";

import React from 'react';
import { useParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlayCircle, Download } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Course, Lesson } from "@/types/db";

const CourseDetailsPage: React.FC = () => {
  const { courseId, lessonId: urlLessonId } = useParams<{ courseId: string; lessonId?: string }>();

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
      const { data, error } = await supabase.from("lessons").select("*").eq("course_id", courseId).order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  const [selectedLessonId, setSelectedLessonId] = React.useState<string | null>(urlLessonId || null);

  React.useEffect(() => {
    if (lessons && lessons.length > 0 && !selectedLessonId) {
      setSelectedLessonId(lessons[0].id);
    }
  }, [lessons, selectedLessonId]);

  React.useEffect(() => {
    if (urlLessonId && urlLessonId !== selectedLessonId) {
      setSelectedLessonId(urlLessonId);
    }
  }, [urlLessonId, selectedLessonId]);

  if (isLoadingCourse || isLoadingLessons) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Carregando curso...</p>
      </div>
    );
  }

  if (courseError || lessonsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg text-destructive">Erro ao carregar o curso: {courseError?.message || lessonsError?.message}</p>
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

  const currentLesson = lessons?.find(
    (lesson) => lesson.id === selectedLessonId
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
      <AppHeader title={course.title} showBackButton={true} backPath="/" />

      {/* Layout para Desktop/Tablet (md e acima) */}
      <div className="hidden md:block flex-grow">
        <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border overflow-hidden">
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35} className="p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Aulas</h2>
            <ScrollArea className="flex-grow pr-4">
              <nav>
                {lessons?.map((lesson) => (
                  <Button
                    key={lesson.id}
                    variant={selectedLessonId === lesson.id ? "secondary" : "ghost"}
                    className="w-full justify-start mb-2 text-left"
                    onClick={() => setSelectedLessonId(lesson.id)}
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    {lesson.title}
                  </Button>
                ))}
              </nav>
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75} className="p-4 flex flex-col">
            {currentLesson ? (
              <>
                <h2 className="text-2xl font-bold mb-4">{currentLesson.title}</h2>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${currentLesson.youtube_video_id}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <Separator className="my-6" />
                <p className="text-lg text-muted-foreground">
                  Assista à aula para aprender mais sobre "{currentLesson.title}".
                </p>

                {currentLesson.download_files && currentLesson.download_files.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <h3 className="text-xl font-semibold mb-4">Materiais para Download</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentLesson.download_files.map((file, index) => (
                        <Button key={index} asChild variant="outline" className="justify-start">
                          <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" />
                            {file.name}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <p className="text-lg text-muted-foreground">Selecione uma aula para começar.</p>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Layout para Mobile (abaixo de md) */}
      <div className="md:hidden flex flex-col flex-grow">
        {currentLesson ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{currentLesson.title}</h2>
            <div className="relative w-full mb-4" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${currentLesson.youtube_video_id}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <Separator className="my-4" />
            <p className="text-lg text-muted-foreground mb-6">
              Assista à aula para aprender mais sobre "{currentLesson.title}".
            </p>

            {currentLesson.download_files && currentLesson.download_files.length > 0 && (
              <>
                <Separator className="my-4" />
                <h3 className="text-xl font-semibold mb-4">Materiais para Download</h3>
                <div className="flex flex-col gap-3 mb-6">
                  {currentLesson.download_files.map((file, index) => (
                    <Button key={index} asChild variant="outline" className="justify-start">
                      <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        {file.name}
                      </a>
                    </Button>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <p className="text-lg text-muted-foreground mb-6">Selecione uma aula para começar.</p>
        )}

        <h2 className="text-xl font-semibold mb-4">Aulas</h2>
        <ScrollArea className="flex-grow pr-4">
          <nav>
            {lessons?.map((lesson) => (
              <Button
                key={lesson.id}
                variant={selectedLessonId === lesson.id ? "secondary" : "ghost"}
                className="w-full justify-start mb-2 text-left"
                onClick={() => setSelectedLessonId(lesson.id)}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                {lesson.title}
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CourseDetailsPage;