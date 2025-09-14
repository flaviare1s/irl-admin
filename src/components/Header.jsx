import { Link, useNavigate } from "react-router-dom"
import Logo from "../assets/img/logo-branca.png"
import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"
import { logout } from "../firebase/auth"
import { LogOut } from "lucide-react"
export const Header = () => {
  const user = useContext(UserContext)
  const navigate = useNavigate();

  function handleLogout() {
    logout().then(() => {
      navigate('/')
    })
  }

  return (
    <header className="bg-primary text-white flex flex-col justify-center it">
      <nav className="flex justify-between items-center px-5 md:px-10 md:py-2">
        <div className="h-[80px] w-[80px] sm:h-[80px] sm:w-[120px] flex justify-center items-center">
          <Link to='/'><img className="w-full" src={Logo} alt="Logo do IRL" /></Link>
        </div>
        <div className="flex items-center gap-4">
          {user && <span className="text-white text-xs sm:text-sm">{user.email}</span>}
          {user && 
          <button onClick={handleLogout} className="bg-white text-primary hover:text-blue-900 cursor-pointer transition-colors px-2 py-1 rounded font-bold flex items-center gap-1">
            <LogOut />
            Sair
          </button>}
        </div>
      </nav>
    </header>
  )
}
