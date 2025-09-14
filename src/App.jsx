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
import { Login } from './pages/Login'
import { CreateClass } from './pages/CreateClass'
import { ClassDetails } from './pages/ClassDetails'
import { Statistics } from './pages/Statistics'
import { ProtectedRoute } from './components/ProtectedRoute'
import { StudentDetails } from './pages/StudentDetails'
import { EditStudent } from './pages/EditStudent'

function App() {
  const [userLogged, setUserLogged] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUserLogged(user)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <UserContext.Provider value={userLogged}>
        <ScrollToTop />
        <Header />
        <main className='flex flex-col justify-center items-center m-auto min-h-[calc(100vh-80px)] p-4'>
          <Routes>
            <Route path='/' element={<RedirectHome />} />
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path='/create-class' element={<ProtectedRoute><CreateClass /></ProtectedRoute>} />
            <Route path='/class/:id' element={<ProtectedRoute><ClassDetails /></ProtectedRoute>} />
            <Route path='/student/:id' element={<ProtectedRoute><StudentDetails /></ProtectedRoute>} />
            <Route path='/class/:classId/edit-student/:studentId' element={<ProtectedRoute><EditStudent /></ProtectedRoute>} />
            <Route path='/statistics' element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
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
