import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8 px-4 mt-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">LGC Cursos</h2>
            <p className="text-lg opacity-90 mb-4">
              Especialistas em licitações públicas. Capacite-se com os melhores cursos e recursos para o seu sucesso profissional.
            </p>
            <div className="flex space-x-4">
              {/* Adicionar ícones de redes sociais aqui, se desejar */}
              {/* <a href="#" className="hover:opacity-80 transition-opacity">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Linkedin className="h-6 w-6" />
              </a> */}
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:underline transition-colors">Início</Link>
              </li>
              <li>
                <Link to="/cursos" className="hover:underline transition-colors">Nossos Cursos</Link>
              </li>
              <li>
                <Link to="/sobre" className="hover:underline transition-colors">Sobre Nós</Link>
              </li>
              <li>
                <Link to="/contato" className="hover:underline transition-colors">Contato</Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2">📧</span>
                <span>contato@lgccursos.com.br</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📱</span>
                <span>(11) 1234-5678</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📍</span>
                <span>São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center">
          <p className="opacity-80">
            &copy; {new Date().getFullYear()} LGC Cursos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;