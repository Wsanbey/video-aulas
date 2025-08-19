export interface Lesson {
  id: string;
  title: string;
  youtubeVideoId: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  lessons: Lesson[];
}

export const courses: Course[] = [
  {
    id: "curso-react-iniciantes",
    title: "Curso de React para Iniciantes",
    description: "Aprenda os fundamentos do React do zero, construindo aplicações interativas.",
    imageUrl: "/pasted-image-2025-08-19T05-44-12-016Z-1.jpeg", // Nova imagem
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
    imageUrl: "/pasted-image-2025-08-19T05-44-12-016Z-2.jpeg", // Nova imagem
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
    imageUrl: "/pasted-image-2025-08-19T05-44-12-016Z-3.jpeg", // Nova imagem
    lessons: [
      { id: "async-await", title: "Async/Await e Promises", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "modulos", title: "Módulos ES6", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "padroes-projeto", title: "Padrões de Projeto", youtubeVideoId: "dQw4w9WgXcQ" },
    ],
  },
  {
    id: "curso-licitacoes",
    title: "Curso de Licitações",
    description: "Aprenda tudo sobre licitações públicas e como participar de processos licitatórios.",
    imageUrl: "/pasted-image-2025-08-19T05-44-12-016Z-4.jpeg", // Nova imagem
    lessons: [
      { id: "fundamentos-licitacoes", title: "Fundamentos das Licitações", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "modalidades-licitacao", title: "Modalidades de Licitação", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "documentacao-licitacao", title: "Documentação Necessária", youtubeVideoId: "dQw4w9WgXcQ" },
    ],
  },
];