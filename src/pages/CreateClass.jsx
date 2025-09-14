import { useState } from "react";
import { createClass } from "../firebase/class";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const CreateClass = () => {
  const [name, setName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("O nome da turma é obrigatório.");
      return;
    }

    try {
      setLoading(true);
      await createClass(name, year);
      toast.success("Turma criada com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar turma.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-2 w-full">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-primary mb-5">Cadastrar Turma</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Turma
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: Turma I"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ano Letivo
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              min="2000"
              max="2100"
            />
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 w-full cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-900 disabled:opacity-50 w-full cursor-pointer"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
