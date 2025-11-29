import TimeAgo from 'javascript-time-ago';
import React, { useEffect, useState } from 'react'
import en from 'javascript-time-ago/locale/en'
import { useMainStore } from '../Stores/MainStore';
import NotLikedHeart from '../../public/Not-Liked-Heart.png'
import LikedHeart from '../../public/Liked-Heart.png'
import { Link } from 'react-router-dom';


const LikedReviews = () => {


    const [reviews, SetReviews] = useState<any[]>([]);

    const ToggleLike = useMainStore((state) => state.ToggleLikeButton);
    const GetLikedReviews = useMainStore((state) => state.GetLikedReviews);


    const [imageUrls, setImageUrls] = useState<Record<number, string>>({});
    


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
                    <Link className='' to={`/SingleReviewPage/${review.reviewId}`}>


                    <div className='px-1'>

                        <img className='rounded-xl'  src={imageUrls[review.reviewId]}  alt="" />
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
    )
}

export default LikedReviews