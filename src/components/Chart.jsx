import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

export const TrendChart = ({ data, title = "Tendência dos últimos 30 dias" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-gray-500">Nenhum dado disponível</p>
      </div>
    );
  }

  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('pt-BR', {
      month: 'short',
      day: 'numeric'
    }),
    frequencia: item.attendancePercentage,
    tarefa: item.homeworkPercentage,
    mochila: item.backpackPercentage,
    alunos: item.totalStudents
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value, name) => {
            const labels = {
              'frequencia': 'Frequência',
              'tarefa': 'Tarefa',
              'mochila': 'Mochila'
            };
            return [`${value}%`, labels[name] || name];
          }} />
          <Legend />
          <Line
            type="monotone"
            dataKey="frequencia"
            stroke="#10b981"
            strokeWidth={2}
            name="Frequência"
          />
          <Line
            type="monotone"
            dataKey="tarefa"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Tarefa"
          />
          <Line
            type="monotone"
            dataKey="mochila"
            stroke="#ef4444"
            strokeWidth={2}
            name="Mochila"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ClassComparisonChart = ({ data, title = "Comparação entre turmas" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-gray-500">Nenhum dado disponível</p>
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: item.className || `Turma ${item.classId}`,
    frequencia: item.attendancePercentage || 0,
    tarefa: item.homeworkPercentage || 0,
    mochila: item.backpackPercentage || 0,
    alunos: item.students || item.totalStudents || 0
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value, name) => {
            const labels = {
              'frequencia': 'Frequência',
              'tarefa': 'Tarefa',
              'mochila': 'Mochila'
            };
            return [`${value}%`, labels[name] || name];
          }} />
          <Legend />
          <Bar dataKey="frequencia" fill="#10b981" name="Frequência" />
          <Bar dataKey="tarefa" fill="#3b82f6" name="Tarefa" />
          <Bar dataKey="mochila" fill="#ef4444" name="Mochila" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PercentagePieChart = ({ homeworkPercentage, backpackPercentage, attendancePercentage, title = "Distribuição geral" }) => {
  const dataAttendance = [
    { name: 'Presente', value: attendancePercentage, color: '#10b981' },
    { name: 'Ausente', value: 100 - attendancePercentage, color: '#e5e7eb' },
  ];

  const data = [
    { name: 'Tarefa trazida', value: homeworkPercentage, color: '#3b82f6' },
    { name: 'Tarefa não trazida', value: 100 - homeworkPercentage, color: '#e5e7eb' },
  ];

  const data2 = [
    { name: 'Mochila trazida', value: backpackPercentage, color: '#ef4444' },
    { name: 'Mochila não trazida', value: 100 - backpackPercentage, color: '#e5e7eb' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Frequência</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dataAttendance}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {dataAttendance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-2xl font-bold text-green-600">{attendancePercentage}%</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Tarefa</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-2xl font-bold text-blue-600">{homeworkPercentage}%</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">Mochila</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data2}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data2.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-2xl font-bold text-red-600">{backpackPercentage}%</p>
        </div>
      </div>
    </div>
  );
};

export const MonthlyChart = ({ data, title = "Estatísticas mensais" }) => {
  if (!data || !data.dailyStats || data.dailyStats.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-gray-500">Nenhum dado disponível para este mês</p>
      </div>
    );
  }

  const chartData = data.dailyStats.map(item => ({
    date: new Date(item.date).getDate(),
    frequencia: item.attendancePercentage,
    tarefa: item.homeworkPercentage,
    mochila: item.backpackPercentage,
    alunos: item.totalStudents
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="text-sm text-gray-600">
          Média: Freq. {data.averageAttendancePercentage}% | Tarefa {data.averageHomeworkPercentage}% | Mochila {data.averageBackpackPercentage}%
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value, name) => {
            const labels = {
              'frequencia': 'Frequência',
              'tarefa': 'Tarefa',
              'mochila': 'Mochila'
            };
            return [`${value}%`, labels[name] || name];
          }} />
          <Legend />
          <Line
            type="monotone"
            dataKey="frequencia"
            stroke="#10b981"
            strokeWidth={2}
            name="Frequência"
          />
          <Line
            type="monotone"
            dataKey="tarefa"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Tarefa"
          />
          <Line
            type="monotone"
            dataKey="mochila"
            stroke="#ef4444"
            strokeWidth={2}
            name="Mochila"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};