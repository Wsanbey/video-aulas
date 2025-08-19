import React from "react";
import { Link, useParams } from "react-router-dom";
import { Course } from "@/data/courses";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CourseSidebarProps {
  course: Course;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ course }) => {
  const { lessonId } = useParams<{ lessonId: string }>();

  return (
    <ScrollArea className="h-full w-full pr-4">
      <h2 className="text-xl font-semibold mb-4 px-2">{course.title}</h2>
      <nav className="space-y-2">
        {course.lessons.map((lesson) => (
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