import { RouterProvider } from 'react-router-dom'
import router from '@/router/router'
import 'react-tooltip/dist/react-tooltip.css'
function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
