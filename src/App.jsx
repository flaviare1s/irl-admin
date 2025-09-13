import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Login } from './pages/Login'
import { ResetPassword } from './pages/ResetPassword'
import { Home } from 'lucide-react'
import { NotFound } from './pages/NotFound'
import { Toaster } from 'react-hot-toast'

function App() {
  
  return (
    <>
      <Header />
      <main className='flex flex-col justify-center items-center m-auto min-h-[calc(100vh-80px)] p-4'>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Toaster position="top-center" />
      </main>
    </>
  )
}

export default App
