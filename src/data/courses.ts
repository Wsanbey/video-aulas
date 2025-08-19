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
    imageUrl: "/Curso 1.jpg", // Corrigido para o nome do arquivo real
    lessons: [
      { id: "intro-react", title: "Introdução ao React", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "componentes", title: "Componentes e Props", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "estado-hooks", title: "Estado e Hooks", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "roteamento", title: "Roteamento com React Router", youtubeVideoId: "dQw4w9WgXcQ" },
    ],
  },
  {
    id: "curso-tailwind-css",
    title: "Dominando Tailwind CSS",
    description: "Crie interfaces modernas e responsivas rapidamente com Tailwind CSS.",
    imageUrl: "/860ecbb367f74c09a15458babc5d9a0f701b26f074ce476382e07f14e442c4d8.jpg", // Corrigido para o nome do arquivo real
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
    imageUrl: "/a5517bdf1aaf4359b745ef38ca56fc1831aaef9b188a47c18358a3a557bbb5e8.jpg", // Corrigido para o nome do arquivo real
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
    imageUrl: "/a70e86ca6ae54deabdb1fa67fd0ecaac56c14a979a984325a0a6df4634efa819.jpg", // Corrigido para o nome do arquivo real
    lessons: [
      { id: "fundamentos-licitacoes", title: "Fundamentos das Licitações", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "modalidades-licitacao", title: "Modalidades de Licitação", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "documentacao-licitacao", title: "Documentação Necessária", youtubeVideoId: "dQw4w9WgXcQ" },
    ],
  },
];