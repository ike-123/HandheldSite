import React from 'react'
import { Link, Outlet } from 'react-router-dom';
import { useMainStore } from '../../Stores/MainStore';
import ProfileImageUrl from './ProfileImageUrl';

import Home from '../../../public/Home.png'
import compare from '../../../public/compare.png'
import Heart from '../../../public/Heart_White.png'



const NavigationMenu = () => {



    const UserDetails = useMainStore((state) => state.user);
    const LoggedIn = useMainStore((state) => state.loggedIn)




    return (


        <div className='flex px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto gap-5'>


            <div className='flex flex-row w-full'>

                {/* background for menu */}
                <div className='py-3 bg-primary w-60 min-w-60 sticky top-0 h-screen'>

                    <ul className="menu menu-xl bg-base-200 flex gap-3 rounded-box w-full bg-primary">

                        <li>
                            <Link to={"/"}>

                                <img className='h-7' src={Home} alt="" />
                                <h1>Home</h1>
                            </Link>
                        </li>

                        <li>
                            <Link to={"/Comparison"}>

                                <img className='h-7' src={compare} alt="" />
                                <h1>Compare</h1>
                            </Link>
                        </li>

                        {

                            LoggedIn ?
                                <li>
                                    <Link to={"/likedReviews"}>

                                        <img className='h-7' src={Heart} alt="" />

                                        <h1>Liked Reviews</h1>
                                    </Link>
                                </li>
                                :
                                ""
                        }


                        {

                            LoggedIn ?

                                <li>
                                    <Link className='flex' to={`/profilepage/${UserDetails?.id}`} >

                                        <div tabIndex={0} role="button" className=" avatar">
                                            <div className="w-8 rounded-full">

                                                <ProfileImageUrl TailwindStyles='' image={UserDetails?.profileImage} />

                                            </div>

                                        </div>

                                        <h1>Profile</h1>
                                    </Link>
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