import { Link, useNavigate } from "react-router-dom"
import Logo from "../assets/img/logo-branca.png"
import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"
import { logout } from "../firebase/auth"
import { LogOut, BarChart3, Home, Plus } from "lucide-react"

export const Header = () => {
  const user = useContext(UserContext)
  const navigate = useNavigate();

  function handleLogout() {
    logout().then(() => {
      navigate('/')
    })
  }

  return (
    <header className="bg-primary text-white">
      <nav className="flex justify-between items-center px-5 md:px-10 md:py-2">
        <div className="h-[80px] w-[80px] sm:h-[80px] sm:w-[120px] flex justify-center items-center">
          <Link to='/'><img className="w-full" src={Logo} alt="Logo do IRL" /></Link>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/statistics"
                className="flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Estatísticas
              </Link>
            </div>

            <span className="text-white text-xs sm:text-sm">{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-primary hover:text-blue-900 cursor-pointer transition-colors px-2 py-1 rounded font-bold flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        )}

        {!user && (
          <div className="flex items-center gap-4">
            <span className="text-white text-xs sm:text-sm">Visitante</span>
          </div>
        )}
      </nav>
    </header>
  )
}
