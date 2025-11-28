import TimeAgo from 'javascript-time-ago';
import React, { useEffect, useState } from 'react'
import en from 'javascript-time-ago/locale/en'
import { useMainStore } from '../Stores/MainStore';

const LikedReviews = () => {


    const [reviews, SetReviews] = useState<any[]>([]);

    const ToggleLike = useMainStore((state) => state.ToggleLikeButton);
    const GetLikedReviews = useMainStore((state) => state.GetLikedReviews);
    


    TimeAgo.addDefaultLocale(en)
    const timeAgo = new TimeAgo('en-GB')


    useEffect(() => {



        async function Get_Liked_Reviews() {

            const { data } = await GetLikedReviews();

            SetReviews(data);
            console.log(data);
        }

        Get_Liked_Reviews();
        

    }, [])
    

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

        <div className='flex-col flex max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 items-center gap-5'>

            
            <h1 className='text-2xl'>Liked Reviews</h1>


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

export default LikedReviews