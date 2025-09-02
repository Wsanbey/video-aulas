import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types/db";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CoursesPage: React.FC = () => {
  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").order("order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <AppHeader title="Cursos" />
        <main className="flex-grow flex items-center justify-center p-4">
          <p className="text-lg">Carregando cursos...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <AppHeader title="Cursos" />
        <main className="flex-grow flex items-center justify-center p-4">
          <p className="text-lg text-destructive">Erro ao carregar cursos: {error.message}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader title="Cursos" />
      <main className="flex-grow flex flex-col items-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow flex flex-col">
              {course.image_url && (
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <CardHeader className="flex-grow">
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {course.description || "Nenhuma descrição disponível."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to={`/courses/${course.id}`}>
                  <Button className="w-full bg-[#0B354E] hover:bg-[#0B354E]/90 text-white">
                    Ver Curso
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursesPage;