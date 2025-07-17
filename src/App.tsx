import { createBrowserRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { New } from './pages/Dashboard/new';
import { Dashboard } from './pages/Dashboard';
import { CarDetails } from './pages/Car';

import { Layout } from './components/layout';

// Isso para a nossa pagina ficar com a pagina 'Layout' renderizando junto com cada pagina abaixo
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/car/:id',
        element: <CarDetails />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/dashboard/new',
        element: <New />
      }
    ]
  },
  // Outro obj de config, para nessas paginas não ficar o component 'Layout' 
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
])