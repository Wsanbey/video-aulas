import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/components/SessionContextProvider"; // Importar useSession

const Index = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      if (session) {
        navigate("/courses", { replace: true }); // Redireciona para cursos se autenticado
      } else {
        navigate("/courses", { replace: true }); // Redireciona para cursos se não autenticado (pode ser ajustado para /login se quiser forçar login)
      }
    }
  }, [navigate, session, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Carregando...</h1>
        <p className="text-xl text-gray-600">
          Você será redirecionado em breve.
        </p>
      </div>
    </div>
  );
};

export default Index;