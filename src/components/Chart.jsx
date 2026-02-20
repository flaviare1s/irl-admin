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

const COLORS = ['#2E4DA7', '#FA7268', '#88B04B', '#F6C324'];

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
            stroke="#88B04B"
            strokeWidth={2}
            name="Frequência"
          />
          <Line
            type="monotone"
            dataKey="tarefa"
            stroke="#2E4DA7"
            strokeWidth={2}
            name="Tarefa"
          />
          <Line
            type="monotone"
            dataKey="mochila"
            stroke="#FA7268"
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

  // Função auxiliar para converter algarismos romanos em números
  const romanToNumber = (roman) => {
    const romanMap = {
      'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
      'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
      'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15
    };
    return romanMap[roman] || null;
  };

  // Ordenar os dados antes de mapear
  const sortedData = [...data].sort((a, b) => {
    const nameA = a.className || `Turma ${a.classId}`;
    const nameB = b.className || `Turma ${b.classId}`;

    // Tentar extrair número arábico primeiro (ex: "Turma 1", "Turma 2")
    const arabicMatchA = nameA.match(/Turma\s+(\d+)/i);
    const arabicMatchB = nameB.match(/Turma\s+(\d+)/i);

    if (arabicMatchA && arabicMatchB) {
      return parseInt(arabicMatchA[1]) - parseInt(arabicMatchB[1]);
    }

    // Tentar extrair algarismo romano (ex: "Turma I", "Turma II")
    const romanMatchA = nameA.match(/Turma\s+([IVXL]+)/i);
    const romanMatchB = nameB.match(/Turma\s+([IVXL]+)/i);

    if (romanMatchA && romanMatchB) {
      const numA = romanToNumber(romanMatchA[1].toUpperCase());
      const numB = romanToNumber(romanMatchB[1].toUpperCase());
      if (numA !== null && numB !== null) {
        return numA - numB;
      }
    }

    // Fallback: ordenação alfabética
    return nameA.localeCompare(nameB);
  });

  const chartData = sortedData.map(item => ({
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
          <Bar dataKey="frequencia" fill="#88B04B" name="Frequência" />
          <Bar dataKey="tarefa" fill="#2E4DA7" name="Tarefa" />
          <Bar dataKey="mochila" fill="#FA7268" name="Mochila" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PercentagePieChart = ({ homeworkPercentage, backpackPercentage, attendancePercentage, title = "Distribuição geral" }) => {
  const dataAttendance = [
    { name: 'Presente', value: attendancePercentage, color: '#88B04B' },
    { name: 'Ausente', value: 100 - attendancePercentage, color: '#e5e7eb' },
  ];

  const data = [
    { name: 'Tarefa trazida', value: homeworkPercentage, color: '#2E4DA7' },
    { name: 'Tarefa não trazida', value: 100 - homeworkPercentage, color: '#e5e7eb' },
  ];

  const data2 = [
    { name: 'Mochila trazida', value: backpackPercentage, color: '#FA7268' },
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
          <p className="text-center text-2xl font-bold text-primary">{homeworkPercentage}%</p>
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
            stroke="#88B04B"
            strokeWidth={2}
            name="Frequência"
          />
          <Line
            type="monotone"
            dataKey="tarefa"
            stroke="#2E4DA7"
            strokeWidth={2}
            name="Tarefa"
          />
          <Line
            type="monotone"
            dataKey="mochila"
            stroke="#FA7268"
            strokeWidth={2}
            name="Mochila"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};