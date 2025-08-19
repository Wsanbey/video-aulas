import React from "react";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/data/courses";
import { MadeWithDyad } from "@/components/made-with-dyad";

const CoursesPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-8 text-center">Nossos Cursos de YouTube</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      <div className="mt-auto pt-8">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default CoursesPage;