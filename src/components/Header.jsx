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
            <div className="flex items-center gap-4 text-sm sm:text-base">
              <Link
                to="/dashboard"
                className="flex items-center gap-1 rounded link-nav"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:block">Dashboard</span>
              </Link>
              <Link
                to="/statistics"
                className="flex items-center gap-1 rounded link-nav"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="hidden sm:block">Estatísticas</span>
              </Link>
            </div>

            <span className="hidden sm:block text-gray-400 text-xs sm:text-sm">{user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-primary hover:text-blue-900 cursor-pointer transition-colors px-2 py-1 rounded font-bold flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}
