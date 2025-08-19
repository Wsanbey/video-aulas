import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8 px-4 mt-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">LGC Consultoria</h2>
            <p className="text-lg opacity-90 mb-4">
              Consultoria em licitações públicas
            </p>
            <p className="text-base opacity-80 mb-4">
              Fundada em 2017, nossa missão é ser a parceira estratégica das empresas em processos licitatórios, oferecendo soluções completas que maximizem as chances de sucesso.
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

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2">📧</span>
                <span>contato@licitacaogc.com.br</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📱</span>
                <span>(67) 99167-5629</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📋</span>
                <span>Formulário de Diagnóstico</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Diferenciais */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-foreground">+12 anos</p>
              <p className="text-sm opacity-80">de experiência no mercado</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-foreground">R$ 650M</p>
              <p className="text-sm opacity-80">em contratos conquistados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-foreground">1.200+</p>
              <p className="text-sm opacity-80">licitações bem-sucedidas</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-6 pt-6 text-center">
          <p className="opacity-80">
            &copy; {new Date().getFullYear()} LGC Consultoria. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;