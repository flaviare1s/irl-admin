import { db } from "./config";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  query,
  where,
  updateDoc,
  getDoc,
} from "firebase/firestore";

// Criar turma
export async function createClass(name, year) {
  const turmaRef = await addDoc(collection(db, "turmas"), {
    name,
    year,
    active: true,
  });
  return turmaRef.id;
}

// Adicionar aluno a uma turma
export async function addStudent(turmaId, nome) {
  const alunosRef = collection(db, "turmas", turmaId, "alunos");
  const alunoRef = await addDoc(alunosRef, { nome });
  return alunoRef.id;
}

// Obter alunos de uma turma
export const getStudentsByClass = async (classId) => {
  const snapshot = await getDocs(
    collection(db, "classes", classId, "students")
  );
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Alternar campo (tarefa/mochila) de um aluno
export const toggleStudentField = async (classId, studentId, field) => {
  const studentRef = doc(db, "classes", classId, "students", studentId);
  const studentSnap = await getDocs(studentRef);
  await updateDoc(studentRef, { [field]: !studentSnap.data()[field] });
};

// Registrar presença de tarefa/mochila para um aluno num dia
export async function registerDaily(turmaId, alunoId, date, tarefa, mochila) {
  const registroRef = doc(
    db,
    "turmas",
    turmaId,
    "alunos",
    alunoId,
    "registros",
    date
  );
  await setDoc(registroRef, {
    tarefa,
    mochila,
    createdAt: new Date(),
  });
}

// Estatísticas gerais por ano
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

    const alunosRef = collection(db, "turmas", turma.id, "alunos");
    const alunosSnap = await getDocs(alunosRef);
    totalStudents += alunosSnap.size;

    classes.push({
      id: turma.id,
      name: turmaData.name,
      studentCount: alunosSnap.size,
    });
  }

  return { totalClasses, activeClasses, totalStudents, classes };
}

// Estatísticas de tarefa/mochila por ano (agregadas)
export async function getHomeworkBackpackStats(year) {
  const q = query(collection(db, "turmas"), where("year", "==", year));
  const snapshot = await getDocs(q);

  let totalRegistros = 0;
  let tarefaCount = 0;
  let mochilaCount = 0;

  for (let turma of snapshot.docs) {
    const alunosRef = collection(db, "turmas", turma.id, "alunos");
    const alunosSnap = await getDocs(alunosRef);

    for (let aluno of alunosSnap.docs) {
      const registrosRef = collection(
        db,
        "turmas",
        turma.id,
        "alunos",
        aluno.id,
        "registros"
      );
      const registrosSnap = await getDocs(registrosRef);

      registrosSnap.forEach((r) => {
        totalRegistros++;
        if (r.data().tarefa) tarefaCount++;
        if (r.data().mochila) mochilaCount++;
      });
    }
  }

  return {
    homeworkPercentage: totalRegistros
      ? Math.round((tarefaCount / totalRegistros) * 100)
      : 0,
    backpackPercentage: totalRegistros
      ? Math.round((mochilaCount / totalRegistros) * 100)
      : 0,
  };
}

// Obter alunos com registro do dia (ex: '2025-09-14')
export async function getDailyStudents(turmaId, date = new Date().toISOString().slice(0,10)) {
  const alunosRef = collection(db, "turmas", turmaId, "alunos");
  const alunosSnap = await getDocs(alunosRef);
  const students = [];

  for (let aluno of alunosSnap.docs) {
    const registroRef = doc(db, "turmas", turmaId, "alunos", aluno.id, "registros", date);
    const registroSnap = await getDoc(registroRef);
    students.push({
      id: aluno.id,
      name: aluno.data().nome,
      trouxeTarefa: registroSnap.exists() ? registroSnap.data().tarefa : false,
      trouxeMochila: registroSnap.exists() ? registroSnap.data().mochila : false
    });
  }
  return students;
}

// Alternar campo do registro do dia
export async function toggleStudentDailyField(turmaId, alunoId, field, date = new Date().toISOString().slice(0,10)) {
  const registroRef = doc(db, "turmas", turmaId, "alunos", alunoId, "registros", date);
  const registroSnap = await getDoc(registroRef);
  const currentValue = registroSnap.exists() ? registroSnap.data()[field] : false;
  await setDoc(registroRef, { [field]: !currentValue }, { merge: true });
}
