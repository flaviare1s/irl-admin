import { useState, useEffect } from 'react';
import {
  TrendChart,
  ClassComparisonChart,
  PercentagePieChart,
  MonthlyChart
} from '../components/Chart';
import {
  getTrendStats,
  getStatsByDate,
  getMonthlyStats,
  getClassesByYear,
  getClassStats,
  getHomeworkBackpackStats
} from '../firebase/class';
import { Users, BookOpenCheck, Backpack, Users2 } from 'lucide-react';
import { Loader } from '../components/Loader';

export const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Dados dos gráficos
  const [trendData, setTrendData] = useState([]);
  const [dailyData, setDailyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [classesData, setClassesData] = useState([]);
  const [overallStats, setOverallStats] = useState({ homeworkPercentage: 0, backpackPercentage: 0 });

  useEffect(() => {
    loadAllStats();
  }, [selectedYear]);

  useEffect(() => {
    loadDailyStats();
  }, [selectedDate]);

  useEffect(() => {
    loadMonthlyStats();
  }, [selectedMonth, selectedYear]);

  const loadAllStats = async () => {
    try {
      setLoading(true);

      // Carregar tendência dos últimos 30 dias
      const trend = await getTrendStats();
      setTrendData(trend);

      // Carregar estatísticas gerais do ano
      const overall = await getHomeworkBackpackStats(selectedYear);
      setOverallStats(overall);

      // Carregar dados das turmas para comparação
      const classes = await getClassesByYear(selectedYear);
      const classStats = await Promise.all(
        classes.map(async (classItem) => {
          const stats = await getClassStats(classItem.id, selectedYear);
          return {
            classId: classItem.id,
            className: classItem.name,
            ...stats
          };
        })
      );
      setClassesData(classStats.filter(Boolean));

    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDailyStats = async () => {
    try {
      const daily = await getStatsByDate(selectedDate, selectedYear);
      setDailyData(daily);
    } catch (error) {
      console.error('Error loading daily stats:', error);
    }
  };

  const loadMonthlyStats = async () => {
    try {
      const monthly = await getMonthlyStats(selectedYear, selectedMonth);
      setMonthlyData(monthly);
    } catch (error) {
      console.error('Error loading monthly stats:', error);
    }
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="lg:max-w-[1000px] p-6 w-full mx-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Estatísticas</h1>
          <p className="text-gray-600">Acompanhe o desempenho de frequência, tarefa e mochila dos alunos</p>
        </div>

        {/* Controles */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ano
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data específica
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mês
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2024, i, 1).toLocaleDateString('pt-BR', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Frequência Média</p>
                <p className="text-2xl font-bold text-greenery">{overallStats.attendancePercentage || 0}%</p>
              </div>
              <Users className="h-8 w-8 text-greenery" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tarefa</p>
                <p className="text-2xl font-bold text-primary">{overallStats.homeworkPercentage}%</p>
              </div>
              <BookOpenCheck className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mochila</p>
                <p className="text-2xl font-bold text-living-coral">{overallStats.backpackPercentage}%</p>
              </div>
              <Backpack className="h-8 w-8 text-living-coral" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Turmas Ativas</p>
                <p className="text-2xl font-bold text-radiant-orchid">{classesData.length}</p>
              </div>
              <Users2 className="h-8 w-8 text-radiant-orchid" />
            </div>
          </div>
        </div>

        {/* Gráficos principais */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <PercentagePieChart
            homeworkPercentage={overallStats.homeworkPercentage}
            backpackPercentage={overallStats.backpackPercentage}
            attendancePercentage={overallStats.attendancePercentage}
            title="Distribuição Geral do Ano"
          />

          <TrendChart
            data={trendData}
            title="Tendência dos Últimos 30 Dias"
          />
        </div>

        {/* Comparação entre turmas */}
        <div className="mb-8">
          <ClassComparisonChart
            data={classesData}
            title="Comparação entre Turmas"
          />
        </div>

        {/* Estatísticas diárias */}
        {dailyData && (
          <div className="mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">
                Estatísticas do dia {selectedDate.split('-').reverse().join('/')}
              </h3>

              {dailyData.totalStudents > 0 ? (
                <div>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Frequência</p>
                      <p className="text-2xl font-bold text-greenery">{dailyData.attendancePercentage}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Tarefa</p>
                      <p className="text-2xl font-bold text-primary">{dailyData.homeworkPercentage}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Mochila</p>
                      <p className="text-2xl font-bold text-living-coral">{dailyData.backpackPercentage}%</p>
                    </div>
                  </div>

                  <ClassComparisonChart
                    data={dailyData.classes}
                    title="Desempenho por turma no dia"
                  />
                </div>
              ) : (
                <p className="text-gray-500">Nenhum registro encontrado para esta data.</p>
              )}
            </div>
          </div>
        )}

        {/* Estatísticas mensais */}
        <div className="mb-8">
          <MonthlyChart
            data={monthlyData}
            title={`Estatísticas de ${new Date(selectedYear, selectedMonth - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`}
          />
        </div>
      </div>
    </div>
  );
};