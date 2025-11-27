import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMainStore } from '../Stores/MainStore';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'


const SingleReviewPage = () => {

    //reviewid
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [PageContent, SetPageContent] = useState<any>();

    TimeAgo.addDefaultLocale(en)
    const timeAgo = new TimeAgo('en-GB')

    //returns review as well as informtiaon user info and like status
    const GetPageInfo = useMainStore((state) => state.GetReview);

    const ToggleLike = useMainStore((state) => state.ToggleLikeButton);
    


    useEffect(() => {

        async function Get_Page_Info(reviewId: number) {

            const { data } = await GetPageInfo(reviewId);

            console.log(data);
            SetPageContent(data);
        }

        if (id) {
            Get_Page_Info(parseInt(id));

        }

    }, [id])




    async function ToggleLikeButton(reviewid: number) {


        //only allow user to like if logged in. If not logged in then send toast error.

        const { data } = await ToggleLike(reviewid);
        const ReturnedId = data.reviewId;
        const likestatus = data.likestatus;



        SetPageContent((previous:any)=>({...previous,isLiked:likestatus}));

        // SetReviews(previous => previous.map((review) =>
        //     review.reviewId === ReturnedId ? { ...review, isLiked: likestatus } : review
        // ));

        console.log(ReturnedId);
    }





    return (
        <div className='flex flex-col px-4 sm:px-6 lg:px-8. max-w-5xl mx-auto gap-5'>

            <div className="stats shadow">

                <div className="stat">
                    <div className="stat-title">Steam Deck</div>
                    <img className='max-w-50' src="https://cdn.fastly.steamstatic.com/steamdeck/images/press/renderings/rendering07.png" alt="" />
                    {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
                </div>

                <div className="stat">
                    <div className="stat-title">Release Date</div>
                    <div  className="stat-value text-xl">22 Feb 2022</div>
                    {/* <div className="stat-desc">↗︎ 400 (22%)</div> */}
                </div>
                <div className="stat">
                    <div className="stat-title">Processor</div>
                    <div className="stat-value text-xl"> AMD Van Gogh</div>
                    {/* <div className="stat-desc">↗︎ 400 (22%)</div> */}
                </div>
                <div className="stat">
                    <div className="stat-title">Display</div>
                    <div className="stat-value text-xl">7" LCD</div>
                    {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
                </div>



            </div>




            <div className=' self-center flex flex-col w-9/12'>



                <img className='w-full h-100 self-center object-cover' src="https://www.gameshub.com/wp-content/uploads/sites/5/2024/10/steam-deck-australia-review.jpg" alt="" />


                {/* user info */}
                <div className='flex gap-2 items-center mb-2.5'>

                    <div className='avatar flex gap-3 items-center font-bold mb-1' >

                        <img className='w-15 rounded-xl' src="https://assets.promptbase.com/DALLE_IMAGES%2FSB1PjLah85MVrYwvUct7urDoTXf2%2Fresized%2F1692612767503z_800x800.webp?alt=media&token=264e0f3a-2661-4347-a7be-b56d4a5afdfa" alt="" />

                    </div>

                    <div>
                        <h1 className='text-3xl'>{PageContent?.user.userName}</h1>

                        <h1 className='text-md text-accent'>

                            {PageContent ? timeAgo.format(Date.parse(PageContent?.createdAt)) : ""}


                        </h1>
                    </div>

                </div>

               
                
                {PageContent?.isLiked 
                
                    ? <button className='btn bg-green-400 w-20' onClick={() => { ToggleLikeButton(PageContent?.reviewId) }}>Toggle Like</button>

                    : <button className='btn bg-red-400 w-20' onClick={() => { ToggleLikeButton(PageContent?.reviewId) }}>Toggle Like</button>

                }


                {/* review Text */}

                <div className='mt-10'>

                    <p>
                        {PageContent?.reviewText}
                    </p>

                </div>






            </div>





        </div>
    )
}

export default SingleReviewPage