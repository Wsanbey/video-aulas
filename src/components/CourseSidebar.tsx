import React from "react";
import { Link, useParams } from "react-router-dom";
import { Course, Lesson } from "@/types/db"; // Importando a nova interface
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CourseSidebarProps {
  course: Course;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ course }) => {
  const { lessonId } = useParams<{ lessonId: string }>();

  const { data: lessons, isLoading, error } = useQuery<Lesson[]>({
    queryKey: ["lessons", course.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("lessons").select("*").eq("course_id", course.id).order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!course.id,
  });

  if (isLoading) {
    return <div className="px-2 text-muted-foreground">Carregando aulas...</div>;
  }

  if (error) {
    return <div className="px-2 text-destructive">Erro ao carregar aulas: {error.message}</div>;
  }

  return (
    <ScrollArea className="h-full w-full pr-4">
      <h2 className="text-xl font-semibold mb-4 px-2">{course.title}</h2>
      <nav className="space-y-2">
        {lessons?.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/courses/${course.id}/${lesson.id}`}
            className={cn(
              "flex items-center p-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              lesson.id === lessonId
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            )}
          >
            {lesson.title}
          </Link>
        ))}
      </nav>
    </ScrollArea>
  );
};

export default CourseSidebar;