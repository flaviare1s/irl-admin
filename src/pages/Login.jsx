import { useForm } from "react-hook-form"
import { SubmitButton } from "../components/SubmitButton"
import { Link, useNavigate } from "react-router-dom"
import { loginUsuario } from "../firebase/auth"
import toast from "react-hot-toast"

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()

  function login(data) {
    loginUsuario(data.email, data.senha).then(() => {
      toast.success('Bem-vindo(a) ao IRL!')
      navigate('/home')
    }).catch((error) => {
      toast.error(`Um erro aconteceu: ${error.code}`)
    })
  }

  return (
    <div className="flex items-center justify-center px-2 w-full">
      <form
        className="bg-[#fefefe] py-8 px-4 rounded-xl shadow-md max-w-md space-y-6 sm:min-w-[430px] w-full"
        onSubmit={handleSubmit(login)}
      >
        <h1 className="text-2xl font-bold text-center text-primary">Login</h1>
        <hr className="border-gray-200" />

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-gray-200 focus:border-gray-400 outline-none"
            {...register('email', {
              required: 'E-mail obrigatório',
              pattern: {
                value: /[\w.-]+@[\w-]+\.[\w-.]+/gi,
                message: 'E-mail inválido'
              }
            })}
          />
          {errors.email && (
            <small className="text-red-500">{errors.email.message}</small>
          )}
        </div>

        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type="password"
            id="senha"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-gray-200 focus:border-gray-400 outline-none"
            {...register('senha', {
              required: 'A senha é obrigatória',
              minLength: { value: 6, message: 'Mínimo 6 caracteres' }
            })}
          />
          {errors.senha && (
            <small className="text-red-500">{errors.senha.message}</small>
          )}
        </div>

        <SubmitButton label="Login" />

        <div className="text-center">
          <small className="text-gray-600">
            Esqueceu a senha?{" "}
            <Link to="/reset-password" className="text-gray-800 underline hover:text-gray-600">
              Clique aqui
            </Link>
          </small>
        </div>
      </form>
    </div>
  )
}
