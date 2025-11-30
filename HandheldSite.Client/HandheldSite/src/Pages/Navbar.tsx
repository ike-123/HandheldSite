import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useMainStore } from '../Stores/MainStore'
import ImageUrl from './Components/ImageUrl'

const Navbar = () => {

  const LoggedIn = useMainStore((state) => state.loggedIn)
  const UserDetails = useMainStore((state)=> state.user);
  



  async function LogoutButton() {


  }



  return (

    <div className=''>

      <div className="navbar bg-base-100 shadow-sm mb-5 px-4 sm:px-6 lg:px-8. max-w-7xl mx-auto ">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">HandheldSite</a>
        </div>
        <div className="flex-none ">



          {
            LoggedIn ? 
            
            (<div className="dropdown dropdown-end">
              {/* profile image */}
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">

                <ImageUrl TailwindStyles='' image={UserDetails?.profileImage}/>

                </div>

              </div>


              <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li><a>Logout</a></li>
              </ul>
            </div>) 
            
            : (
              <div className='flex items-center gap-3'>

                <Link to="/login">
                  <h1 className="text-sm text-white">Login</h1>
                </Link>

                <Link to="/Register">
                  <h1 className="rounded-sm bg-accent p-1 px-2 text-xl text-white">Sign up</h1>
                </Link>

              </div>
            )
          }








        </div>
      </div>

    </div>

  )
}

export default Navbar