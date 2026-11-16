import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
        <p className="text-xl text-gray-500 mb-8">Página não encontrada</p>
        <Link
          to="/admin"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Voltar ao painel inicial
        </Link>
      </div>
    </div>
  );
}
