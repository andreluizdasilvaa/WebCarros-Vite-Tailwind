import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './App'

import { RouterProvider } from 'react-router-dom'
import AuthProvider from './contexts/AuthContext'
import { register } from 'swiper/element/bundle'
import { ToastContainer } from 'react-toastify'

register();
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router} />
    <ToastContainer />
  </AuthProvider>
)
