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
