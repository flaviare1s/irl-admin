import { useState } from "react";
import { deleteClass } from "../firebase/class";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const EditClass = ({ classData, onSave, onCancel }) => {
  const navigate = useNavigate();
  const [editData, setEditData] = useState({
    name: classData.name,
    responsible: classData.responsible,
    year: classData.year,
    status: classData.status
  });

  const handleSave = () => {
    onSave(editData);
  };

  const handleDelete = () => {
    const remove = window.confirm("Tem certeza que deseja deletar esta turma? Esta ação não pode ser desfeita.");
    if (remove) {
      deleteClass(classData.id);
      toast.success("Turma deletada com sucesso!");
      navigate('/dashboard');
    }
  }

  return (
    <div className="fixed inset-0 bg-[#000000ca] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
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

          <div className="flex space-x-3 mt-6">
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
          <button
            onClick={handleDelete}
            className="flex px-4 py-2 text-red-600 bg--white rounded-lg hover:text-red-700 transition-colors cursor-pointer w-full items-center justify-center mt-4 border border-red-600 font-semibold"
          >
            <Trash className="w-4 h-4 mr-2" />
            Deletar Turma
          </button>
        </div>
      </div>
    </div>
  ); 
};