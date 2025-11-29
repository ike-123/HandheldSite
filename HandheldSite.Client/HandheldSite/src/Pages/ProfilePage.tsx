import TimeAgo from 'javascript-time-ago';
import React, { useEffect, useState } from 'react'
import en from 'javascript-time-ago/locale/en'
import { useMainStore } from '../Stores/MainStore';
import { useNavigate, useParams } from 'react-router-dom';

import NotLikedHeart from '../../public/Not-Liked-Heart.png'
import LikedHeart from '../../public/Liked-Heart.png'
import { Link } from 'react-router-dom';

const ProfilePage = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();


    TimeAgo.addDefaultLocale(en)
    const timeAgo = new TimeAgo('en-GB')

    const GetReviewsForUser = useMainStore((state) => state.GetReviewsByUser);
    const GetUserProfile = useMainStore((state) => state.GetUserProfile);


    const ToggleLike = useMainStore((state) => state.ToggleLikeButton);

    const [reviews, SetReviews] = useState<any[]>([]);
    const [userinfo, SetUserInfo] = useState<any>();
    const [imageUrls, setImageUrls] = useState<Record<number, string>>({});




    useEffect(() => {



        async function Get_Reviews_for_User(id: string) {

            const { data } = await GetReviewsForUser(id);

            SetReviews(data);
            console.log(data);
        }

        async function Get_User_Profile(id: string) {

            const { data } = await GetUserProfile(id);

            SetUserInfo(data);
            console.log(data);
        }


        if (id) {
            Get_User_Profile(id);
            Get_Reviews_for_User(id);
        }

    }, [])


    useEffect(() => {
        reviews.forEach((review: any) => {
            if (!review.primaryImage || imageUrls[review.reviewId]) return;

            // 1) already a data URL string (e.g. "data:image/png;base64,...")
            if (typeof review.primaryImage === 'string' && review.primaryImage.startsWith('data:')) {
                setImageUrls(prev => ({ ...prev, [review.reviewId]: review.primaryImage }));
                return;
            }

            // 2) plain base64 string without prefix
            if (typeof review.primaryImage === 'string') {
                const dataUrl = `data:image/jpeg;base64,${review.primaryImage}`;
                setImageUrls(prev => ({ ...prev, [review.reviewId]: dataUrl }));
                return;
            }

            // 3) numeric byte array or { data: number[] } from EF/JSON
            const bytes = review.primaryImage.data ?? review.primaryImage;
            const uint8 = new Uint8Array(bytes);
            const blob = new Blob([uint8], { type: 'image/png' }); // adjust mime type if needed
            const url = URL.createObjectURL(blob);
            setImageUrls(prev => ({ ...prev, [review.reviewId]: url }));
        });
        // revoke created URLs on unmount to avoid memory leaks
        return () => {
            Object.values(imageUrls).forEach(u => {
                try { URL.revokeObjectURL(u); } catch { }
            });
        };
    }, [reviews]);




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

                        <h1 className='text-4xl pl-85 pt-5'>{userinfo?.username}</h1>
                        {/* <h2 className='text-md pl-85 pt-1'>Description</h2> */}


                    </div>

                </div>

            </div>

            <div className="divider">


            </div>



            <h1 className='text-2xl mb-6'>
                Reviews from {userinfo?.username}
            </h1>


            <div className=' flex flex-col gap-10 max-w-2xl'>


                {reviews.map((review: any) => (
                    <div className='card bg-primary p-4 gap-4 '>

                        <div className='flex gap-3 items-center h-10' >

                            <div className='avatar'>

                                <div className=' w-14 rounded'>
                                <Link to={`/ProfilePage/${review.user.id}`}>

                                    <img src="https://i.pinimg.com/736x/93/c6/43/93c6433bbd4ec60a88b399d08f2f17f3.jpg" alt="" />
                                </Link>
                                </div>

                            </div>


                            <div className='flex flex-col h-full gap-1 '>

                                <h1 className='font-bold'>{review.user.userName}</h1>

                                <h2 className='text-sm text-accent'>
                                    {timeAgo.format(Date.parse(review.createdAt))}

                                </h2>


                            </div>




                        </div>

                        <Link className='' to={`/SingleReviewPage/${review.reviewId}`}>
                    
                        <div className='px-1'>

                            <img className='rounded-xl' src={imageUrls[review.reviewId]} alt="" />
                        </div>
                        </Link>
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



        </div>

    )
}

export default ProfilePage