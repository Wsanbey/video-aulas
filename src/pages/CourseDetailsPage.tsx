"use client";

import React from 'react';
import { useParams } from 'react-router-dom';
import { courses } from '../data/courses';
import { AppHeader } from '../components/AppHeader';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlayCircle } from 'lucide-react';

const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courses.find((c) => c.id === courseId);

  const [selectedLesson, setSelectedLesson] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (course && course.lessons.length > 0 && !selectedLesson) {
      setSelectedLesson(course.lessons[0].id);
    }
  }, [course, selectedLesson]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Curso não encontrado.</p>
      </div>
    );
  }

  const currentLesson = course.lessons.find(
    (lesson) => lesson.id === selectedLesson
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
                {course.lessons.map((lesson) => (
                  <Button
                    key={lesson.id}
                    variant={selectedLesson === lesson.id ? "secondary" : "ghost"}
                    className="w-full justify-start mb-2 text-left"
                    onClick={() => setSelectedLesson(lesson.id)}
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
                    src={`https://www.youtube.com/embed/${currentLesson.youtubeVideoId}`}
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
                src={`https://www.youtube.com/embed/${currentLesson.youtubeVideoId}`}
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
          </>
        ) : (
          <p className="text-lg text-muted-foreground mb-6">Selecione uma aula para começar.</p>
        )}

        <h2 className="text-xl font-semibold mb-4">Aulas</h2>
        <ScrollArea className="flex-grow pr-4">
          <nav>
            {course.lessons.map((lesson) => (
              <Button
                key={lesson.id}
                variant={selectedLesson === lesson.id ? "secondary" : "ghost"}
                className="w-full justify-start mb-2 text-left"
                onClick={() => setSelectedLesson(lesson.id)}
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