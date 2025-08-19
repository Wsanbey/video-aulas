import React, { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (error) {
        showError('Erro ao carregar cursos: ' + error.message);
      } else {
        setCourses(data || []);
      }
      setIsLoading(false);
    };
    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Carregando cursos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-8 text-center">Nossos Cursos de YouTube</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {courses.length === 0 ? (
          <p className="text-lg text-muted-foreground col-span-full text-center">Nenhum curso disponível no momento.</p>
        ) : (
          courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={{ 
                id: course.id, 
                title: course.title, 
                description: course.description, 
                imageUrl: course.image_url, 
                lessons: [] // Lessons will be fetched on CourseDetailsPage
              }} 
            />
          ))
        )}
      </div>
      <div className="mt-auto pt-8">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default CoursesPage;