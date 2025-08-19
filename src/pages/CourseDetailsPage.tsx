import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courses } from "@/data/courses";
import LessonPlayer from "@/components/LessonPlayer";
import CourseSidebar from "@/components/CourseSidebar";
import AppHeader from "@/components/AppHeader"; // Importando o novo componente
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showError } from "@/utils/toast";

const CourseDetailsPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();

  const course = courses.find((c) => c.id === courseId);

  useEffect(() => {
    if (!course) {
      showError("Curso não encontrado.");
      navigate("/courses");
      return;
    }

    if (!lessonId && course.lessons.length > 0) {
      // Redirect to the first lesson if no lessonId is provided
      navigate(`/courses/${course.id}/${course.lessons[0].id}`, { replace: true });
    } else if (lessonId && !course.lessons.find(l => l.id === lessonId)) {
      showError("Aula não encontrada neste curso.");
      navigate(`/courses/${course.id}/${course.lessons[0].id}`, { replace: true });
    }
  }, [course, lessonId, navigate]);

  if (!course) {
    return null; // Or a loading spinner/error message
  }

  const currentLesson = lessonId 
    ? course.lessons.find((l) => l.id === lessonId) 
    : course.lessons[0];

  if (!currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Nenhuma aula encontrada para este curso.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
      <AppHeader title={course.title} showBackButton={true} backPath="/courses" /> {/* Adicionando o cabeçalho */}
      <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35} className="p-4">
          <CourseSidebar course={course} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} className="p-4 flex flex-col">
          <h2 className="text-3xl font-bold mb-4">{currentLesson.title}</h2> {/* Alterado para h2 */}
          <div className="flex-grow flex items-center justify-center">
            <LessonPlayer 
              key={currentLesson.id} 
              videoId={currentLesson.youtubeVideoId} 
              title={currentLesson.title} 
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <div className="mt-auto pt-4">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default CourseDetailsPage;