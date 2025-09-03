import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Course, Lesson } from '@/types/db';
import { Youtube, Download, Menu, ArrowLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';

const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: course, isLoading: isLoadingCourse, error: courseError } = useQuery<Course>({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase.from('courses').select('*').eq('id', courseId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  const { data: lessons, isLoading: isLoadingLessons, error: lessonsError } = useQuery<Lesson[]>({
    queryKey: ['lessons', courseId],
    queryFn: async () => {
      const { data, error } = await supabase.from('lessons').select('*').eq('course_id', courseId).order('order', { ascending: true }).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  useEffect(() => {
    if (lessons && lessons.length > 0 && !currentLesson) {
      setCurrentLesson(lessons[0]);
    }
  }, [lessons, currentLesson]);

  if (isLoadingCourse || isLoadingLessons) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Carregando detalhes do curso...</p>
      </div>
    );
  }

  if (courseError || lessonsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg text-destructive">
          Erro ao carregar: {courseError?.message || lessonsError?.message}
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
        <div className="flex items-center justify-between p-4 bg-background text-foreground border-b border-border mb-4 shadow-sm">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="ghost" size="icon" className="mr-2 hidden">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Detalhes do Curso</h1>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Curso não encontrado.</p>
        </div>
      </div>
    );
  }

  const renderLessonContent = () => (
    <>
      {currentLesson ? (
        <>
          {currentLesson.youtube_video_id && (
            <div className="relative w-full pt-[56.25%] mb-4 rounded-lg overflow-hidden">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${currentLesson.youtube_video_id}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          )}
          <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
          {currentLesson.description && (
            <p className="text-muted-foreground mb-4 whitespace-pre-wrap">{currentLesson.description}</p>
          )}
          {currentLesson.download_files && currentLesson.download_files.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Arquivos para Download</h3>
              <div className="space-y-2">
                {currentLesson.download_files.map((file: { name: string; url: string }, index: number) => (
                  <Button
                    key={index}
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {file.name}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Selecione uma aula para começar.</p>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
      <div className="flex items-center justify-between p-4 bg-background text-foreground border-b border-border mb-4 shadow-sm">
        <div className="flex items-center">
          <Link to="/courses">
            <Button variant="ghost" size="icon" className="mr-2 hidden">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{course.title}</h1>
        </div>
        {isMobile && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="border border-border"> {/* Adicionado 'border border-border' aqui */}
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] p-4 overflow-y-auto">
              <SheetTitle>Aulas</SheetTitle>
              <SheetDescription>Selecione uma aula para visualizar o conteúdo.</SheetDescription>
              <nav className="space-y-2 mt-4">
                {lessons && lessons.length > 0 ? (
                  lessons.map((lesson) => (
                    <Button
                      key={lesson.id}
                      variant={currentLesson?.id === lesson.id ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => {
                        setCurrentLesson(lesson);
                        setIsSheetOpen(false);
                      }}
                    >
                      {lesson.title}
                    </Button>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhuma aula disponível.</p>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
      <div className="flex-grow flex flex-col items-center w-full max-w-6xl mx-auto">
        {isMobile ? (
          <div className="flex-grow w-full flex flex-col overflow-y-auto rounded-lg border p-4">
            {renderLessonContent()}
          </div>
        ) : (
          <ResizablePanelGroup
            direction="horizontal"
            className="w-full flex-grow rounded-lg border"
          >
            <ResizablePanel defaultSize={25} minSize={20} className="p-4 overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">Aulas</h3>
              <nav className="space-y-2">
                {lessons && lessons.length > 0 ? (
                  lessons.map((lesson) => (
                    <Button
                      key={lesson.id}
                      variant={currentLesson?.id === lesson.id ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setCurrentLesson(lesson)}
                    >
                      {lesson.title}
                    </Button>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhuma aula disponível para este curso.</p>
                )}
              </nav>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75} className="p-4 flex flex-col overflow-y-auto">
              {renderLessonContent()}
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsPage;