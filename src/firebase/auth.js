import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./config";
import toast from "react-hot-toast";

// Cadastrar usuário com e-mail e senha:
export async function cadastrarUsuario(nome, email, senha) {
  const { user } = await createUserWithEmailAndPassword(auth, email, senha);
  await updateProfile(user, { displayName: nome });
}

// LOGIN - entrar com e-mail e senha
export async function loginUsuario(email, senha) {
  await signInWithEmailAndPassword(auth, email, senha);
}

// LOGOUT
export async function logout() {
  await signOut(auth);
}

// Resetar a senha
export async function resetarSenha(email) {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      toast.success("E-mail de redefinição de senha enviado!");
    })
    .catch((error) => {
      toast.error(`Um erro aconteceu: ${error.code}`);
    });
}
