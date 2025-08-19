export interface Lesson {
  id: string;
  title: string;
  youtubeVideoId: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export const courses: Course[] = [
  {
    id: "curso-react-iniciantes",
    title: "Curso de React para Iniciantes",
    description: "Aprenda os fundamentos do React do zero, construindo aplicações interativas.",
    lessons: [
      { id: "intro-react", title: "Introdução ao React", youtubeVideoId: "dQw4w9WgXcQ" }, // Replace with actual YouTube video IDs
      { id: "componentes", title: "Componentes e Props", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "estado-hooks", title: "Estado e Hooks", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "roteamento", title: "Roteamento com React Router", youtubeVideoId: "dQw4w9WgXcQ" },
    ],
  },
  {
    id: "curso-tailwind-css",
    title: "Dominando Tailwind CSS",
    description: "Crie interfaces modernas e responsivas rapidamente com Tailwind CSS.",
    lessons: [
      { id: "intro-tailwind", title: "O que é Tailwind CSS?", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "utilitarios", title: "Classes Utilitárias Essenciais", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "responsividade", title: "Design Responsivo", youtubeVideoId: "dQw4w9WgXcQ" },
    ],
  },
  {
    id: "curso-javascript-avancado",
    title: "JavaScript Avançado",
    description: "Aprofunde seus conhecimentos em JavaScript com tópicos avançados e padrões de projeto.",
    lessons: [
      { id: "async-await", title: "Async/Await e Promises", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "modulos", title: "Módulos ES6", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "padroes-projeto", title: "Padrões de Projeto", youtubeVideoId: "dQw4w9WgXcQ" },
    ],
  },
];