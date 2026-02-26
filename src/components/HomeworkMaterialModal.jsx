import { X, Check, BookOpen } from "lucide-react";

export const HomeworkMaterialModal = ({
  student,
  broughtMaterial,
  onClose,
  onSave
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">Tarefa - {student.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 text-center">
              Trouxe o material para fazer a tarefa?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onSave(true);
                  onClose();
                }}
                className={`flex-1 cursor-pointer py-2 px-4 rounded-lg border-2 transition-all ${broughtMaterial
                  ? 'border-primary bg-blue-50 text-primary'
                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-6 h-6" />
                  <span className="text-sm font-medium">Sim</span>
                </div>
              </button>
              <button
                onClick={() => {
                  onSave(false);
                  onClose();
                }}
                className={`flex-1 cursor-pointer py-2 px-4 rounded-lg border-2 transition-all ${!broughtMaterial
                  ? 'border-living-coral bg-red-50 text-living-coral'
                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <X className="w-6 h-6" />
                  <span className="text-sm font-medium">Não</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
