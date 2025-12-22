import './App.css'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import Navbar from './Pages/Navbar'
import NotFoundPage from './Pages/NotFoundPage'
import HomePage from './Pages/HomePage'
import Register from './Pages/Register'
import Login from './Pages/Login'
import SingleReviewPage from './Pages/SingleReviewPage'
import ProfilePage from './Pages/ProfilePage'
import ComparisonPage from './Pages/ComparisonPage'
import LikedReviews from './Pages/LikedReviews'
import { useEffect } from 'react'
import { useAuthStore } from './Stores/AuthStore'
import NavigationMenu from './Pages/Components/NavigationMenu'
import ScrollToTop from './Pages/Components/ScrollToTop'


//website doesn't seem to need ScrollToTop function when footer is removed
// so i'll keep it commented out for now
const PageStructure = () => {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <NavigationMenu />
      {/* <Footer /> */}
    </>
  )
}

const PageStructureNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([

  {

    path: "/",
    element: <PageStructure />,
    errorElement: <NotFoundPage />,
    children: [

      {
        index: true,
        element: <Navigate to="home/1" replace />
      },
      {
        path: "home",
        element: <Navigate to="/home/1" replace />
      },
      {
        path: "home/:id",
        element: <HomePage />,
      },
      {
        path: "SingleReviewPage/:id",
        element: <SingleReviewPage />
      },
      {
        path: "ProfilePage/:id",
        element: <ProfilePage />
      },
      {
        path: "Comparison",
        element: <ComparisonPage />
      },
      {
        path: "LikedReviews",
        element: <LikedReviews />
      },
      {
        path: "nav",
        element: <NavigationMenu />
      },



    ]
  },
  {
    path: "/",
    element: <PageStructureNavbar />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/Register",
        element: <Register />,
      },
      {
        path: "/Login",
        element: <Login />,
      },

    ]
  }
])

function App() {

  const AuthPing = useAuthStore((state) => state.AuthPing)


  useEffect(() => {
    async function Call_Ping() {

      await AuthPing();
    }

    Call_Ping();

  }, [])

  return (

    <RouterProvider router={router} />
  )
}

export default App
