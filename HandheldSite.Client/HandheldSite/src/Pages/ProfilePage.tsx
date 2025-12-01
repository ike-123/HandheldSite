import TimeAgo from 'javascript-time-ago';
import React, { useEffect, useState } from 'react'
import en from 'javascript-time-ago/locale/en'
import { useMainStore } from '../Stores/MainStore';
import { useNavigate, useParams } from 'react-router-dom';

import NotLikedHeart from '../../public/Not-Liked-Heart.png'
import LikedHeart from '../../public/Liked-Heart.png'
import { Link } from 'react-router-dom';
import ImageUrl from './Components/ImageUrl';
import ReviewComponent from './Components/ReviewComponent';
import ProfileImageUrl from './Components/ProfileImageUrl';

const ProfilePage = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();


    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo('en-GB')

    const GetReviewsForUser = useMainStore((state) => state.GetReviewsByUser);
    const GetUserProfile = useMainStore((state) => state.GetUserProfile);



    const ToggleLike = useMainStore((state) => state.ToggleLikeButton);
    const SubmitProfileChange = useMainStore((state) => state.SubmitProfileChange);


    const [reviews, SetReviews] = useState<any[]>([]);
    const [userinfo, SetUserInfo] = useState<any>();
    const [imageUrls, setImageUrls] = useState<Record<number, string>>({});


    const [newUpdatedProfile, SetUpdatedProfileImage] = useState<File | null>(null);
    const [previewProfile, SetPreviewProfile] = useState<string | null>(null);
    const [username, SetUserName] = useState<any | null>();






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

            SetUserName(data.username);
        }


        if (id) {
            Get_User_Profile(id);
            Get_Reviews_for_User(id);
        }

    }, [])


    // useEffect(() => {
    //     reviews.forEach((review: any) => {
    //         if (!review.primaryImage || imageUrls[review.reviewId]) return;

    //         // // 1) already a data URL string (e.g. "data:image/png;base64,...")
    //         // if (typeof review.primaryImage === 'string' && review.primaryImage.startsWith('data:')) {
    //         //     setImageUrls(prev => ({ ...prev, [review.reviewId]: review.primaryImage }));
    //         //     return;
    //         // }

    //         // 2) plain base64 string without prefix
    //         if (typeof review.primaryImage === 'string') {
    //             const dataUrl = `data:image/jpeg;base64,${review.primaryImage}`;
    //             setImageUrls(prev => ({ ...prev, [review.reviewId]: dataUrl }));
    //             return;
    //         }

    //         if (typeof review.primaryImage === 'string') {
    //             const dataUrl = `data:image/jpeg;base64,${review.primaryImage}`;
    //             setImageUrls(prev => ({ ...prev, [review.reviewId]: dataUrl }));
    //             return;
    //         }



    //         // // 3) numeric byte array or { data: number[] } from EF/JSON
    //         // const bytes = review.primaryImage.data ?? review.primaryImage;
    //         // const uint8 = new Uint8Array(bytes);
    //         // const blob = new Blob([uint8], { type: 'image/png' }); // adjust mime type if needed
    //         // const url = URL.createObjectURL(blob);
    //         // setImageUrls(prev => ({ ...prev, [review.reviewId]: url }));
    //     });
    //     // revoke created URLs on unmount to avoid memory leaks
    //     return () => {
    //         Object.values(imageUrls).forEach(u => {
    //             try { URL.revokeObjectURL(u); } catch { }
    //         });
    //     };
    // }, [reviews]);




    function HandleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {

        console.log(event.target.files);
        const file = event.target.files?.[0];
        if (file) {
            SetUpdatedProfileImage(file);
            SetPreviewProfile(URL.createObjectURL(file));
        }
    }


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

    function ChangeUsername(event: React.ChangeEvent<HTMLInputElement>) {

        SetUserName(event.target.value);
    }

    function handleModalClose() {
        
        SetUserName(userinfo.username);
        SetUpdatedProfileImage(null);
        SetPreviewProfile(null);

        // you can run any code here
    }



    async function SubmitChangeProfile() {

        const formData = new FormData();

        if (username) {
            formData.append("username", username.toString());
        }
        if (newUpdatedProfile) {
            formData.append("profileimage", newUpdatedProfile);
        }

        console.log(formData);

        await SubmitProfileChange(formData);
        navigate(0);
    }



    return (

        <div className='flex-col flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center'>

            <div className='w-full'>

                {/* Profile and details section */}

                <div className='relative flex flex-col  '>
                    {/* background image */}
                    <img className="h-50 w-full object-cover" src="https://4kwallpapers.com/images/wallpapers/glossy-abstract-3840x2160-9602.jpg" alt="" />

                    <div className='avatar left-20 -bottom-30 absolute' >

                        <div className=" ring-primary ring-offset-base-100 w-60 rounded-full ring-3 ring-offset-3">
                            {/* profile image */}
                            <ProfileImageUrl TailwindStyles='' image={userinfo?.profileImage} />

                        </div>


                    </div>

                </div>

                <div className='flex flex-col'>

                    <div className='bg-primary w-full h-35 flex flex-col '>

                        <h1 className='text-4xl pl-85 pt-5'>{userinfo?.username}</h1>
                        {/* <h2 className='text-md pl-85 pt-1'>Description</h2> */}




                        <div className='w-50 mt-auto pl-85'>

                            {/* Open the modal using document.getElementById('ID').showModal() method */}
                            <button className="btn  bg-accent w-27 mb-2" onClick={() => (document.getElementById('my_modal_2') as HTMLDialogElement | null)?.showModal()}>Edit Profile</button>

                            <dialog id="my_modal_2" onClose={handleModalClose} className="modal">

                                <div className="modal-box flex flex-col gap-10">

                                    <div className='flex-row flex gap-4'>

                                        <label className='text-xl font-bold' htmlFor="username">Username</label>
                                        <input className='  focus:outline-none border-1 rounded p-1 border-accent' name='username' id='username' placeholder='Username' type="text" value={username} onChange={ChangeUsername} />
                                    </div>


                                    {/* Change Profile */}

                                    <div className='flex-row flex gap-8'>

                                        {
                                            previewProfile

                                                ? <img className='w-20 rounded-sm' src={previewProfile!} alt="" />
                                                : <ImageUrl TailwindStyles='w-20 rounded-sm' image={userinfo?.profileImage} />
                                        }

                                        <div className='flex items-center'>
                                            <label htmlFor="file" className="btn w-35 rounded-lg bg-primary border-gray-500 cursor-pointer"> Change Photo </label>
                                            <input id="file" type="file" className="hidden" onChange={HandleImageSelect} />

                                        </div>
                                    </div>


                                    <div className='flex justify-end'>

                                        <button onClick={SubmitChangeProfile} className='btn bg-accent'>Update</button>


                                    </div>

                                </div>

                                <form method="dialog" className="modal-backdrop">
                                    <button>close</button>
                                </form>
                            </dialog>


                        </div>

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
                    <ReviewComponent review={review} />
                ))}

            </div>



        </div>

    )
}

export default ProfilePage