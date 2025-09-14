import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, GraduationCap, Calendar, User } from 'lucide-react'
import { addClass } from '../firebase/class'

export const AddClass = ({ icon, label, onClassAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: '',
      year: new Date().getFullYear(),
      responsible: ''
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)

    try {
      const newClass = await addClass({
        name: data.name,
        year: parseInt(data.year),
        responsible: data.responsible,
        status: 'active'
      })

      if (onClassAdded) onClassAdded(newClass)
      setIsModalOpen(false)
      reset()
    } catch (err) {
      console.error('Erro ao criar turma:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-white hover:bg-primary hover:text-white transition-colors duration-200 border-2 border-primary text-primary p-6 rounded-lg shadow-sm flex items-center justify-center space-x-3 group cursor-pointer"
      >
        {icon}
        <span className="text-lg font-semibold">{label}</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#000000ca] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Nova Turma</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {errors.name && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errors.name.message}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Turma *
                </label>
                <input
                  type="text"
                  {...register('name', {
                    required: 'Nome da turma é obrigatório',
                    minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: Turma I"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Ano
                  </label>
                  <input
                    type="number"
                    {...register('year', {
                      required: 'Ano é obrigatório',
                      min: { value: 2024, message: 'Ano deve ser maior que 2023' },
                      max: { value: 2030, message: 'Ano deve ser menor que 2031' }
                    })}
                    min="2024"
                    max="2030"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {errors.year && (
                    <p className="text-red-600 text-sm mt-1">{errors.year.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Responsável pela turma
                </label>
                <input
                  type="text"
                  {...register('responsible')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nome do responsável"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Criando...' : 'Criar Turma'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
