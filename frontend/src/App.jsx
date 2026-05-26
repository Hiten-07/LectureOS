import { Routes, Route } from 'react-router-dom'
import Upload from './pages/Upload'
import Lecture from './pages/Lecture'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Upload />} />
      <Route path="/lecture/:id" element={<Lecture />} />
    </Routes>
  )
}

export default App