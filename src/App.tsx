import { createBrowserRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { New } from './pages/Dashboard/new';
import { Dashboard } from './pages/Dashboard';
import { CarDetails } from './pages/Car';

import { Layout } from './components/layout';
import { Private } from './routes/Private';
import { PublicRoute } from './routes/Public';

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
        element: <Private> <Dashboard/> </Private>
      },
      {
        path: '/dashboard/new',
        element: <Private> <New/> </Private>
      }
    ]
  },
  // Outro obj de config, para nessas paginas não ficar o component 'Layout' 
  {
    path: '/login',
    element: <PublicRoute> <Login/> </PublicRoute>
  },
  {
    path: '/register',
    element: <PublicRoute> <Register/> </PublicRoute>
  }
])