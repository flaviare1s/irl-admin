import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Users,
  BookOpen,
  Backpack,
  UserPlus,
  Check,
  X
} from "lucide-react";
import {
  getClassById,
  getAttendanceByDate,
  addDailyAttendance,
  addStudent
} from "../firebase/class";

export const ClassDetails = () => {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");

  useEffect(() => {
    loadClassData();
  }, [classId]);

  useEffect(() => {
    if (classData) {
      loadAttendanceData();
    }
  }, [selectedDate, classData]);

  const loadClassData = async () => {
    try {
      const data = await getClassById(classId);
      setClassData(data);
    } catch (error) {
      console.error("Error loading class:", error);
    }
  };

  const loadAttendanceData = async () => {
    try {
      const data = await getAttendanceByDate(classId, selectedDate);
      setStudents(data);
    } catch (error) {
      console.error("Error loading attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = async (studentId, type, value) => {
    try {
      const student = students.find(s => s.id === studentId);
      const currentHomework = student.attendance?.broughtHomework || false;
      const currentBackpack = student.attendance?.broughtBackpack || false;

      const newHomework = type === "homework" ? value : currentHomework;
      const newBackpack = type === "backpack" ? value : currentBackpack;

      await addDailyAttendance(studentId, selectedDate, newHomework, newBackpack);
      loadAttendanceData();
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudentName.trim()) return;

    try {
      await addStudent(classId, { name: newStudentName.trim() });
      setNewStudentName("");
      setShowAddStudent(false);
      loadAttendanceData();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Detalhes da Turma</h1>
          <p className="text-gray-600">{classData?.name || "Turma não encontrada"}</p>
        </div>

        {/* Date Selector */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-primary" />
              <label className="text-sm font-medium text-gray-700">
                Data da Aula
              </label>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Add Student */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Alunos</h3>
            <button
              onClick={() => setShowAddStudent(!showAddStudent)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Adicionar Aluno</span>
            </button>
          </div>

          {showAddStudent && (
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newStudentName}
                onChange={e => setNewStudentName(e.target.value)}
                placeholder="Nome do aluno"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onKeyPress={e => e.key === "Enter" && handleAddStudent()}
              />
              <button
                onClick={handleAddStudent}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Adicionar
              </button>
            </div>
          )}
        </div>

        {/* Students List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-700">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Aluno</span>
              </div>
              <div className="flex items-center space-x-2 justify-center">
                <BookOpen className="w-4 h-4" />
                <span>Tarefa</span>
              </div>
              <div className="flex items-center space-x-2 justify-center">
                <Backpack className="w-4 h-4" />
                <span>Mochila</span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {students.length > 0 ? students.map(student => (
              <div key={student.id} className="p-4">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="font-medium text-gray-900">
                    {student.name}
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => handleAttendanceChange(
                        student.id,
                        "homework",
                        !student.attendance?.broughtHomework
                      )}
                      className={`p-2 rounded-full transition-colors ${student.attendance?.broughtHomework
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                        }`}
                    >
                      {student.attendance?.broughtHomework ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <X className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => handleAttendanceChange(
                        student.id,
                        "backpack",
                        !student.attendance?.broughtBackpack
                      )}
                      className={`p-2 rounded-full transition-colors ${student.attendance?.broughtBackpack
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                        }`}
                    >
                      {student.attendance?.broughtBackpack ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <X className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-500">
                Nenhum aluno cadastrado nesta turma
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
