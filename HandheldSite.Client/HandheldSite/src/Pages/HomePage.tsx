import React, { useEffect, useState } from 'react'
import { useMainStore } from '../Stores/MainStore'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const HomePage = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const sort = searchParams.get("sort") ?? "recent";

    const [Handhelds,SetHandhelds] = useState([]);
    const [currentHandheldId,SetSelected] = useState<number | undefined>(undefined);

    const [reviews, SetReviews] = useState<any[]>([]);


    // IT WILL BE BETTER IF HANDHELD SELECTION AND SORT PANEL IS ON THE LEFT-HAND SIDE WITH THE PROFILE PANEL JUST UNDER IT.

    //Don't get random reviews but get the reviews for only the hadheld selected. This is so that there can always be 
    // a panel on the right hand side that shows you the specs of the currently selected handheld.
    //If the user wants to select all they can choose to do so.
    
    const GetReviewforHandheld = useMainStore((state) => state.GetReviewsForHandheld);
    const GetMyProfile = useMainStore((state)=> state.GetMyProfile);
    const GetHandhelds = useMainStore((state)=> state.GetAllHandhelds);
    const ToggleLike = useMainStore((state)=> state.ToggleLikeButton);



    const selectedHandheld:any = Handhelds.find((handheld: any) => handheld.handheldId === currentHandheldId);

    useEffect(()=>{


        async function Get_All_Handhelds(){

            const {data} = await GetHandhelds();
            console.log(data);    
            
            console.log("initial")

            SetHandhelds(data);
 

       }


        Get_All_Handhelds();

    },[])


    useEffect(()=>{


        //left of the screen will be profile and another tab below that idk 
        // (maybe takes you to compare page? If it's not too much work)

        async function Get_My_Profile(){

            console.log("run");

            const {data} = await GetMyProfile();
            console.log(data);     

       }

        async function Get_Reviews_for_Handheld(id: number, sortBy:string){

            const {data} = await GetReviewforHandheld(Number(id),sortBy);
            
            SetReviews(data);  
       }



       Get_My_Profile();

       if(id){
            SetSelected(parseInt(id));
            Get_Reviews_for_Handheld(parseInt(id),sort);
       }


         

       


    },[id])


    async function ToggleLikeButton(reviewid:number) {
    
    var rev = 1;
      const {data} = await ToggleLike(rev);
      const ReturnedId = data.reviewId;
      const likestatus = data.likestatus;


      SetReviews(previous => previous.map((review)=>
        review.reviewId === ReturnedId ? {...review, isLiked:likestatus}:review

      ));

      console.log(ReturnedId);





    }

  return (
    <div>

        <select value={currentHandheldId} onChange={(event)=>{const newId = event.target.value; navigate(`/${newId}`); }}>

            {
                Handhelds.map((handheld:any)=>(

                    <option key={handheld.handheldId} value={handheld.handheldId} > {handheld.handheldName}</option>

                ))
            }

        </select>

        <select value={sort} onChange={(e) => navigate(`?sort=${e.target.value}`)}>
            
            <option value="recent">Most Recent</option>
            <option value="likes">Most Liked</option>
        </select>


        <div>

            {reviews.map((review:any)=>(
                <div>
                    <p>
                        {review.reviewText}
                    </p>
                </div>
            ))}
        </div>

        <div>

            {selectedHandheld && 

            <h1>
                The name is {selectedHandheld.handheldName}

            </h1>
            }
        </div>



            <button onClick={()=>{ToggleLikeButton(1)}}>Toggle Like</button>


            <div>
                <form action="">

                    <input type="text" name='reviewText' placeholder='Type your Review' autoComplete='off' />
                    <button>Submit Review</button>
                </form>
            </div>


    </div>
  )
}

export default HomePage