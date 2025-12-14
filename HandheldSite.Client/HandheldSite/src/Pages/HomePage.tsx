import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import processor from '../../public/processor.png'

import Upload from '../../public/Upload.png'


import Delete from '../../public/delete.png'
import GPU from '../../public/gpu.png'
import memory from '../../public/memory.png'
import battery from '../../public/battery.png'
import display from '../../public/display.png'
import cpu from '../../public/cpu.png'



import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'
import ReviewComponent from './Components/ReviewComponent';
import ImageUrl from './Components/ImageUrl';
import toast from 'react-hot-toast';
import ProfileImageUrl from './Components/ProfileImageUrl';
import TextareaAutosize from 'react-textarea-autosize';
import { useAuthStore } from '../Stores/AuthStore';
import { useMainStore } from '../Stores/MainStore'



TimeAgo.addDefaultLocale(en)

const HomePage = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const sort = searchParams.get("sort") ?? "recent";

    const [Handhelds, SetHandhelds] = useState([]);
    const [currentHandheldId, SetSelected] = useState<number | undefined>(undefined);

    const [reviews, SetReviews] = useState<any[]>([]);

    const [userReview, SetUserReview] = useState<string>("");
    const [reviewImage, SetReviewImage] = useState<File | null>(null);

    const [previewPicture, SetPreviewPicture] = useState<string | null>(null);




    // IT WILL BE BETTER IF HANDHELD SELECTION AND SORT PANEL IS ON THE LEFT-HAND SIDE WITH THE PROFILE PANEL JUST UNDER IT.

    //Don't get random reviews but get the reviews for only the hadheld selected. This is so that there can always be 
    // a panel on the right hand side that shows you the specs of the currently selected handheld.
    //If the user wants to select all they can choose to do so.

    const GetReviewforHandheld = useMainStore((state) => state.GetReviewsForHandheld);
    const GetMyProfile = useMainStore((state) => state.GetMyProfile);
    const GetHandhelds = useMainStore((state) => state.GetAllHandhelds);
    // const ToggleLike = useMainStore((state) => state.ToggleLikeButton);
    const SubmitReview = useMainStore((state) => state.CreateReview);
    const UserDetails = useAuthStore((state) => state.user);
    const LoggedIn = useAuthStore((state) => state.loggedIn);





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

    }, [id,sort])

    function ChangeUserReviewValue(event: any) {

        if (LoggedIn) {
            console.log(event.target.value);
            SetUserReview(event.target.value);
        }
        else {
            toast.dismiss();
            toast.error("You must Login to write a review")
        }

    }

    function HandleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {

        console.log(event.target.files);
        const file = event.target.files?.[0];
        if (file) {
            SetReviewImage(file);
            SetPreviewPicture(URL.createObjectURL(file));
        }
    }

    function RemoveUploadedPicture() {


        SetReviewImage(null);
        SetPreviewPicture(null);

        // you can run any code here
    }

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



    async function SubmitReviewButton() {

        if (LoggedIn) {
            const formData = new FormData();

            if (userReview == "") {
                toast.dismiss();
                toast.error("Text is required");
                return;
            }

            formData.append("HandheldId", currentHandheldId!.toString());
            formData.append("ReviewText", userReview);
            if (reviewImage) {
                formData.append("PrimaryImage", reviewImage);
            }



            await SubmitReview(formData);
        }
        else {
            toast.error("You must Login to post a review");
        }

    }


    return (

        <div className='flex px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto gap-5'>



            {/* Middle Section */}

            <div className=' flex flex-col gap-4 flex-2 min-w-0'>

                <div className='bg-white/15 backdrop-blur-sm border-b border-white/30 h-12 flex gap-10 items-center justify-around w-full sticky top-0 z-10'>


                    <div className='flex gap-2 flex-row items-center'>

                        <legend className="fieldset-legend text-xs m-0">Handheld:</legend>
                        <select className="select select-sm select-accent/10 focus:ring-0 focus:out" value={currentHandheldId} onChange={(event) => { const newId = event.target.value; navigate(`/home/${newId}`); }}>

                            {
                                Handhelds.map((handheld: any) => (

                                    <option key={handheld.handheldId} value={handheld.handheldId} > {handheld.handheldName}</option>

                                ))
                            }

                        </select>
                        
                    </div>


                    <div className='flex gap-2'>

                        <legend className="fieldset-legend whitespace-nowrap text-xs m-0">Sort by:</legend>

                        <select className="select select-sm" value={sort} onChange={(e) => navigate(`?sort=${e.target.value}`)}>

                            <option value="recent">Most Recent</option>
                            <option value="likes">Most Liked</option>
                        </select>
                    </div>



                </div>

                <div className='card bg-base-200 p-4 flex flex-col border border-base-content/30'>

                    {
                        previewPicture

                            ?

                            <div className='flex self-center gap-1 flex-row'>
                                <img className='object-cover h-30 w-50  rounded' src={previewPicture!} alt="preview Image" />


                                <button className="btn h-8 self-center w-8 rounded-full bg-red-400 cursor-pointer p-1" onClick={RemoveUploadedPicture}>
                                    <img className=' ' src={Delete} alt="" />
                                </button>


                            </div>

                            :

                            ""
                    }


                    <div className='avatar flex gap-3 font-bold mb-1' >

                        <ProfileImageUrl TailwindStyles='w-12 h-12 rounded-xl' image={UserDetails?.profileImage} />
                        {/* <form className="w-full" action="">

                            <input className="w-full h-8 outline-1" type="text" name='reviewText' placeholder='Write your Review' autoComplete='off' value={userReview}  onChange={ChangeUserReviewValue} />
                        </form> */}

                        <TextareaAutosize className='p-1 self-center focus:outline-none resize-none border-2 rounded border-gray-800 w-full' autoComplete='off' placeholder={`Write a Review for the ${selectedHandheld?.handheldName}`} value={userReview} onChange={ChangeUserReviewValue} />



                    </div>

                    <div className='flex'>


                        {/* <button className='btn w-15 ml-14 rounded-2xl bg-emerald-400'>Photo</button> */}
                        <div className='btn btn-accent w-22 ml-14 rounded-2xl cursor-pointer'>
                            <img src={Upload} className='h-5 cursor-pointer ' alt="" />
                            
                            <label htmlFor="file" className="cursor-pointer"> Upload </label>
                            <input id="file" type="file" className="hidden" onChange={HandleImageSelect} />

                        </div>
                        <button onClick={SubmitReviewButton} className='btn btn-secondary w-15 ml-auto'>Submit</button>

                    </div>

                </div>


                {reviews.map((review: any) => (

                    <ReviewComponent review={review} />

                ))}


            </div>

            {/* Right Section */}

            <div className='card rounded-none bg-base-200 flex flex-1 min-w-0 px-2 sticky top-0 h-screen'>

                {selectedHandheld &&

                    <>
                        <div className='max-w-full'>

                            <div className=''>
                                {/* <img className=' w-full h-45 object-cover mx-auto' src={selectedHandheld.handheldImg} alt="" /> */}
                                <ImageUrl TailwindStyles='w-full h-45 object-cover mx-auto' image={selectedHandheld.handheldImg}/>
                            </div>

                            <h1 className='font-bold text-2xl mb-1.5 text-base-content'>

                                {selectedHandheld.handheldName}

                            </h1>

                            <h2 className='mb-1 text-base-content'>
                                {selectedHandheld.description}
                            </h2>

                        </div>


                        <div className='px-3 flex flex-col gap-5 mt-2.5'>

                            <div className='card bg-primary flex-row items-center gap-1.5 pl-2.5 py-1'>

                                <img src={processor} className='h-6' alt="" />

                                <div className='text-primary-content'>
                                    <p className='text-sm'>Processor</p>
                                    <p className='font-bold'> {selectedHandheld.processor}</p>
                                </div>


                            </div>

                            <div className='card bg-primary flex-row items-center gap-1.5 pl-2.5  py-1 '>

                                <img src={cpu} className='h-6' alt="" />

                                 <div className='text-primary-content'>
                                    <p className='text-sm'>CPU</p>
                                    <p className='font-bold'> {selectedHandheld.cpu}</p>
                                </div>


                            </div>


                            <div className='card bg-primary flex-row items-center gap-1.5 pl-2.5  py-1'>

                                <img src={GPU} className='h-6' alt="" />

                                  <div className='text-primary-content'>
                                    <p className='text-sm'>GPU</p>
                                    <p className='font-bold'> {selectedHandheld.gpu}</p>
                                </div>


                            </div>


                            <div className='card bg-primary flex-row items-center gap-1.5 pl-2.5  py-1'>

                                <img src={memory} className='h-6' alt="" />

                                <div className='text-primary-content'>
                                    <p className='text-sm'>RAM</p>
                                    <p className='font-bold'> {selectedHandheld.ram}</p>
                                </div>


                            </div>


                            <div className='card bg-primary flex-row items-center gap-1.5 pl-2.5  py-1'>

                                <img src={display} className='h-6' alt="" />

                                 <div className='text-primary-content'>
                                    <p className='text-sm'>Display</p>
                                    <p className='font-bold'> {selectedHandheld.display}</p>
                                </div>


                            </div>

                            <div className='card bg-primary flex-row items-center gap-1.5 pl-2.5  py-1'>

                                <img src={battery} className='h-6' alt="" />

                                 <div className='text-primary-content'>
                                    <p className='text-sm'>Battery</p>
                                    <p className='font-bold'> {selectedHandheld.battery}</p>
                                </div>


                            </div>

                        </div>


                    </>

                }
            </div>

        </div>
    )
}

export default HomePage