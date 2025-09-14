import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Calendar, TrendingUp, BarChart3, BookOpenCheck, Backpack } from "lucide-react";
import { Loader } from "../components/Loader";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#88B04B', '#FA7268'];

export const StudentDetails = () => {
  const { classId, studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [classData, setClassData] = useState(null);
  const [studentStats, setStudentStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAllClasses = async () => {
    try {
      const { getHomeworkBackpackStats } = await import("../firebase/class");
      const stats = await getHomeworkBackpackStats();
      return stats.classes || [];
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      return [];
    }
  };

  const calculateStudentStats = (studentData) => {
    const dailyRecords = studentData.dailyRecords || {};
    const records = Object.entries(dailyRecords);

    if (records.length === 0) {
      setStudentStats({
        totalDays: 0,
        presentDays: 0,
        attendancePercentage: 0,
        homeworkPercentage: 0,
        backpackPercentage: 0,
        chartData: [],
        pieData: {
          attendance: [],
          homework: [],
          backpack: []
        }
      });
      return;
    }

    let presentDays = 0;
    let homeworkDays = 0;
    let backpackDays = 0;
    const chartData = [];

    records.forEach(([date, record]) => {
      const isPresent = record.isPresent === true;
      const broughtHomework = record.broughtHomework === true;
      const broughtBackpack = record.broughtBackpack === true;

      if (isPresent) {
        presentDays++;
        if (broughtHomework) homeworkDays++;
        if (broughtBackpack) backpackDays++;
      }

      chartData.push({
        date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        presente: isPresent ? 1 : 0,
        tarefa: isPresent && broughtHomework ? 1 : 0,
        mochila: isPresent && broughtBackpack ? 1 : 0
      });
    });

    const totalDays = records.length;
    const attendancePercentage = Math.round((presentDays / totalDays) * 100);
    const homeworkPercentage = presentDays > 0 ? Math.round((homeworkDays / presentDays) * 100) : 0;
    const backpackPercentage = presentDays > 0 ? Math.round((backpackDays / presentDays) * 100) : 0;

    setStudentStats({
      totalDays,
      presentDays,
      absentDays: totalDays - presentDays,
      attendancePercentage,
      homeworkPercentage,
      backpackPercentage,
      chartData: chartData.slice(-30), // Últimos 30 registros
      pieData: {
        attendance: [
          { name: 'Presente', value: attendancePercentage, color: '#88B04B' },
          { name: 'Ausente', value: 100 - attendancePercentage, color: '#FA7268' }
        ],
        homework: [
          { name: 'Trouxe Tarefa', value: homeworkPercentage, color: '#2E4DA7' },
          { name: 'Não Trouxe', value: 100 - homeworkPercentage, color: '#FA7268' }
        ],
        backpack: [
          { name: 'Trouxe Mochila', value: backpackPercentage, color: '#F6C324' },
          { name: 'Não Trouxe', value: 100 - backpackPercentage, color: '#FA7268' }
        ]
      }
    });
  };

  const loadStudentData = useCallback(async () => {
    try {
      if (classId && studentId) {
        // Se temos ambos os IDs, buscar diretamente na turma específica
        const { getClassById } = await import("../firebase/class");
        const classDataResult = await getClassById(classId);

        if (classDataResult) {
          const foundStudent = classDataResult.students?.find(s => s.id === studentId);

          if (foundStudent) {
            setStudent(foundStudent);
            setClassData(classDataResult);
            calculateStudentStats(foundStudent);
          } else {
            console.error("Aluno não encontrado nesta turma");
            navigate(-1);
          }
        } else {
          console.error("Turma não encontrada");
          navigate(-1);
        }
      } else {
        // Fallback: buscar em todas as turmas (caso venha da rota antiga)
        const classes = await getAllClasses();
        let foundStudent = null;
        let foundClass = null;

        for (const classItem of classes) {
          const studentInClass = classItem.students?.find(s => s.id === studentId);
          if (studentInClass) {
            foundStudent = studentInClass;
            foundClass = classItem;
            break;
          }
        }

        if (foundStudent && foundClass) {
          setStudent(foundStudent);
          setClassData(foundClass);
          calculateStudentStats(foundStudent);
        } else {
          console.error("Aluno não encontrado");
          navigate(-1);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados do aluno:", error);
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [classId, studentId, navigate]);

  useEffect(() => {
    loadStudentData();
  }, [loadStudentData]);

  if (loading) {
    return <Loader />;
  }

  if (!student || !classData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Aluno não encontrado</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">{student.name}</h1>
              <p className="text-gray-600">{classData.name}</p>
              <p className="text-sm text-gray-500">
                <span className={`font-medium ${student.status === 'active' ? 'text-greenery' : 'text-red-600'}`}>
                  {student.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {studentStats && studentStats.totalDays > 0 ? (
        <>
          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Dias</p>
                  <p className="text-2xl font-bold text-gray-900">{studentStats.totalDays}</p>
                </div>
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Frequência</p>
                  <p className="text-2xl font-bold text-greenery">{studentStats.attendancePercentage}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-greenery" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tarefa</p>
                  <p className="text-2xl font-bold text-primary">{studentStats.homeworkPercentage}%</p>
                </div>
                <BookOpenCheck className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mochila</p>
                  <p className="text-2xl font-bold text-living-coral">{studentStats.backpackPercentage}%</p>
                </div>
                <Backpack className="w-8 h-8 text-living-coral" />
              </div>
            </div>
          </div>

          {/* Gráficos em Pizza */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 text-center">Frequência</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={studentStats.pieData.attendance}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {studentStats.pieData.attendance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Presente</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-xs text-gray-600">Ausente</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 text-center">Tarefa</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={studentStats.pieData.homework}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {studentStats.pieData.homework.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-xs text-gray-600">Trouxe</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-xs text-gray-600">Não Trouxe</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4 text-center">Mochila</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={studentStats.pieData.backpack}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {studentStats.pieData.backpack.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Trouxe</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-xs text-gray-600">Não Trouxe</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Linha - Histórico */}
          {studentStats.chartData.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Histórico de Presença (Últimos registros)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={studentStats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 1]} tickFormatter={(value) => value === 1 ? 'Sim' : 'Não'} />
                  <Tooltip
                    formatter={(value, name) => {
                      const labels = {
                        'presente': 'Presente',
                        'tarefa': 'Trouxe Tarefa',
                        'mochila': 'Trouxe Mochila'
                      };
                      return [value === 1 ? 'Sim' : 'Não', labels[name] || name];
                    }}
                  />
                  <Legend
                    formatter={(value) => {
                      const labels = {
                        'presente': 'Presente',
                        'tarefa': 'Trouxe Tarefa',
                        'mochila': 'Trouxe Mochila'
                      };
                      return labels[value] || value;
                    }}
                  />
                  <Line type="monotone" dataKey="presente" stroke="#88B04B" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="tarefa" stroke="#2E4DA7" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="mochila" stroke="#F6C324" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum Registro Encontrado</h3>
          <p className="text-gray-500">
            Este aluno ainda não possui registros de frequência, tarefa ou mochila.
          </p>
        </div>
      )}
    </div>
  );
};

