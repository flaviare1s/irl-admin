import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Users,
  UserPlus,
  Settings
} from "lucide-react";
import {
  getClassById,
  getAttendanceByDate,
  addDailyAttendance,
  addStudent,
  updateClass
} from "../firebase/class";
import { Student } from "../components/Student";
import { Loader } from "../components/Loader";

export const ClassDetails = () => {
  const { id: classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [showEditClass, setShowEditClass] = useState(false);
  const [editClassData, setEditClassData] = useState({
    name: "",
    responsible: "",
    year: new Date().getFullYear(),
    status: "active"
  });

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
      if (!classId) {
        console.error("No classId provided");
        return;
      }
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

  const handleEditClass = () => {
    setEditClassData({
      name: classData.name,
      responsible: classData.responsible,
      year: classData.year,
      status: classData.status
    });
    setShowEditClass(true);
  };

  const handleUpdateClass = async () => {
    try {
      await updateClass(classId, editClassData);
      setClassData({ ...classData, ...editClassData });
      setShowEditClass(false);
    } catch (error) {
      console.error("Error updating class:", error);
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
    <div className="min-h-screen p-3 sm:p-6 w-full sm:max-w-[600px]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1"></div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center flex-1">
              {classData?.name || "Turma não encontrada"}
            </h1>
            <div className="flex-1 flex justify-end">
              <button
                onClick={handleEditClass}
                className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
                title="Editar informações da turma"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          {classData?.responsible && (
            <p className="text-sm text-gray-500 text-center">Responsável: {classData.responsible}</p>
          )}
          {classData?.year && (
            <p className="text-xs text-gray-400 text-center">Ano: {classData.year}</p>
          )}
        </div>

        {/* Date Selector */}
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
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
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Alunos ({students.length})</h3>
            <button
              onClick={() => setShowAddStudent(!showAddStudent)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors w-full sm:w-auto cursor-pointer mb-1"
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
                className="px-4 py-2 bg-greenery text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto cursor-pointer"
              >
                Adicionar
              </button>
            </div>
          )}
        </div>

        {/* Students List */}
        {students.length > 0 ? (
          <div className="space-y-1">
            {students.map(student => (
              <Student
                key={student.id}
                student={student}
                onAttendanceChange={handleAttendanceChange}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum aluno cadastrado nesta turma</p>
          </div>
        )}
      </div>

      {/* Modal de Edição da Turma */}
      {showEditClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                    value={editClassData.name}
                    onChange={(e) => setEditClassData({...editClassData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Nome da turma"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsável
                  </label>
                  <input
                    type="text"
                    value={editClassData.responsible}
                    onChange={(e) => setEditClassData({...editClassData, responsible: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Nome do responsável"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ano
                  </label>
                  <input
                    type="number"
                    value={editClassData.year}
                    onChange={(e) => setEditClassData({...editClassData, year: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    min="2020"
                    max="2030"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editClassData.status}
                    onChange={(e) => setEditClassData({...editClassData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="active">Ativa</option>
                    <option value="inactive">Inativa</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowEditClass(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateClass}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
