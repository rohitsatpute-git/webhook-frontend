import AuthForm from './Components/Auth'
import Dashboard from './Components/Dashboard'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
function App() {

  return (
    <BrowserRouter>
        <Routes>
            <Route path='/auth' element={<AuthForm/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/*' element={<AuthForm/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App
