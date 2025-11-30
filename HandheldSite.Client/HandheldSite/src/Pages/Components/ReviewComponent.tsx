import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ImageUrl from './ImageUrl'
import { useMainStore } from '../../Stores/MainStore';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en'

import NotLikedHeart from '../../../public/Not-Liked-Heart.png'
import LikedHeart from '../../../public/Liked-Heart.png'

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-GB')


const ReviewComponent: React.FC<any> = ({ review }) => {

    const [reviewinfo,setReviewInfo] = useState<any | null>(null);

    useEffect(()=>{

        setReviewInfo(review);
    },[])


    const ToggleLike = useMainStore((state) => state.ToggleLikeButton);




    async function ToggleLikeButton(reviewid: number) {


        //only allow user to like if logged in. If not logged in then send toast error.

        const { data } = await ToggleLike(reviewid);
        const likestatus = data.likestatus.likestatus;
        const likecount = data.likestatus.likecount;

        console.log(data);

        console.log("hey");

        setReviewInfo((previous: any) => ({ ...previous, isLiked:likestatus, likeCount:likecount }));
    }


    return (

        <div className='card bg-primary p-4 gap-4 '>

            <div className='flex gap-3 items-center h-10' >

                <div className='avatar'>

                    <div className=' w-14 rounded'>
                        <Link to={`/ProfilePage/${reviewinfo?.user.id}`}>

                            {/* <img src="https://i.pinimg.com/736x/93/c6/43/93c6433bbd4ec60a88b399d08f2f17f3.jpg" alt="" /> */}
                            <ImageUrl TailwindStyles='' image={reviewinfo?.user.profileImage} />
                        </Link>
                    </div>

                </div>


                <div className='flex flex-col h-full gap-1 '>

                    <h1 className='font-bold'>{reviewinfo?.user.userName}</h1>

                    <h2 className='text-sm text-accent'>
                        {timeAgo.format(Date.parse(review.createdAt))}

                    </h2>


                </div>




            </div>

            {/* Review Imgae */}
            <Link className='' to={`/SingleReviewPage/${reviewinfo?.reviewId}`}>

                <div className='px-1'>

                    {/* <img className='rounded-xl' src={imageUrls[review.reviewId]} alt="" /> */}
                    <ImageUrl TailwindStyles='rounded-xl' image={reviewinfo?.primaryImage} />

                </div>
            </Link>
            <p>
                {reviewinfo?.reviewText}
            </p>

            <div className='flex gap-2'>

                {reviewinfo?.isLiked ?

                    <button className='' onClick={() => { ToggleLikeButton(review.reviewId) }}>
                        <img className='h-8' src={LikedHeart} alt="" />
                    </button>

                    :
                    <button className='' onClick={() => { ToggleLikeButton(review.reviewId) }}>
                        <img className='h-8' src={NotLikedHeart} alt="" />

                    </button>

                }

                <h1 className='text-3xl'>{reviewinfo?.likeCount}</h1>
            </div>




        </div>
    )
}

export default ReviewComponent