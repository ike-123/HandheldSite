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
import Footer from './Pages/Footer'
import Test from './Pages/test'
import { useEffect } from 'react'
import { useAuthStore } from './Stores/AuthStore'
import { useMainStore } from './Stores/MainStore'

const PageStructure = () => {
  return (

    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>


  )

}

const router = createBrowserRouter([{

  path: "/",
  element: <PageStructure/>,
  errorElement: <NotFoundPage />,
  children: [
    
    {
        index: true,
        element: <Navigate to="/1" replace />
    },

    {
      path: "home/:id",
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
      path: "test",
      element: <Test/>
    }


  ]
}])

function App() {

    const AuthPing = useMainStore((state)=>state.AuthPing)
  

  useEffect(()=>{
    async function Call_Ping(){

      await AuthPing();
    }

    Call_Ping();

  },[])

  return (
    
    <RouterProvider router={router} />
  )
}

export default App
