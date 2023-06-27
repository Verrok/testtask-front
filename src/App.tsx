import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { CateringPointRoute } from "./routes/CateringPointRoute";
import { ClientRoute } from './routes/ClientRoute';
import { RootRoute } from './routes/RootRoute';

import axios from "axios";

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootRoute />,
    },{
        path: '/client/:clientId',
        element: <ClientRoute />,
    },{
        path: '/cp/:cpId',
        element: <CateringPointRoute />,
    },
]);

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function App() {
  return (
      <RouterProvider router={router} />
  )
}

export default App
