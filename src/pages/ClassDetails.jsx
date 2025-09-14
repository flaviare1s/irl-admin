import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Users,
  BookOpen,
  Backpack,
  UserPlus,
  Check,
  X,
  UserCheck
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
      const currentPresent = student.attendance?.isPresent || false;
      const currentHomework = student.attendance?.broughtHomework || false;
      const currentBackpack = student.attendance?.broughtBackpack || false;

      const newPresent = type === "present" ? value : currentPresent;
      const newHomework = type === "homework" ? value : currentHomework;
      const newBackpack = type === "backpack" ? value : currentBackpack;

      await addDailyAttendance(studentId, selectedDate, newPresent, newHomework, newBackpack, classId);
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
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Detalhes da Turma</h1>
          <p className="text-gray-600">{classData?.name || "Turma não encontrada"}</p>
          {classData?.responsible && (
            <p className="text-sm text-gray-500">Responsável: {classData.responsible}</p>
          )}
        </div>

        {/* Date Selector */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Alunos ({students.length})</h3>
            <button
              onClick={() => setShowAddStudent(!showAddStudent)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>Adicionar Aluno</span>
            </button>
          </div>

          {showAddStudent && (
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
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
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
              >
                Adicionar
              </button>
            </div>
          )}
        </div>

        {/* Students List */}
        {students.length > 0 ? (
          <div className="space-y-4">
            {students.map(student => (
              <div key={student.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col space-y-4">
                  {/* Student Name */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-gray-500" />
                      {student.name}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.attendance?.isPresent
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                      }`}>
                      {student.attendance?.isPresent ? 'Presente' : 'Ausente'}
                    </span>
                  </div>

                  {/* Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Frequency */}
                    <div className="flex flex-col space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <UserCheck className="w-4 h-4 mr-2" />
                        Frequência
                      </label>
                      <button
                        onClick={() => handleAttendanceChange(
                          student.id,
                          "present",
                          !student.attendance?.isPresent
                        )}
                        className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors ${student.attendance?.isPresent
                            ? "bg-green-100 text-green-700 border-2 border-green-300"
                            : "bg-gray-100 text-gray-500 border-2 border-gray-300"
                          }`}
                      >
                        {student.attendance?.isPresent ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                        <span className="font-medium">
                          {student.attendance?.isPresent ? 'Presente' : 'Ausente'}
                        </span>
                      </button>
                    </div>

                    {/* Homework */}
                    <div className="flex flex-col space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Tarefa
                      </label>
                      <button
                        onClick={() => handleAttendanceChange(
                          student.id,
                          "homework",
                          !student.attendance?.broughtHomework
                        )}
                        className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors ${student.attendance?.broughtHomework
                            ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                            : "bg-gray-100 text-gray-500 border-2 border-gray-300"
                          }`}
                      >
                        {student.attendance?.broughtHomework ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                        <span className="font-medium">
                          {student.attendance?.broughtHomework ? 'Trouxe' : 'Não trouxe'}
                        </span>
                      </button>
                    </div>

                    {/* Backpack */}
                    <div className="flex flex-col space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <Backpack className="w-4 h-4 mr-2" />
                        Mochila
                      </label>
                      <button
                        onClick={() => handleAttendanceChange(
                          student.id,
                          "backpack",
                          !student.attendance?.broughtBackpack
                        )}
                        className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors ${student.attendance?.broughtBackpack
                            ? "bg-purple-100 text-purple-700 border-2 border-purple-300"
                            : "bg-gray-100 text-gray-500 border-2 border-gray-300"
                          }`}
                      >
                        {student.attendance?.broughtBackpack ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                        <span className="font-medium">
                          {student.attendance?.broughtBackpack ? 'Trouxe' : 'Não trouxe'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum aluno cadastrado nesta turma</p>
          </div>
        )}
      </div>
    </div>
  );
};
