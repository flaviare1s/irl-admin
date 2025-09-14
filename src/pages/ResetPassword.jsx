import { useForm } from "react-hook-form"
import { resetPassord } from "../firebase/auth"
import { SubmitButton } from "../components/SubmitButton"
import { Link, useNavigate } from "react-router-dom"

export const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()

  const onSubmit = (data) => {
    resetPassord(data.email)
      .then(() => {
        navigate('/login')
      })
  }

  return (
    <div className="flex items-center justify-center px-2 w-full">
      <form
        className="bg-[#fefefe] py-8 px-4 rounded-xl shadow-md max-w-md space-y-6 sm:min-w-[430px] w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-bold text-center text-primary">Redefinir Senha</h1>
        <hr className="border-gray-200" />

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            placeholder="Digite o e-mail cadastrado"
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
        <SubmitButton label="Redefinir senha" />
        <div className="text-center">
          <small className="text-gray-600">
            <Link to="/login" className="text-gray-800 underline hover:text-gray-600">
              Voltar ao login
            </Link>
          </small>
        </div>
      </form>
    </div>
  )
}
