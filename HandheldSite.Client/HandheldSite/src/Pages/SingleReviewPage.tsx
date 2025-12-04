import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useMainStore } from '../Stores/MainStore';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

import NotLikedHeart from '../../public/Not-Liked-Heart.png'
import LikedHeart from '../../public/Liked-Heart.png'
import ImageUrl from './Components/ImageUrl';
import ProfileImageUrl from './Components/ProfileImageUrl';
import { useAuthStore } from '../Stores/AuthStore';
import toast from 'react-hot-toast';

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-GB')

const SingleReviewPage = () => {

    //reviewid
    const { id } = useParams<{ id: string }>();
    // const navigate = useNavigate();

    const [PageContent, SetPageContent] = useState<any>();

    // const [imageUrl, setImageUrl] = useState<string>();
    

    // const [ProfileImageUrl, setProfileImageUrl] = useState<string>();





    //returns review as well as informtiaon user info and like status
    const GetPageInfo = useMainStore((state) => state.GetReview);

    const ToggleLike = useMainStore((state) => state.ToggleLikeButton);
    const LoggedIn = useAuthStore((state)=> state.loggedIn)



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


          if (LoggedIn) {

            const { data } = await ToggleLike(reviewid);
            const likestatus = data.likestatus.likestatus;
            const likecount = data.likestatus.likecount;

            console.log(data);

            console.log("hey");

            SetPageContent((previous: any) => ({ ...previous, isLiked: likestatus, likeCount: likecount }));

        }
        else {
            toast.dismiss()
            toast.error("You must Login to Like a post")
        }
    }





    return (
        <div className='flex-col flex w-full mx-auto px-4 sm:px-6 lg:px-8 items-center'>


            {/* <div className="stats shadow">

                <div className="stat">
                    <div className="stat-title">Steam Deck</div>
                    <img className='max-w-50' src="https://cdn.fastly.steamstatic.com/steamdeck/images/press/renderings/rendering07.png" alt="" />

                </div>

                <div className="stat">
                    <div className="stat-title">Release Date</div>
                    <div className="stat-value text-xl">22 Feb 2022</div>

                </div>
                <div className="stat">
                    <div className="stat-title">Processor</div>
                    <div className="stat-value text-xl"> AMD Van Gogh</div>

                </div>
                <div className="stat">
                    <div className="stat-title">Display</div>
                    <div className="stat-value text-xl">7" LCD</div>

                </div>

            </div> */}




            <div className=' self-center flex flex-col w-9/12'>

                <ImageUrl TailwindStyles='w-full h-100 self-center object-cover mb-4' image={PageContent?.primaryImage} />


                {/* user info */}
                <div className='flex gap-2 items-center mb-2.5'>

                    <div className='avatar flex gap-3 items-center font-bold mb-1' >

                        <Link to={`/ProfilePage/${PageContent?.userId}`}>
                            <ProfileImageUrl TailwindStyles='w-15 h-15 highlight-ring-rounded' image={PageContent?.user.profileImage} />

                        </Link>

                    </div>

                    <div>
                        <h1 className='text-3xl'>{PageContent?.user.userName}</h1>

                        <h1 className='text-md text-accent'>

                            {PageContent ? timeAgo.format(Date.parse(PageContent?.createdAt)) : ""}


                        </h1>
                    </div>

                </div>



                <div className='flex items-center'>

                    {PageContent?.isLiked ?

                        <button className='button-hover-red' onClick={() => { ToggleLikeButton(PageContent?.reviewId) }}>
                            <img className='h-12 p-2' src={LikedHeart} alt="" />
                        </button>

                        :
                        <button className='button-hover-red' onClick={() => { ToggleLikeButton(PageContent?.reviewId) }}>
                            <img className='h-12 p-2' src={NotLikedHeart} alt="" />

                        </button>

                    }

                    <h1 className='text-3xl'>{PageContent?.likeCount}</h1>
                </div>
                {/* review Text */}

                <div className='mt-10'>

                    <p>
                        {PageContent?.reviewText}
                    </p>

                </div>

                <div className='h-20'>

                </div>






            </div>


        </div>
    )
}

export default SingleReviewPage