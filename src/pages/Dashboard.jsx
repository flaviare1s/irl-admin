import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Calendar,
  Activity,
  UsersRound,
  BookOpenCheck,
  Backpack
} from 'lucide-react';
import { AddButton } from '../components/AddButton';
import { StatiticCard } from '../components/StatiticCard';
import { QuickStat } from '../components/QuickStat';

export const Dashboard = () => {
  // Mock data - replace with real data from your API
  const stats = {
    totalClasses: 3,
    activeClasses: 3,
    totalStudents: 52,
    totalEmployees: 3
  };

  const classData = [
    { name: 'Turma I', students: 12 },
    { name: 'Turma II', students: 22 },
    { name: 'Turma III', students: 18 },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema</p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          <AddButton icon={<GraduationCap className="w-6 h-6" />} label="Cadastrar Turma" />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatiticCard title="Turmas Cadastradas" value={stats.totalClasses} icon={<BookOpen className="w-6 h-6 text-white" />} />

          <StatiticCard title="Turmas Ativas" value={stats.activeClasses} icon={<Activity className="w-6 h-6 text-white" />} />

          <StatiticCard title="Total de Alunos" value={stats.totalStudents} icon={<Users className="w-6 h-6 text-white" />} />

          <StatiticCard title="Total de Funcionários" value={stats.totalEmployees} icon={<UsersRound className="w-6 h-6 text-white" />} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Students per Class Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Alunos por Turma</h3>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-4">
              {classData.map((item, index) => (
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
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Resumo Geral</h3>
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-6">
              <QuickStat icon={<Users className="w-4 h-4 text-primary" />} title="Média de Alunos/Turma" value={Math.round(stats.totalStudents / stats.totalClasses)} />

              <QuickStat icon={<BookOpenCheck className="w-4 h-4 text-primary" />} title="Média de Alunos/Tarefa" value={Math.round(stats.totalStudents / stats.totalClasses)} />

              <QuickStat icon={<Backpack className="w-4 h-4 text-primary" />} title="Média de Alunos/Mochila" value={Math.round(stats.totalStudents / stats.totalClasses)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
