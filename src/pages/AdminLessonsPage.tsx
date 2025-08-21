import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Course, Lesson } from "@/types/db";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Upload, Video, File } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminLessonsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtube_video_id: "",
    download_files: [] as any[],
    order: "",
  });

  const queryClient = useQueryClient();

  const { data: course, isLoading: isLoadingCourse } = useQuery<Course>({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").eq("id", courseId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  const { data: lessons, isLoading: isLoadingLessons } = useQuery<Lesson[]>({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      const { data, error } = await supabase.from("lessons").select("*").eq("course_id", courseId).order("order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  const createLessonMutation = useMutation({
    mutationFn: async (newLesson: Omit<Lesson, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase.from("lessons").insert(newLesson).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", courseId] });
      setIsCreateDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        youtube_video_id: "",
        download_files: [],
        order: "",
      });
    },
  });

  const updateLessonMutation = useMutation({
    mutationFn: async (updatedLesson: Partial<Lesson>) => {
      const { data, error } = await supabase
        .from("lessons")
        .update(updatedLesson)
        .eq("id", selectedLesson?.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", courseId] });
      setIsEditDialogOpen(false);
      setSelectedLesson(null);
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", courseId] });
    },
  });

  const handleCreateLesson = () => {
    createLessonMutation.mutate({
      title: formData.title,
      description: formData.description,
      youtube_video_id: formData.youtube_video_id,
      download_files: formData.download_files,
      order: parseInt(formData.order) || 0,
      course_id: courseId!,
    });
  };

  const handleEditLesson = () => {
    if (selectedLesson) {
      updateLessonMutation.mutate({
        title: formData.title,
        description: formData.description,
        youtube_video_id: formData.youtube_video_id,
        download_files: formData.download_files,
        order: parseInt(formData.order) || 0,
      });
    }
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta aula?")) {
      deleteLessonMutation.mutate(lessonId);
    }
  };

  const openEditDialog = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description || "",
      youtube_video_id: lesson.youtube_video_id || "",
      download_files: lesson.download_files || [],
      order: lesson.order?.toString() || "",
    });
    setIsEditDialogOpen(true);
  };

  if (isLoadingCourse || isLoadingLessons) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
        <AppHeader title={`Gerenciar Aulas do Curso ${courseId}`} showBackButton={true} backPath="/admin/courses" />
        <div className="flex-grow flex flex-col items-center justify-center">
          <p className="text-lg">Carregando aulas...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
        <AppHeader title={`Gerenciar Aulas do Curso ${courseId}`} showBackButton={true} backPath="/admin/courses" />
        <div className="flex-grow flex flex-col items-center justify-center">
          <p className="text-lg text-destructive">Curso não encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
      <AppHeader title={`Gerenciar Aulas do Curso ${course.title}`} showBackButton={true} backPath="/admin/courses" />
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Gerenciar Aulas</h2>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Nova Aula
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Nova Aula</DialogTitle>
                  <DialogDescription>Crie uma nova aula para o curso.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Título
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Descrição
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="youtube_video_id" className="text-right">
                      ID do YouTube
                    </Label>
                    <Input
                      id="youtube_video_id"
                      value={formData.youtube_video_id}
                      onChange={(e) => setFormData({ ...formData, youtube_video_id: e.target.value })}
                      className="col-span-3"
                      placeholder="Ex: dQw4w9WgXcQ"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="order" className="text-right">
                      Ordem
                    </Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateLesson} disabled={createLessonMutation.isPending}>
                    {createLessonMutation.isPending ? "Criando..." : "Criar Aula"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons?.map((lesson) => (
              <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      <CardDescription>Ordem: {lesson.order || 0}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(lesson)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLesson(lesson.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {lesson.youtube_video_id && (
                    <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      <Video className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  {lesson.download_files && lesson.download_files.length > 0 && (
                    <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      <File className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mb-4">
                    {lesson.description || "Sem descrição"}
                  </p>
                  <Button variant="outline" className="w-full">
                    Visualizar Aula
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Aula</DialogTitle>
            <DialogDescription>Edite as informações da aula.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Título
              </Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-youtube_video_id" className="text-right">
                ID do YouTube
              </Label>
              <Input
                id="edit-youtube_video_id"
                value={formData.youtube_video_id}
                onChange={(e) => setFormData({ ...formData, youtube_video_id: e.target.value })}
                className="col-span-3"
                placeholder="Ex: dQw4w9WgXcQ"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-order" className="text-right">
                Ordem
              </Label>
              <Input
                id="edit-order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditLesson} disabled={updateLessonMutation.isPending}>
              {updateLessonMutation.isPending ? "Atualizando..." : "Atualizar Aula"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLessonsPage;