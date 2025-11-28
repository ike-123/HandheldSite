import React, { useEffect, useState } from 'react'
import { useMainStore } from '../Stores/MainStore'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import processor from '../../public/processor.png'

import NotLikedHeart from '../../public/Not-Liked-Heart.png'
import LikedHeart from '../../public/Liked-Heart.png'


import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'




const HomePage = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const sort = searchParams.get("sort") ?? "recent";

    const [Handhelds, SetHandhelds] = useState([]);
    const [currentHandheldId, SetSelected] = useState<number | undefined>(undefined);

    const [reviews, SetReviews] = useState<any[]>([]);


    TimeAgo.addDefaultLocale(en)
    const timeAgo = new TimeAgo('en-GB')

    // IT WILL BE BETTER IF HANDHELD SELECTION AND SORT PANEL IS ON THE LEFT-HAND SIDE WITH THE PROFILE PANEL JUST UNDER IT.

    //Don't get random reviews but get the reviews for only the hadheld selected. This is so that there can always be 
    // a panel on the right hand side that shows you the specs of the currently selected handheld.
    //If the user wants to select all they can choose to do so.

    const GetReviewforHandheld = useMainStore((state) => state.GetReviewsForHandheld);
    const GetMyProfile = useMainStore((state) => state.GetMyProfile);
    const GetHandhelds = useMainStore((state) => state.GetAllHandhelds);
    const ToggleLike = useMainStore((state) => state.ToggleLikeButton);



    const selectedHandheld: any = Handhelds.find((handheld: any) => handheld.handheldId === currentHandheldId);

    useEffect(() => {


        async function Get_All_Handhelds() {

            const { data } = await GetHandhelds();
            console.log(data);

            console.log("initial")

            SetHandhelds(data);


        }


        Get_All_Handhelds();

    }, [])


    useEffect(() => {


        //left of the screen will be profile and another tab below that idk 
        // (maybe takes you to compare page? If it's not too much work)

        async function Get_My_Profile() {

            console.log("run");

            const { data } = await GetMyProfile();
            console.log(data);

        }

        async function Get_Reviews_for_Handheld(id: number, sortBy: string) {

            const { data } = await GetReviewforHandheld(Number(id), sortBy);

            SetReviews(data);
            console.log(data);
        }



        Get_My_Profile();

        if (id) {
            SetSelected(parseInt(id));
            Get_Reviews_for_Handheld(parseInt(id), sort);
        }

    }, [id])


    async function ToggleLikeButton(reviewid: number) {

        const { data } = await ToggleLike(reviewid);
        const ReturnedId = data.reviewId;
        const likestatus = data.likestatus.likestatus;
        const LikeCount = data.likestatus.likecount;


        SetReviews(previous => previous.map((review) =>
            review.reviewId === ReturnedId ? { ...review, isLiked: likestatus, likeCount: LikeCount } : review

        ));

        console.log(ReturnedId);
    }

    return (
        <div className='flex px-4 sm:px-6 lg:px-8. max-w-7xl mx-auto gap-5'>

            {/* left section */}
            <div className='flex-1 gap-3 flex flex-col'>


                <div className='card h-60 bg-primary flex items-center gap-1'>

                    <img className='w-full h-20 object-fill rounded-t-md' src="https://i.pinimg.com/736x/e9/53/e8/e953e8aeaf4844dab4bcffb58ec04bdf.jpg" alt="" />
                    <div className="avatar justify-center mt-10">

                        <div className="ring-primary ring-offset-base-100 w-24 rounded-full absolute bottom-0 ring-2 ring-offset-2">
                            <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
                        </div>
                    </div>

                    <h1 className='text-2xl'>John Maxwell</h1>

                    <div className='w-full px-10'>
                        <button className='btn btn-secondary p-2 mt-5 w-full'>
                            My Profile
                        </button>
                    </div>



                </div>

                <div className='card h-40 bg-primary px-8 pb-4 pt-2'>

                    <legend className="fieldset-legend text-sm">Handheld</legend>
                    <select className="select mb" value={currentHandheldId} onChange={(event) => { const newId = event.target.value; navigate(`/${newId}`); }}>

                        {
                            Handhelds.map((handheld: any) => (

                                <option key={handheld.handheldId} value={handheld.handheldId} > {handheld.handheldName}</option>

                            ))
                        }

                    </select>


                    <legend className="fieldset-legend text-sm">Sort By</legend>

                    <select className="select" value={sort} onChange={(e) => navigate(`?sort=${e.target.value}`)}>

                        <option value="recent">Most Recent</option>
                        <option value="likes">Most Liked</option>
                    </select>

                </div >

                <div className='py-3 bg-primary rounded-md'>

                    <ul className="menu menu-xl bg-base-200 rounded-box w-full bg-primary">
                        <li><a>Home</a></li>
                        <li><a>Liked Reviews</a></li>
                        <li><a>Compare</a></li>
                    </ul>
                </div>


            </div>


            {/* Middle Section */}

            <div className=' flex flex-col gap-4 flex-2'>

                <div className='card bg-primary p-4 flex'>

                    <div className='avatar flex gap-3 items-center font-bold mb-1' >

                        <img className='w-12 rounded-xl' src="https://assets.promptbase.com/DALLE_IMAGES%2FSB1PjLah85MVrYwvUct7urDoTXf2%2Fresized%2F1692612767503z_800x800.webp?alt=media&token=264e0f3a-2661-4347-a7be-b56d4a5afdfa" alt="" />

                        <form className="w-full" action="">

                            <input className="w-full h-8 outline-1" type="text" name='reviewText' placeholder='Write your Review' autoComplete='off' />
                        </form>

                    </div>

                    <div className='flex'>


                        {/* <button className='btn w-15 ml-14 rounded-2xl bg-emerald-400'>Photo</button> */}

                        <div>
                            <label htmlFor="file" className="btn w-15 ml-14 rounded-2xl bg-emerald-400 cursor-pointer"> Photo </label>
                            <input id="file" type="file" className="hidden" onChange={(e) => console.log(e.target.files)} />

                        </div>
                        <button className='btn w-15 ml-auto'>Submit</button>

                    </div>

                </div>


                {reviews.map((review: any) => (
                    <div className='card bg-primary p-4 gap-4 '>

                        <div className='flex gap-3 items-center h-10' >

                            <div className='avatar'>

                                <div className=' w-14 rounded'>

                                    <img src="https://i.pinimg.com/736x/93/c6/43/93c6433bbd4ec60a88b399d08f2f17f3.jpg" alt="" />

                                </div>

                            </div>


                            <div className='flex flex-col h-full gap-1 '>

                                <h1 className='font-bold'>{review.user.userName}</h1>

                                <h2 className='text-sm text-accent'>
                                    {timeAgo.format(Date.parse(review.createdAt))}

                                </h2>


                            </div>


                        </div>

                        <div className='px-1'>

                            <img className='rounded-xl' src="https://sm.ign.com/ign_nordic/review/s/steam-deck/steam-deck-oled-review_46b8.jpg" alt="" />
                        </div>
                        <p>
                            {review.reviewText}
                        </p>

                        <div className='flex gap-2'>

                        {review.isLiked ?

                            <button className='' onClick={() => { ToggleLikeButton(review.reviewId) }}>
                                <img className='h-8' src={LikedHeart} alt="" />
                            </button>

                            :
                            <button className='' onClick={() => { ToggleLikeButton(review.reviewId) }}>
                                <img className='h-8' src={NotLikedHeart} alt="" />

                            </button>

                        }

                        <h1 className='text-3xl'>{review.likeCount}</h1>
                        </div>




                    </div>
                ))}


            </div>



            {/* Right Section */}

            <div className='card h-200 bg-primary flex flex-1 min-w-0 px-2 '>

                {selectedHandheld &&

                    <>
                        <div className='max-w-full'>

                            <div className=''>
                                <img className=' w-full h-45 object-cover mx-auto' src={selectedHandheld.handheldImg} alt="" />
                            </div>

                            <h1 className='font-bold text-2xl mb-1.5'>

                                {selectedHandheld.handheldName}

                            </h1>

                            <h2 className='mb-1'>
                                {selectedHandheld.description}
                            </h2>

                        </div>


                        <div className='px-3 flex flex-col gap-3 mt-2.5'>

                            <div className='card bg-secondary flex-row items-center gap-1.5 pl-2.5 py-1'>

                                <img src={processor} className='h-6' alt="" />

                                <div>
                                    <p className='text-sm'>Processor</p>
                                    <p className='font-bold'> AMD Ryzen Z1 Extreme</p>
                                </div>


                            </div>

                            <div className='card bg-secondary flex-row items-center gap-1.5 pl-2.5  py-1 '>

                                <img src={processor} className='h-6' alt="" />

                                <div>
                                    <p className='text-sm'>CPU</p>
                                    <p className='font-bold'> AMD Ryzen Z1 Extreme</p>
                                </div>


                            </div>


                            <div className='card bg-secondary flex-row items-center gap-1.5 pl-2.5  py-1'>

                                <img src={processor} className='h-6' alt="" />

                                <div>
                                    <p className='text-sm'>GPU</p>
                                    <p className='font-bold'> AMD Ryzen Z1 Extreme</p>
                                </div>


                            </div>




                            <div className='card bg-secondary flex-row items-center gap-1.5 pl-2.5  py-1'>

                                <img src={processor} className='h-6' alt="" />

                                <div>
                                    <p className='text-sm'>RAM</p>
                                    <p className='font-bold'> AMD Ryzen Z1 Extreme</p>
                                </div>


                            </div>



                            <div className='card bg-secondary flex-row items-center gap-1.5 pl-2.5  py-1'>

                                <img src={processor} className='h-6' alt="" />

                                <div>
                                    <p className='text-sm'>Display</p>
                                    <p className='font-bold'> AMD Ryzen Z1 Extreme</p>
                                </div>


                            </div>

                            <div className='card bg-secondary flex-row items-center gap-1.5 pl-2.5  py-1'>

                                <img src={processor} className='h-6' alt="" />

                                <div>
                                    <p className='text-sm'>Battery</p>
                                    <p className='font-bold'> AMD Ryzen Z1 Extreme</p>
                                </div>


                            </div>











                        </div>


                        {/* <div className="stats stats-vertical shadow self-center">
                            <div className="stat">
                                <div className="stat-title">APU</div>
                                <div className="stat-value">AMD Van Gouh</div>
                                <div className="stat-desc">4 zen2/ 4 RDNA 2 CU's</div>

                            </div>
                            <div className="stat">
                                <div className="stat-title ">Release Date</div>
                                <div className="stat-value">19/03/2022</div>
                                <div className="stat-desc">4 zen2/ 4 RDNA 2 CU's</div>

                            </div>

                        </div> */}




                    </>



                }
            </div>









        </div>
    )
}

export default HomePage