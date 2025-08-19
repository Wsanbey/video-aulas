import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/db"; // Importando a nova interface

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card className="w-full max-w-sm mx-auto flex flex-col">
      {course.image_url && (
        <img
          src={course.image_url}
          alt={course.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription className="min-h-[48px]">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* A contagem de aulas será feita na página de detalhes ou em um componente separado se necessário */}
        <p className="text-sm text-muted-foreground">Ver aulas</p>
      </CardContent>
      <CardFooter>
        <Link to={`/courses/${course.id}`}>
          <Button className="w-full">Ver Curso</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;