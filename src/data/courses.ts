export interface Lesson {
  id: string;
  title: string;
  youtubeVideoId: string;
  downloadFiles?: { name: string; url: string; }[]; // Nova propriedade para arquivos de download
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
    id: "licitacoes-mercado-publico",
    title: "Licitações - Domine o Mercado Público! 🚀",
    description: "Aprenda a vender para o governo e se destacar no mercado de licitações. Conquiste contratos públicos com segurança e eficiência!",
    imageUrl: "/Curso 1.jpg",
    lessons: [
      {
        id: "fundamentos-licitacoes",
        title: "Fundamentos das Licitações",
        youtubeVideoId: "dQw4w9WgXcQ",
        downloadFiles: [ // Arquivos de exemplo para download
          { name: "Guia Rápido de Licitações.pdf", url: "/downloads/guia_rapido_licitacoes.pdf" },
          { name: "Checklist Essencial.docx", url: "/downloads/checklist_essencial.docx" },
        ],
      },
      { id: "modalidades-licitacao", title: "Modalidades de Licitação", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "documentacao-licitacao", title: "Documentação Necessária", youtubeVideoId: "dQw4w9WgXcQ" },
    ],
  },
  {
    id: "integracao-executivos",
    title: "Integração de Executivos - Acesso Exclusivo🔑",
    description: "Área exclusiva para parceiros, com um guia completo para aproveitar a tecnologia da nossa assessoria. Domine o processo e potencialize suas oportunidades no mercado de licitações!",
    imageUrl: "/860ecbb367f74c09a15458babc5d9a0f701b26f074ce476382e07f14e442c4d8.jpg",
    lessons: [
      { id: "utilizar-flowl", title: "Como utilizar o Flowl e solicitar editais", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "envio-propostas", title: "Envio correto de propostas e documentos", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "ferramentas-estrategicas", title: "Melhor uso das ferramentas estratégicas", youtubeVideoId: "dQw4w9WgXcQ" },
    ],
  },
  {
    id: "automacao-tecnologia",
    title: "📡 Automação e Uso de Tecnologia",
    description: "Descubra como a IA e a automação podem transformar sua participação em licitações. Torne sua empresa mais eficiente e competitiva!",
    imageUrl: "/a5517bdf1aaf4359b745ef38ca56fc1831aaef9b188a47c18358a3a557bbb5e8.jpg",
    lessons: [
      { id: "ia-automacao", title: "IA e Automação em Licitações", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "softwares-analise", title: "Softwares para Análise de Concorrência", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "otimizacao-processos", title: "Otimização de Processos Internos", youtubeVideoId: "dQw4w9WgXcQ" },
    ],
  },
  {
    id: "formacao-estrategia-licitacoes",
    title: "📌 Formação e Estratégia em Licitações Públicas",
    description: "Curso avançado para especialistas em licitações. Domine estratégias para vencer certames e atuar com segurança no mercado público.",
    imageUrl: "/a70e86ca6ae54deabdb1fa67fd0ecaac56c14a979a984325a0a6df4634efa819.jpg",
    lessons: [
      { id: "lei-14133", title: "Análise da Lei 14.133/21", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "reduzir-riscos", title: "Estratégias para Reduzir Riscos", youtubeVideoId: "dQw4w9WgXcQ" },
      { id: "setor-licitacoes", title: "Como Estruturar um Setor de Licitações", youtubeVideoId: "dQw4w9WgXcQ" },
    ],
  },
];