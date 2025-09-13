import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Login } from './pages/Login'

function App() {
  
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<Login />} />
        </Routes>
      </main>
    </>
  )
}

export default App
