import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './App'

import { RouterProvider } from 'react-router-dom'
import AuthProvider from './contexts/AuthContext'

import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router} />
    <ToastContainer />
  </AuthProvider>
)
