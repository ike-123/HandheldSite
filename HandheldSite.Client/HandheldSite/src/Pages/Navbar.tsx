import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Navbar = () => {

    async function LogoutButton() {
        

    }

  return (

    <div>
        <p>Navbar</p>

        <Outlet/>
    </div>  

  )
}

export default Navbar