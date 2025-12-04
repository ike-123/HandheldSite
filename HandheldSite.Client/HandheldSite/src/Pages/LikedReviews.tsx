import TimeAgo from 'javascript-time-ago';
import { useEffect, useState } from 'react'
import en from 'javascript-time-ago/locale/en'
import { useMainStore } from '../Stores/MainStore';
import ReviewComponent from './Components/ReviewComponent';


const LikedReviews = () => {


    const [reviews, SetReviews] = useState<any[]>([]);

    // const ToggleLike = useMainStore((state) => state.ToggleLikeButton);
    const GetLikedReviews = useMainStore((state) => state.GetLikedReviews);


    const [imageUrls, setImageUrls] = useState<Record<number, string>>({});
    


    TimeAgo.addDefaultLocale(en)
    // const timeAgo = new TimeAgo('en-GB')


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
    


    // async function ToggleLikeButton(reviewid: number) {

    //     const { data } = await ToggleLike(reviewid);
    //     const ReturnedId = data.reviewId;
    //     const likestatus = data.likestatus.likestatus;
    //     const LikeCount = data.likestatus.likecount;


    //     SetReviews(previous => previous.map((review) =>
    //         review.reviewId === ReturnedId ? { ...review, isLiked: likestatus, likeCount: LikeCount } : review

    //     ));

    //     console.log(ReturnedId);
    // }


    return (

        <div className='flex-col flex max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 items-center gap-5'>


            <h1 className='text-2xl'>Liked Reviews</h1>

            
            {reviews.map((review: any) => (
              <ReviewComponent review={review}/>
            ))}



        </div>
    )
}

export default LikedReviews