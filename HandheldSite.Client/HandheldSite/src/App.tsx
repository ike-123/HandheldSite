
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './Pages/Navbar'
import NotFoundPage from './Pages/NotFoundPage'
import HomePage from './Pages/HomePage'
import Register from './Pages/Register'
import Login from './Pages/Login'


const router = createBrowserRouter([{

  path: "/",
  element: <Navbar />,
  errorElement: <NotFoundPage />,
  children: [

    {
      path: "/:id",
      element: <HomePage />,
    },
    {
      path: "/Register",
      element: <Register />,
    },
    {
      path: "/Login",
      element: <Login />,
    },

  ]
}])

function App() {


  return (

    <RouterProvider router={router} />
  )
}

export default App
