import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDailyStudents, toggleStudentDailyField, addStudent } from "../firebase/class";

export const ClassDetail = () => {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const data = await getDailyStudents(id);
    setStudents(data);
  };

  const handleToggle = async (studentId, field) => {
    await toggleStudentDailyField(id, studentId, field);
    loadStudents();
  };

  const handleAddStudent = async () => {
    if (!newStudent.trim()) return;
    await addStudent(id, newStudent);
    setNewStudent("");
    loadStudents();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Alunos da Turma Hoje</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newStudent}
          onChange={(e) => setNewStudent(e.target.value)}
          placeholder="Nome do aluno"
          className="px-3 py-2 border rounded w-full"
        />
        <button onClick={handleAddStudent} className="px-4 py-2 bg-primary text-white rounded">
          Adicionar
        </button>
      </div>

      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Aluno</th>
            <th className="p-2 border">Tarefa</th>
            <th className="p-2 border">Mochila</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border text-center">
                <input
                  type="checkbox"
                  checked={s.trouxeTarefa}
                  onChange={() => handleToggle(s.id, "trouxeTarefa")}
                />
              </td>
              <td className="p-2 border text-center">
                <input
                  type="checkbox"
                  checked={s.trouxeMochila}
                  onChange={() => handleToggle(s.id, "trouxeMochila")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
