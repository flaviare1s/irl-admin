export const Unauthorized = () => {
  return (
    <div className="h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-primary mb-4">401</h1>
        <p className="text-2xl font-medium text-gray-700 mb-4">
          Você não tem permissão para acessar esta página.
        </p>
        <p className="text-lg text-gray-600">
          Volte para a página inicial e tente novamente.
        </p>
        <a
          href="/"
          className="mt-6 font-bold inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition duration-300 hover:bg-white hover:text-primary border border-primary"
        >
          Voltar para a página inicial
        </a>
      </div>
    </div>
  );
};
