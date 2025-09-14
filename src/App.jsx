import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { ResetPassword } from './pages/ResetPassword'
import { Loader } from './components/Loader'
import { NotFound } from './pages/NotFound'
import { Toaster } from 'react-hot-toast'
import { UserContext } from './contexts/UserContext'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'
import { Dashboard } from './pages/Dashboard'
import { ScrollToTop } from './components/ScrollToTop'
import { RedirectHome } from './components/RedirectHome'

function App() {
  const [userLogged, setUserLogged] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUserLogged(user)
      setLoading(false)
    })
  }, [])

  if(loading) {
    return <Loader />
  }

  return (
    <>
    <UserContext.Provider value={ userLogged }>
      <ScrollToTop />
      <Header />
      <main className='flex flex-col justify-center items-center m-auto min-h-[calc(100vh-80px)] p-4'>
        <Routes>
          <Route path='/' element={<RedirectHome />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Toaster position="top-center" />
      </main>
    </UserContext.Provider>
    </>
  )
}

export default App
