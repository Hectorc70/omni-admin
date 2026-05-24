import { RouterProvider } from 'react-router-dom'
import router from '@/router/router'
import 'react-tooltip/dist/react-tooltip.css'
import { ConfirmProvider } from './common/providers/confirm-provider'
function App() {
  return (
    <ConfirmProvider>
      <RouterProvider router={router} />
    </ConfirmProvider>

  )
}

export default App
