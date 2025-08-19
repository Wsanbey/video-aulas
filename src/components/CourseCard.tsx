import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Course } from '@/types/db';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  // Function to truncate description
  const truncateDescription = (text: string | null, maxLength: number) => {
    if (!text) return 'N/A';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription className="min-h-[48px]">
          {truncateDescription(course.description, 100)} {/* Truncar descrição aqui */}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {course.image_url && (
          <div className="mb-4">
            <img src={course.image_url} alt={course.title} className="w-full h-32 object-cover rounded-md" />
          </div>
        )}
      </CardContent>
      <div className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/courses/${course.id}`}>Ver Detalhes</Link>
        </Button>
      </div>
    </Card>
  );
};

export default CourseCard;