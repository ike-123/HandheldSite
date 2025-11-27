import TimeAgo from 'javascript-time-ago';
import React, { useEffect, useState } from 'react'
import en from 'javascript-time-ago/locale/en'
import { useMainStore } from '../Stores/MainStore';
import { useNavigate, useParams } from 'react-router-dom';


const ProfilePage = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();


    TimeAgo.addDefaultLocale(en)
    const timeAgo = new TimeAgo('en-GB')

    const GetReviewsForUser = useMainStore((state) => state.GetReviewsByUser);

    const ToggleLike = useMainStore((state) => state.ToggleLikeButton);

    const [reviews, SetReviews] = useState<any[]>([]);




    useEffect(() => {



        async function Get_Reviews_for_User(id: number) {

            const { data } = await GetReviewsForUser(Number(id));

            SetReviews(data);
            console.log(data);
        }


        if (id) {
            Get_Reviews_for_User(parseInt(id));
        }

    }, [id])


    async function ToggleLikeButton(reviewid: number) {

        const { data } = await ToggleLike(reviewid);
        const ReturnedId = data.reviewId;
        const likestatus = data.likestatus;


        SetReviews(previous => previous.map((review) =>
            review.reviewId === ReturnedId ? { ...review, isLiked: likestatus } : review

        ));

        console.log(ReturnedId);
    }

    return (

        <div className='flex-col flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center'>

            <div className='w-full'>

                {/* Profile and details section */}

                <div className='relative flex flex-col  '>

                    <img className="h-50 w-full object-cover" src="https://4kwallpapers.com/images/wallpapers/glossy-abstract-3840x2160-9602.jpg" alt="" />

                    <div className='avatar left-20 -bottom-30 absolute' >

                        <div className=" ring-primary ring-offset-base-100 w-60 rounded-full ring-3 ring-offset-3">

                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="" />

                        </div>


                    </div>

                </div>

                <div className='flex flex-col'>

                    <div className='bg-primary w-full h-35 flex flex-col '>

                        <h1 className='text-4xl pl-85 pt-5'>Username</h1>
                        <h2 className='text-md pl-85 pt-1'>Description</h2>


                    </div>

                </div>

            </div>

            <div className="divider">


            </div>



            <h1 className=''>
                Reviews from username
            </h1>



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

                    {review.isLiked ?

                        <button className='btn bg-green-400 w-20' onClick={() => { ToggleLikeButton(review.reviewId) }}>Toggle Like</button>

                        :
                        <button className='btn bg-red-400 w-20' onClick={() => { ToggleLikeButton(review.reviewId) }}>Toggle Like</button>

                    }



                </div>
            ))}


        </div>

    )
}

export default ProfilePage