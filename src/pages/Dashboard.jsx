import { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  BookOpenCheck,
  Backpack,
  Percent,
} from 'lucide-react';
import { StatiticCard } from '../components/StatiticCard';
import { QuickStat } from '../components/QuickStat';
import { getClassStatistics, getHomeworkBackpackStats } from '../firebase/class';
import { AddClass } from '../components/AddClass';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({
    totalClasses: 0,
    activeClasses: 0,
    totalStudents: 0,
    totalEmployees: 0
  });
  const [classData, setClassData] = useState([]);
  const [homeworkBackpackStats, setHomeworkBackpackStats] = useState({
    attendancePercentage: 0,
    homeworkPercentage: 0,
    backpackPercentage: 0
  });
  const [loading, setLoading] = useState(true);

  const availableYears = [2025, 2026, 2027, 2028, 2029, 2030];

  useEffect(() => {
    loadDashboardData();
  }, [currentYear]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const classStats = await getClassStatistics(currentYear);
      const hwBpStats = await getHomeworkBackpackStats(currentYear);

      const employeeCount = 3;

      setStats({
        ...classStats,
        totalEmployees: employeeCount
      });

      setClassData(
        classStats.classes.map(cls => ({
          id: cls.id,
          name: cls.name,
          students: cls.studentCount
        }))
      );

      setHomeworkBackpackStats(hwBpStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (year) => {
    setCurrentYear(year);
  };

  const handleClassAdded = () => {
    loadDashboardData(); // Reload data after creating a class
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header e seletor de ano */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Visão geral do sistema</p>
          </div>

          <div className="mt-4 sm:mt-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ano Letivo
            </label>
            <select
              value={currentYear}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Seção de Gerenciamento das Turmas */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <AddClass
            icon={<GraduationCap className="w-6 h-6" />}
            label="Cadastrar Turma"
            onClassAdded={handleClassAdded}
          />
          {classData.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecione a turma</h3>
              <ul className="space-y-2">
                {classData.map(cls => (
                  <li
                    key={cls.id}
                    className="flex justify-between items-center py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => navigate(`/class/${cls.id}`)}
                  >
                    <span className="text-gray-700">{cls.name}</span>
                    <span className="text-sm text-gray-500">{cls.students} alunos</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Estatísticas Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <StatiticCard title="Turmas Cadastradas" value={stats.totalClasses} icon={<BookOpen className="w-6 h-6 text-white" />} />
              <StatiticCard title="Total de Alunos" value={stats.totalStudents} icon={<Users className="w-6 h-6 text-white" />} />

            </div>

            {/* Gráficos e Estatísticas Rápidas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Alunos por Turma */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Alunos por Turma</h3>
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-4">
                  {classData.length > 0 ? classData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">{item.name}</span>
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-200 rounded-full h-2 w-32">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(item.students / 30) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-primary min-w-[2rem]">{item.students}</span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">Nenhuma turma cadastrada para {currentYear}</p>
                  )}
                </div>
              </div>

              {/* Média Geral */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Média Geral</h3>
                  <Percent className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-6">
                  <QuickStat
                    icon={<Users className="w-4 h-4 text-primary" />}
                    title="Frequência"
                    value={`${homeworkBackpackStats.attendancePercentage}%`}
                  />
                  <QuickStat
                    icon={<BookOpenCheck className="w-4 h-4 text-primary" />}
                    title="Tarefas"
                    value={`${homeworkBackpackStats.homeworkPercentage}%`}
                  />
                  <QuickStat
                    icon={<Backpack className="w-4 h-4 text-primary" />}
                    title="Mochilas"
                    value={`${homeworkBackpackStats.backpackPercentage}%`}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
