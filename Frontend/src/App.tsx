
import { Route, Routes } from "react-router-dom"
import Login from "./Pages/Login"
import Dashboard from "./Pages/Dashboard"
import ComposeNewEmail from "./components/ComposeNewEmail"

const App = () => {
  return (

    <div className='flex w-screen h-screen'>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/send-email" element={<ComposeNewEmail />} />
        <Route path="/" element={<Login />} />
      </Routes>

    </div>
  )
}

export default App