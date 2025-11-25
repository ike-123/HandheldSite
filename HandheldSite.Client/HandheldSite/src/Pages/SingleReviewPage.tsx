import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMainStore } from '../Stores/MainStore';

const SingleReviewPage = () => {

    //reviewid
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [PageContent,SetPageContent] = useState<any>();

    //returns review as well as informtiaon user info and like status
    const GetPageInfo = useMainStore((state) => state.GetReview);



    useEffect(()=>{
        
        async function Get_Page_Info(reviewId:number) {
            
            const {data} = await GetPageInfo(reviewId);
            
            console.log(data);
        }

        if(id)
        {
            Get_Page_Info(parseInt(id));

        }

    },[id])
    



  return (
    <div>SingleReviewPage</div>
  )
}

export default SingleReviewPage