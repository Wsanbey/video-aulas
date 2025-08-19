import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    imageUrl: string; // Adicionando imageUrl à interface
    lessons: { id: string; title: string; youtubeVideoId: string }[];
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card className="w-full max-w-sm mx-auto flex flex-col">
      {course.imageUrl && (
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription className="min-h-[48px]">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{course.lessons.length} aulas</p>
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