import { db } from "./config";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

// --- Turmas ---
// Criar turma
export async function createClass(name, year) {
  const turmaRef = await addDoc(collection(db, "turmas"), {
    name,
    year,
    active: true,
  });
  return turmaRef.id;
}

// Adicionar turma (versão compatível com AddClass component)
export const addClass = async (classData) => {
  try {
    const docRef = await addDoc(collection(db, "turmas"), {
      name: classData.name,
      year: classData.year,
      active: true,
      description: classData.description || "",
      maxStudents: classData.maxStudents || 30,
      teacher: classData.teacher || "",
      createdAt: Timestamp.now(),
    });
    return { id: docRef.id, ...classData };
  } catch (error) {
    console.error("Error adding class:", error);
    throw error;
  }
};

// Deletar turma
export async function deleteClass(turmaId) {
  await deleteDoc(doc(db, "turmas", turmaId));
}

// Obter turmas por ano
export async function getClassStatistics(year) {
  const q = query(collection(db, "turmas"), where("year", "==", year));
  const snapshot = await getDocs(q);

  let totalClasses = 0;
  let activeClasses = 0;
  let totalStudents = 0;
  const classes = [];

  for (let turma of snapshot.docs) {
    totalClasses++;
    const turmaData = turma.data();
    if (turmaData.active) activeClasses++;

    const alunosSnap = await getDocs(
      collection(db, "turmas", turma.id, "alunos")
    );
    totalStudents += alunosSnap.size;

    classes.push({
      id: turma.id,
      name: turmaData.name,
      studentCount: alunosSnap.size,
    });
  }

  return { totalClasses, activeClasses, totalStudents, classes };
}

// Obter turma por ID
export const getClassById = async (classId) => {
  try {
    if (!classId) {
      throw new Error("ID da turma é obrigatório");
    }

    const docRef = doc(db, "turmas", classId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Turma não encontrada");
    }
  } catch (error) {
    console.error("Error getting class:", error);
    throw error;
  }
};

// --- Alunos ---
// Adicionar aluno
export async function addStudent(turmaId, studentData) {
  try {
    const nome =
      typeof studentData === "string" ? studentData : studentData.name;
    const alunoRef = await addDoc(collection(db, "turmas", turmaId, "alunos"), {
      nome,
    });
    return { id: alunoRef.id, name: nome };
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
}

// Remover aluno
export async function removeStudent(turmaId, alunoId) {
  await deleteDoc(doc(db, "turmas", turmaId, "alunos", alunoId));
}

// --- Registros diários ---
// Obter alunos com registro do dia
export async function getAttendanceByDate(
  turmaId,
  date = new Date().toISOString().slice(0, 10)
) {
  const alunosSnap = await getDocs(collection(db, "turmas", turmaId, "alunos"));
  const students = [];

  for (let aluno of alunosSnap.docs) {
    const registroRef = doc(
      db,
      "turmas",
      turmaId,
      "alunos",
      aluno.id,
      "registros",
      date
    );
    const registroSnap = await getDoc(registroRef);
    students.push({
      id: aluno.id,
      name: aluno.data().nome,
      attendance: registroSnap.exists()
        ? {
            broughtHomework: registroSnap.data().tarefa || false,
            broughtBackpack: registroSnap.data().mochila || false,
          }
        : null,
    });
  }
  return students;
}

// Adicionar/atualizar registro diário
export async function addDailyAttendance(
  studentId,
  date,
  broughtHomework,
  broughtBackpack,
  classId
) {
  try {
    if (!studentId || !date || !classId) {
      throw new Error("StudentId, date e classId são obrigatórios");
    }

    const registroRef = doc(
      db,
      "turmas",
      classId,
      "alunos",
      studentId,
      "registros",
      date
    );
    await setDoc(
      registroRef,
      {
        tarefa: Boolean(broughtHomework),
        mochila: Boolean(broughtBackpack),
      },
      { merge: true }
    );
    return { studentId, date, broughtHomework, broughtBackpack };
  } catch (error) {
    console.error("Error adding attendance:", error);
    throw error;
  }
}

// Alternar campo do registro do dia (tarefa ou mochila)
export async function toggleStudentDailyField(
  turmaId,
  alunoId,
  field,
  date = new Date().toISOString().slice(0, 10)
) {
  const registroRef = doc(
    db,
    "turmas",
    turmaId,
    "alunos",
    alunoId,
    "registros",
    date
  );
  const registroSnap = await getDoc(registroRef);
  const currentValue = registroSnap.exists()
    ? registroSnap.data()[field]
    : false;
  await setDoc(registroRef, { [field]: !currentValue }, { merge: true });
}

// Estatísticas de tarefa e mochila
export const getHomeworkBackpackStats = async (
  year = new Date().getFullYear()
) => {
  try {
    const q = query(collection(db, "turmas"), where("year", "==", year));
    const snapshot = await getDocs(q);

    let totalRecords = 0;
    let homeworkBrought = 0;
    let backpackBrought = 0;

    for (let turma of snapshot.docs) {
      const alunosSnap = await getDocs(
        collection(db, "turmas", turma.id, "alunos")
      );

      for (let aluno of alunosSnap.docs) {
        const registrosSnap = await getDocs(
          collection(db, "turmas", turma.id, "alunos", aluno.id, "registros")
        );

        for (let registro of registrosSnap.docs) {
          const data = registro.data();
          totalRecords++;
          if (data.tarefa) homeworkBrought++;
          if (data.mochila) backpackBrought++;
        }
      }
    }

    return {
      homeworkPercentage:
        totalRecords > 0
          ? Math.round((homeworkBrought / totalRecords) * 100)
          : 0,
      backpackPercentage:
        totalRecords > 0
          ? Math.round((backpackBrought / totalRecords) * 100)
          : 0,
      totalRecords,
    };
  } catch (error) {
    console.error("Error getting homework/backpack stats:", error);
    return { homeworkPercentage: 0, backpackPercentage: 0, totalRecords: 0 };
  }
};

// Obter todas as turmas por ano
export const getClassesByYear = async (year = new Date().getFullYear()) => {
  try {
    const q = query(collection(db, "turmas"), where("year", "==", year));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting classes by year:", error);
    return [];
  }
};

// Estatísticas por turma específica
export const getClassStats = async (classId) => {
  try {
    if (!classId) {
      throw new Error("ID da turma é obrigatório");
    }

    const alunosSnap = await getDocs(
      collection(db, "turmas", classId, "alunos")
    );
    let totalRecords = 0;
    let homeworkBrought = 0;
    let backpackBrought = 0;

    for (let aluno of alunosSnap.docs) {
      const registrosSnap = await getDocs(
        collection(db, "turmas", classId, "alunos", aluno.id, "registros")
      );

      for (let registro of registrosSnap.docs) {
        const data = registro.data();
        totalRecords++;
        if (data.tarefa) homeworkBrought++;
        if (data.mochila) backpackBrought++;
      }
    }

    return {
      classId,
      totalRecords,
      homeworkPercentage:
        totalRecords > 0
          ? Math.round((homeworkBrought / totalRecords) * 100)
          : 0,
      backpackPercentage:
        totalRecords > 0
          ? Math.round((backpackBrought / totalRecords) * 100)
          : 0,
      homeworkBrought,
      backpackBrought,
      totalStudents: alunosSnap.size,
    };
  } catch (error) {
    console.error("Error getting class stats:", error);
    return null;
  }
};

// Estatísticas por data específica
export const getStatsByDate = async (date, year = new Date().getFullYear()) => {
  try {
    const q = query(collection(db, "turmas"), where("year", "==", year));
    const snapshot = await getDocs(q);

    let totalStudents = 0;
    let homeworkBrought = 0;
    let backpackBrought = 0;
    const classesStat = [];

    for (let turma of snapshot.docs) {
      const alunosSnap = await getDocs(
        collection(db, "turmas", turma.id, "alunos")
      );
      let classHomework = 0;
      let classBackpack = 0;
      let classStudents = 0;

      for (let aluno of alunosSnap.docs) {
        const registroRef = doc(
          db,
          "turmas",
          turma.id,
          "alunos",
          aluno.id,
          "registros",
          date
        );
        const registroSnap = await getDoc(registroRef);

        if (registroSnap.exists()) {
          const data = registroSnap.data();
          classStudents++;
          totalStudents++;
          if (data.tarefa) {
            classHomework++;
            homeworkBrought++;
          }
          if (data.mochila) {
            classBackpack++;
            backpackBrought++;
          }
        }
      }

      if (classStudents > 0) {
        classesStat.push({
          classId: turma.id,
          className: turma.data().name,
          students: classStudents,
          homeworkPercentage: Math.round((classHomework / classStudents) * 100),
          backpackPercentage: Math.round((classBackpack / classStudents) * 100),
        });
      }
    }

    return {
      date,
      totalStudents,
      homeworkPercentage:
        totalStudents > 0
          ? Math.round((homeworkBrought / totalStudents) * 100)
          : 0,
      backpackPercentage:
        totalStudents > 0
          ? Math.round((backpackBrought / totalStudents) * 100)
          : 0,
      classes: classesStat,
    };
  } catch (error) {
    console.error("Error getting stats by date:", error);
    return null;
  }
};

// Estatísticas mensais
export const getMonthlyStats = async (
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1
) => {
  try {
    const endDate = new Date(year, month, 0);
    const dailyStats = [];

    for (let day = 1; day <= endDate.getDate(); day++) {
      const currentDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      const dayStats = await getStatsByDate(currentDate, year);

      if (dayStats && dayStats.totalStudents > 0) {
        dailyStats.push(dayStats);
      }
    }

    // Calcular médias mensais
    const totalDays = dailyStats.length;
    const avgHomework =
      totalDays > 0
        ? Math.round(
            dailyStats.reduce((sum, day) => sum + day.homeworkPercentage, 0) /
              totalDays
          )
        : 0;
    const avgBackpack =
      totalDays > 0
        ? Math.round(
            dailyStats.reduce((sum, day) => sum + day.backpackPercentage, 0) /
              totalDays
          )
        : 0;

    return {
      year,
      month,
      dailyStats,
      averageHomeworkPercentage: avgHomework,
      averageBackpackPercentage: avgBackpack,
      totalDaysWithData: totalDays,
    };
  } catch (error) {
    console.error("Error getting monthly stats:", error);
    return null;
  }
};

// Estatísticas de tendência (últimos 30 dias)
export const getTrendStats = async () => {
  try {
    const last30Days = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];

      const dayStats = await getStatsByDate(dateString, date.getFullYear());
      if (dayStats && dayStats.totalStudents > 0) {
        last30Days.push(dayStats);
      }
    }

    return last30Days;
  } catch (error) {
    console.error("Error getting trend stats:", error);
    return [];
  }
};
