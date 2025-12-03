import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ImageUrl from './ImageUrl'
import { useMainStore } from '../../Stores/MainStore';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en'

import NotLikedHeart from '../../../public/Not-Liked-Heart.png'
import LikedHeart from '../../../public/Liked-Heart.png'
import toast from "react-hot-toast";
import { useAuthStore } from '../../Stores/AuthStore';
import ProfileImageUrl from './ProfileImageUrl';

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-GB')


const ReviewComponent: React.FC<any> = ({ review }) => {

    const hadSelection = useRef(false);

    const navigate = useNavigate();


    const [reviewinfo, setReviewInfo] = useState<any | null>(null);


    useEffect(() => {
        // console.log("review changed")
        setReviewInfo(review);
    }, [review])


    const ToggleLike = useMainStore((state) => state.ToggleLikeButton);
    const LoggedIn = useAuthStore((state) => state.loggedIn)




    async function ToggleLikeButton(reviewid: number) {


        //only allow user to like if logged in. If not logged in then send toast error.
        if (LoggedIn) {

            const { data } = await ToggleLike(reviewid);
            const likestatus = data.likestatus.likestatus;
            const likecount = data.likestatus.likecount;

            console.log(data);

            console.log("hey");

            setReviewInfo((previous: any) => ({ ...previous, isLiked: likestatus, likeCount: likecount }));
        }
        else {
            toast.dismiss();
            toast.error("You must Login to Like a post")
        }

    }

    function handleMouseDown() {
        // Check if ANY text was selected before the click started
        const selected = window.getSelection()?.toString();

        console.log(selected);

        if (selected) {
            hadSelection.current = true;
        }
        else {
            hadSelection.current = false;
        }

    }

    function handleClick() {
        // If selection existed when mousedown happened → do NOT navigate
        if (hadSelection.current) return;

        const selected = window.getSelection()?.toString();

        if (selected) {
            return;
        }
        else {
            navigate(`/SingleReviewPage/${reviewinfo?.reviewId}`);

        }
    }


    return (

        <div className='card bg-base-200 p-4 gap-4 w-full cursor-pointer border border-base-content/30' onMouseDown={handleMouseDown} onClick={handleClick}>

            <div className='flex gap-3 items-center h-10' >

                <div className='avatar'>

                    <div onClick={(e) => { e.stopPropagation(); }} className=' w-14 rounded border-2 border-transparent hover:bg-accent/30 hover:rounded hover:backdrop-blur-xs hover:border-2 hover:border-accent/50  transition-all duration-250 ease-linear delay-25' >
                        <Link to={`/ProfilePage/${reviewinfo?.user.id}`}>

                            {/* <img src="https://i.pinimg.com/736x/93/c6/43/93c6433bbd4ec60a88b399d08f2f17f3.jpg" alt="" /> */}


                            <ProfileImageUrl TailwindStyles='' image={reviewinfo?.user.profileImage} />

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

            <div className='px-1'>

                {/* <img className='rounded-xl' src={imageUrls[review.reviewId]} alt="" /> */}



                <ImageUrl TailwindStyles='rounded-xl' image={reviewinfo?.primaryImage} />


            </div>


            <p className='max-h-80 min-w-0 line-clamp-10'>
                {reviewinfo?.reviewText}
            </p>

            <div className='flex items-center' onClick={(e) => { e.stopPropagation(); }}>

                {reviewinfo?.isLiked ?

                    <button className='rounded-full border border-transparent hover:bg-red-300/30 hover:rounded-full hover:backdrop-blur-xs hover:border hover:border-red-300/30 transition-all duration-250 ease-linear delay-25' onClick={() => { ToggleLikeButton(review.reviewId) }}>
                        <img className='h-12 p-2' src={LikedHeart} alt="" />
                    </button>

                    :
                    <button className=' rounded-full border border-transparent hover:bg-red-300/30 hover:rounded-full hover:backdrop-blur-xs hover:border hover:border-red-300/30 transition-all duration-250 ease-linear delay-25' onClick={() => { ToggleLikeButton(review.reviewId) }}>
                        <img className='h-12 p-2' src={NotLikedHeart} alt="" />

                    </button>

                }

                <h1 className='text-3xl'>{reviewinfo?.likeCount}</h1>
            </div>




        </div>
    )
}

export default ReviewComponent