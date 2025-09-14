import { useState } from "react";
import { deleteClass } from "../firebase/class";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const EditClass = ({ classData, onSave, onCancel }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editData, setEditData] = useState({
    name: classData.name,
    responsible: classData.responsible,
    year: classData.year,
    status: classData.status
  });

  const handleSave = () => {
    onSave(editData);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteClass(classData.id);
      toast.success("Turma removida com sucesso!");
      navigate('/dashboard');
    } catch (error) {
      console.error("Erro ao remover turma:", error);
      toast.error("Erro ao remover turma");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000ca] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          {showDeleteConfirm ? (
            <div className="text-center">
              <div className="mb-4">
                <Trash2 className="mx-auto h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Confirmar Remoção
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Tem certeza que deseja remover a turma{" "}
                <span className="font-medium">{classData.name}</span>? Esta ação
                não pode ser desfeita e removerá todos os dados de estudantes e frequência.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isDeleting ? "Removendo..." : "Remover"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Editar Informações da Turma
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Turma
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome da turma"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsável
                  </label>
                  <input
                    type="text"
                    value={editData.responsible}
                    onChange={(e) => setEditData({ ...editData, responsible: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome do responsável"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ano
                  </label>
                  <input
                    type="number"
                    value={editData.year}
                    onChange={(e) => setEditData({ ...editData, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="2020"
                    max="2030"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Ativa</option>
                    <option value="inactive">Inativa</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col space-y-3 mt-6">
                <div className="flex space-x-3">
                  <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                  >
                    Salvar
                  </button>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Trash2 size={16} />
                  <span>Remover Turma</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};