import React from "react";
import CourseCard from "@/components/CourseCard";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types/db";
import AppHeader from "@/components/AppHeader"; // Importar AppHeader

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
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Carregando cursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg text-destructive">Erro ao carregar cursos: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader title="" showBackButton={false} /> {/* Usando o AppHeader com o título padrão "LGC Cursos" */}
      <main className="flex-grow flex flex-col items-center p-4">
        <section className="w-full max-w-6xl bg-primary text-primary-foreground rounded-lg shadow-lg p-8 mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">LGC Cursos: Especialistas em Licitações</h1>
          <p className="text-lg md:text-xl opacity-90 mb-6">
            Capacite-se com os melhores cursos para dominar o universo das licitações públicas e impulsionar seus resultados.
          </p>
          {/* Adicionar um botão de CTA aqui se necessário */}
        </section>

        <h2 className="text-3xl font-bold mb-8 text-center">Nossos Cursos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {courses?.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </main>
      <div className="mt-auto pt-8">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default CoursesPage;