import { Users, BookOpen, Backpack, UserCheck } from "lucide-react";

export const Student = ({ student, onAttendanceChange }) => {
  const isPresent = student.attendance?.isPresent;
  const broughtHomework = student.attendance?.broughtHomework;
  const broughtBackpack = student.attendance?.broughtBackpack;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-medium text-gray-900 flex items-center">
          <Users className="w-4 h-4 mr-2 text-gray-400" />
          {student.name}
        </h4>
        <div className="flex items-center space-x-2">
          {/* Status indicator */}
          <div className={`w-2 h-2 rounded-full ${isPresent ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="text-xs text-gray-500">
            {isPresent ? 'Presente' : 'Ausente'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* Attendance Toggle */}
        <button
          onClick={() => onAttendanceChange(student.id, "present", !isPresent)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${isPresent
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          <UserCheck className="w-3 h-3" />
          <span>{isPresent ? 'Presente' : 'Ausente'}</span>
        </button>

        {/* Homework and Backpack - only enabled if present */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => isPresent && onAttendanceChange(student.id, "homework", !broughtHomework)}
            disabled={!isPresent}
            className={`p-1.5 rounded-full transition-colors ${!isPresent
                ? 'opacity-40 cursor-not-allowed bg-gray-100'
                : broughtHomework
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            title={!isPresent ? 'Disponível apenas para alunos presentes' : broughtHomework ? 'Trouxe tarefa' : 'Não trouxe tarefa'}
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            onClick={() => isPresent && onAttendanceChange(student.id, "backpack", !broughtBackpack)}
            disabled={!isPresent}
            className={`p-1.5 rounded-full transition-colors ${!isPresent
                ? 'opacity-40 cursor-not-allowed bg-gray-100'
                : broughtBackpack
                  ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            title={!isPresent ? 'Disponível apenas para alunos presentes' : broughtBackpack ? 'Trouxe mochila' : 'Não trouxe mochila'}
          >
            <Backpack className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
