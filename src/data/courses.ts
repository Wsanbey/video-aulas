export interface Lesson {
  id: string;
  title: string;
  youtubeVideoId: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // Adicionado imageUrl
  lessons: Lesson[];
}

export const courses: Course[] = [
  {
    id: "curso-react-iniciantes",
    title: "Curso de React para Iniciantes",
    description: "Aprenda os fundamentos do React do zero, construindo aplicações interativas.",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-cd36080ad1c9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Exemplo de imagem
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
    imageUrl: "https://images.unsplash.com/photo-1619410283975-6187b09e7c77?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Exemplo de imagem
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
    imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fdc8484?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Exemplo de imagem
    lessons: [
      { id: "async-await", title: "Async/Await e Promises", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "modulos", title: "Módulos ES6", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "padroes-projeto", title: "Padrões de Projeto", youtubeVideoId: "dQw4w9WgXcQ" },
    ],
  },
];