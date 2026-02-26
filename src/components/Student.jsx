import { User, BookOpen, Backpack, UserCheck, UserX, Eye, Settings, X } from "lucide-react";
import { Link } from "react-router-dom";

export const Student = ({ student, onAttendanceChange, onHomeworkClick, classId }) => {
  const isPresent = student.attendance?.isPresent;
  const hasHomework = student.attendance?.hasHomework;
  const broughtMaterial = student.attendance?.broughtMaterial;
  const broughtBackpack = student.attendance?.broughtBackpack;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className={`uppercase text-sm sm:text-base font-medium  flex items-center ${student.status === 'inactive' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          <User className="w-4 h-4 mr-2 text-gray-400" />
          {student.name}
        </h4>
        <div className="flex items-center gap-[6px] ml-2">
          <div>
            <Link to={`/class/${classId}/student/${student.id}`} className="text-living-coral hover:text-orange-700">
              <Eye className="w-4 h-4" />
            </Link>
          </div>
          <div>
            <Link to={`/class/${classId}/edit-student/${student.id}`} className="text-greenery hover:text-green-800">
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      {student.status === 'active' &&
        <div className="flex items-center justify-between">
          {/* Attendance Toggle */}
          <button
            onClick={() => onAttendanceChange(student.id, "present", !isPresent)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${isPresent
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {isPresent ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
            <span>{isPresent ? 'Presente' : 'Ausente'}</span>
          </button>

          {/* Homework and Backpack - only enabled if present */}

          <div className="flex items-center space-x-2">
            <button
              onClick={() => isPresent && onHomeworkClick(student.id)}
              disabled={!isPresent}
              className={`relative p-1.5 rounded-full transition-colors ${!isPresent
                ? 'opacity-40 cursor-not-allowed bg-gray-100'
                : hasHomework
                  ? broughtMaterial
                    ? 'bg-blue-100 text-primary hover:bg-blue-200'
                    : 'bg-red-100 text-living-coral hover:bg-red-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              title={
                !isPresent
                  ? 'Disponível apenas para alunos presentes'
                  : hasHomework
                    ? broughtMaterial
                      ? 'Tem tarefa e trouxe material'
                      : 'Tem tarefa mas não trouxe material'
                    : 'Não tem tarefa'
              }
            >
              <BookOpen className="w-4 h-4" />
              {hasHomework && !broughtMaterial && isPresent && (
                <X className="w-7 h-7 absolute top-0 right-0 text-living-coral" strokeWidth={1.5} />
              )}
            </button>

            <button
              onClick={() => isPresent && onAttendanceChange(student.id, "backpack", !broughtBackpack)}
              disabled={!isPresent}
              className={`p-1.5 rounded-full transition-colors ${!isPresent
                ? 'opacity-40 cursor-not-allowed bg-gray-100'
                : broughtBackpack
                  ? 'bg-purple-100 text-radiant-orchid hover:bg-purple-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              title={!isPresent ? 'Disponível apenas para alunos presentes' : broughtBackpack ? 'Trouxe mochila' : 'Não trouxe mochila'}
            >
              <Backpack className="w-4 h-4" />
            </button>
          </div>
        </div>}
    </div>
  );
};
