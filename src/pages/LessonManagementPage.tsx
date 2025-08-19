"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { PlusCircle, Edit, Trash2, Download } from 'lucide-react';

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  youtube_video_id: string;
  download_files: { name: string; url: string; }[];
}

const LessonManagementPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseTitle, setCourseTitle] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [form, setForm] = useState({ title: '', youtube_video_id: '', download_files_text: '' });

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
      fetchLessons();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    const { data, error } = await supabase.from('courses').select('title').eq('id', courseId).single();
    if (error) {
      showError('Erro ao carregar detalhes do curso: ' + error.message);
    } else if (data) {
      setCourseTitle(data.title);
    }
  };

  const fetchLessons = async () => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });
    if (error) {
      showError('Erro ao carregar aulas: ' + error.message);
    } else {
      setLessons(data || []);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const parseDownloadFiles = (text: string): { name: string; url: string; }[] => {
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Erro ao analisar JSON de arquivos de download:", e);
      return [];
    }
  };

  const stringifyDownloadFiles = (files: { name: string; url: string; }[]): string => {
    return JSON.stringify(files, null, 2);
  };

  const handleSaveLesson = async () => {
    if (!form.title || !form.youtube_video_id) {
      showError('Título e ID do vídeo do YouTube são obrigatórios.');
      return;
    }

    const downloadFiles = parseDownloadFiles(form.download_files_text);

    const lessonData = {
      course_id: courseId,
      title: form.title,
      youtube_video_id: form.youtube_video_id,
      download_files: downloadFiles,
    };

    if (currentLesson) {
      // Update existing lesson
      const { error } = await supabase
        .from('lessons')
        .update(lessonData)
        .eq('id', currentLesson.id);
      if (error) {
        showError('Erro ao atualizar aula: ' + error.message);
      } else {
        showSuccess('Aula atualizada com sucesso!');
        fetchLessons();
        setIsDialogOpen(false);
      }
    } else {
      // Add new lesson
      const { error } = await supabase
        .from('lessons')
        .insert(lessonData);
      if (error) {
        showError('Erro ao adicionar aula: ' + error.message);
      } else {
        showSuccess('Aula adicionada com sucesso!');
        fetchLessons();
        setIsDialogOpen(false);
      }
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta aula?')) {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);
      if (error) {
        showError('Erro ao excluir aula: ' + error.message);
      } else {
        showSuccess('Aula excluída com sucesso!');
        fetchLessons();
      }
    }
  };

  const openAddDialog = () => {
    setCurrentLesson(null);
    setForm({ title: '', youtube_video_id: '', download_files_text: '[]' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setForm({
      title: lesson.title,
      youtube_video_id: lesson.youtube_video_id,
      download_files_text: stringifyDownloadFiles(lesson.download_files || []),
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
      <AppHeader title={`Aulas de: ${courseTitle}`} showBackButton={true} backPath="/admin/courses" />

      <div className="flex-grow container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Lista de Aulas</h2>
          <Button onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Aula
          </Button>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>ID do Vídeo</TableHead>
                <TableHead>Arquivos de Download</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    Nenhuma aula encontrada para este curso.
                  </TableCell>
                </TableRow>
              ) : (
                lessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell className="text-muted-foreground">{lesson.youtube_video_id}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {lesson.download_files && lesson.download_files.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {lesson.download_files.map((file, idx) => (
                            <li key={idx} className="flex items-center">
                              <Download className="h-3 w-3 mr-1" />
                              <a href={file.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {file.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        'Nenhum arquivo'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(lesson)} title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteLesson(lesson.id)} title="Excluir">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentLesson ? 'Editar Aula' : 'Adicionar Nova Aula'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="youtube_video_id" className="text-right">
                ID do Vídeo YouTube
              </Label>
              <Input
                id="youtube_video_id"
                name="youtube_video_id"
                value={form.youtube_video_id}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="download_files_text" className="text-right pt-2">
                Arquivos de Download (JSON)
              </Label>
              <Textarea
                id="download_files_text"
                name="download_files_text"
                value={form.download_files_text}
                onChange={handleInputChange}
                placeholder='Ex: [{"name": "Guia.pdf", "url": "/downloads/guia.pdf"}]'
                className="col-span-3 min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveLesson}>
              {currentLesson ? 'Salvar Alterações' : 'Adicionar Aula'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LessonManagementPage;