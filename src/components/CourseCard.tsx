import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@/data/courses";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const firstLessonPath = course.lessons.length > 0 
    ? `/courses/${course.id}/${course.lessons[0].id}` 
    : `/courses/${course.id}`; // Fallback if no lessons

  return (
    <Card className="w-full max-w-sm mx-auto flex flex-col">
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription className="min-h-[48px]">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-end justify-center">
        <Link to={firstLessonPath}>
          <Button>Ver Curso</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CourseCard;