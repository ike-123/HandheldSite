import { NavLink, Outlet } from 'react-router-dom';
import ProfileImageUrl from './ProfileImageUrl';

import Home from '../../../public/Home.png'
import compare from '../../../public/compare.png'
import Heart from '../../../public/Heart_White.png'
import { useAuthStore } from '../../Stores/AuthStore';



const NavigationMenu = () => {



    const UserDetails = useAuthStore((state) => state.user);
    const LoggedIn = useAuthStore((state) => state.loggedIn)




    return (


        <div className='flex px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto gap-5'>


            <div className='flex flex-row w-full'>

                {/* background for menu */}
                <div className='py-3 bg-base-200 w-60 min-w-60 sticky top-0 h-screen'>

                    <ul className="menu menu-xl bg-base-200 flex gap-3 rounded-box w-full">

                        <li>
                            <NavLink to={"/home"} className={({ isActive }) => isActive
                                ? "bg-primary text-white flex items-center gap-2 p-2"
                                : "text-gray-300 hover:bg-gray-700 flex items-center gap-2 p-2"}>
                                <img className='h-7' src={Home} alt="" />
                                <h1>Home</h1>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to={"/Comparison"} className={({ isActive }) => isActive
                                ? "bg-primary text-white flex items-center gap-2 p-2"
                                : "text-gray-300 hover:bg-gray-700 flex items-center gap-2 p-2"}>
                                <img className='h-7' src={compare} alt="" />
                                <h1>Compare</h1>
                            </NavLink>
                        </li>

                        {

                            LoggedIn ?
                                <li>
                                    <NavLink to={"/likedReviews"} className={({ isActive }) => isActive
                                        ? "bg-primary text-white flex items-center gap-2 p-2"
                                        : "text-gray-300 hover:bg-gray-700 flex items-center gap-2 p-2"}>

                                        <img className='h-7' src={Heart} alt="" />

                                        <h1>Liked Reviews</h1>
                                    </NavLink>
                                </li>
                                :
                                ""
                        }


                        {

                            LoggedIn ?

                                <li>
                                    <NavLink to={`/Profilepage/${UserDetails?.id}`} className={({ isActive }) => isActive
                                        ? "bg-primary text-white flex items-center gap-2 p-2"
                                        : "text-gray-300 hover:bg-gray-700 flex items-center gap-2 p-2"}>

                                        <div tabIndex={0} role="button" className=" avatar">
                                            <div className="w-8 rounded-full">

                                                <ProfileImageUrl TailwindStyles='' image={UserDetails?.profileImage} />

                                            </div>

                                        </div>

                                        <h1>Profile</h1>
                                    </NavLink>
                                </li>


                                : ""

                        }



                    </ul>

                </div>

                <div className='flex-1'>

                    <Outlet />

                </div>


            </div>




        </div>


    )
}

export default NavigationMenu