import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { updateStudent, deleteStudent } from "../firebase/class";
import toast from "react-hot-toast";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Loader } from "../components/Loader";

export const EditStudent = () => {
  const { classId, studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const getAllClasses = async () => {
    try {
      const { getHomeworkBackpackStats } = await import("../firebase/class");
      const stats = await getHomeworkBackpackStats();
      return stats.classes || [];
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      return [];
    }
  };

  const loadStudentData = useCallback(async () => {
    try {
      if (classId && studentId) {
        const { getClassById } = await import("../firebase/class");
        const classDataResult = await getClassById(classId);

        if (classDataResult) {
          const foundStudent = classDataResult.students?.find(s => s.id === studentId);

          if (foundStudent) {
            setStudent(foundStudent);
            setClassData(classDataResult);
            setValue("name", foundStudent.name);
            setValue("status", foundStudent.status);
          } else {
            toast.error("Aluno não encontrado nesta turma");
            navigate(-1);
          }
        } else {
          toast.error("Turma não encontrada");
          navigate(-1);
        }
      } else {
        const classes = await getAllClasses();
        let foundStudent = null;
        let foundClass = null;

        for (const classItem of classes) {
          const studentInClass = classItem.students?.find(s => s.id === studentId);
          if (studentInClass) {
            foundStudent = studentInClass;
            foundClass = classItem;
            break;
          }
        }

        if (foundStudent && foundClass) {
          setStudent(foundStudent);
          setClassData(foundClass);
          setValue("name", foundStudent.name);
          setValue("status", foundStudent.status);
        } else {
          toast.error("Aluno não encontrado");
          navigate(-1);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados do aluno:", error);
      toast.error("Erro ao carregar dados do aluno");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [classId, studentId, navigate, setValue]);

  useEffect(() => {
    loadStudentData();
  }, [loadStudentData]);

  const onSubmit = async (data) => {
    try {
      await updateStudent(classData.id, student.id, data);
      toast.success("Aluno atualizado com sucesso!");
      navigate(-1);
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      toast.error("Erro ao atualizar aluno");
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteStudent(classData.id, student.id);
      toast.success("Aluno removido com sucesso!");
      navigate(-1);
    } catch (error) {
      console.error("Erro ao remover aluno:", error);
      toast.error("Erro ao remover aluno");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <Loader />;
  }

  if (!student || !classData) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Aluno não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 w-full">
      <div className="bg-white rounded-lg shadow-xl sm:max-w-[430px] w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleGoBack}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Editar Aluno</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {showDeleteConfirm ? (
            <div className="text-center">
              <div className="mb-4">
                <Trash2 className="mx-auto h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Confirmar Remoção
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Tem certeza que deseja remover o aluno{" "}
                <span className="font-medium">{student.name}</span>? Esta ação
                não pode ser desfeita.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isDeleting ? "Removendo..." : "Remover"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Aluno
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Nome é obrigatório",
                    minLength: {
                      value: 2,
                      message: "Nome deve ter pelo menos 2 caracteres",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite o nome do aluno"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  {...register("status", { required: "Status é obrigatório" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-3">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleGoBack}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? "Salvando..." : "Salvar"}
                  </button>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                    className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center space-x-2 cursor-pointer"
                  disabled={isSubmitting}
                >
                  <Trash2 size={16} />
                  <span>Remover Aluno</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
