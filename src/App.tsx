import { RouterProvider } from 'react-router-dom'
import router from '@/router/router'
import 'react-tooltip/dist/react-tooltip.css'
import { ConfirmProvider } from './common/providers/confirm-provider'
import { MessageProvider } from './common/providers/message-provider'
function App() {
  return (
    <ConfirmProvider>
      <MessageProvider>
        <RouterProvider router={router} />
      </MessageProvider>
    </ConfirmProvider>

  )
}

export default App
