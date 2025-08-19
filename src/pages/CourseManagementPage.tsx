"use client";

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { PlusCircle, Edit, Trash2, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

const CourseManagementPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [form, setForm] = useState({ title: '', description: '', image_url: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (error) {
      showError('Erro ao carregar cursos: ' + error.message);
    } else {
      setCourses(data || []);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSaveCourse = async () => {
    if (!form.title) {
      showError('O título do curso é obrigatório.');
      return;
    }

    if (currentCourse) {
      // Update existing course
      const { error } = await supabase
        .from('courses')
        .update(form)
        .eq('id', currentCourse.id);
      if (error) {
        showError('Erro ao atualizar curso: ' + error.message);
      } else {
        showSuccess('Curso atualizado com sucesso!');
        fetchCourses();
        setIsDialogOpen(false);
      }
    } else {
      // Add new course
      const { error } = await supabase
        .from('courses')
        .insert(form);
      if (error) {
        showError('Erro ao adicionar curso: ' + error.message);
      } else {
        showSuccess('Curso adicionado com sucesso!');
        fetchCourses();
        setIsDialogOpen(false);
      }
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este curso e todas as suas aulas?')) {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      if (error) {
        showError('Erro ao excluir curso: ' + error.message);
      } else {
        showSuccess('Curso excluído com sucesso!');
        fetchCourses();
      }
    }
  };

  const openAddDialog = () => {
    setCurrentCourse(null);
    setForm({ title: '', description: '', image_url: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (course: Course) => {
    setCurrentCourse(course);
    setForm({ title: course.title, description: course.description, image_url: course.image_url });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
      <AppHeader title="Gerenciar Cursos" showBackButton={true} backPath="/admin" />

      <div className="flex-grow container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Lista de Cursos</h2>
          <Button onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Curso
          </Button>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Imagem URL</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    Nenhum curso encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell className="text-muted-foreground">{course.description}</TableCell>
                    <TableCell className="text-muted-foreground truncate max-w-[200px]">{course.image_url}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/admin/courses/${course.id}/lessons`}>
                          <Button variant="outline" size="sm" title="Gerenciar Aulas">
                            <BookOpen className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(course)} title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteCourse(course.id)} title="Excluir">
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentCourse ? 'Editar Curso' : 'Adicionar Novo Curso'}</DialogTitle>
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
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image_url" className="text-right">
                URL da Imagem
              </Label>
              <Input
                id="image_url"
                name="image_url"
                value={form.image_url}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveCourse}>
              {currentCourse ? 'Salvar Alterações' : 'Adicionar Curso'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseManagementPage;