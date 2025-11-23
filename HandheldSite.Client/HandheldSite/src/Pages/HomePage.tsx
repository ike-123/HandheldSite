import React, { useEffect } from 'react'
import { useMainStore } from '../Stores/MainStore'
import { useParams } from 'react-router-dom';

const HomePage = () => {

    const { id } = useParams<{ id: string }>();

    //Don't get random reviews but get the reviews for only the hadheld selected. This is so that there can always be 
    // a panel on the right hand side that shows you the specs of the currently selected handheld.
    //If the user wants to select all they can choose to do so.
    const GetRandomReviews = useMainStore((state) => state.GetRandomReviews);
    const GetReviewforHandheld = useMainStore((state) => state.GetReviewsForHandheld);



    useEffect(()=>{

        //left of the screen will be profile and another tab below that idk 
        // (maybe takes you to compare page? If it's not too much work)

        async function Get_Reviews_for_Handheld(){

     
            const {data} = await GetReviewforHandheld(Number(id));

            console.log(data);
            
       }

        //centre of the screen
       async function GetRand_Reviews(){

        const {data} = await GetRandomReviews();

        console.log(data);
       }

    //    GetRand_Reviews();
       Get_Reviews_for_Handheld();

    },[])

  return (
    <div>HomePage</div>
  )
}

export default HomePage