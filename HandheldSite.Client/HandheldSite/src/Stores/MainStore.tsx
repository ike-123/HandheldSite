import  axios, { AxiosError, type AxiosInstance } from "axios";
import { create } from "zustand";

type MainStore ={

    GetRandomReviews: ()=>Promise<any>;
    GetReview: (ReviewId:number)=>Promise<any>;
    GetReviewsForHandheld: (HandheldId:number, sort:string)=>Promise<any>;
    GetReviewsByUser: (UserId:string)=>Promise<any>;
    CreateReview: (post:any)=>Promise<any>;
    GetMyProfile: ()=>Promise<any>;
    GetUserProfile: (userid:string)=>Promise<any>;
    GetAllHandhelds: ()=>Promise<any>;
    ToggleLikeButton:(reviewId:number)=>Promise<any>;
    GetLikedReviews:()=>Promise<any>;

}
type Post = {
    HandheldId:number,
    PrimaryImage:string,
    ReviewText:string
}

declare module 'axios' {
    export interface AxiosRequestConfig {
        _retry?: boolean;
    }
}

let isRefreshing = false;

let failedQueue: any[] = [];

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:5112/api/",
    withCredentials: true,
});

api.interceptors.request.use((config) => {

    //If no accessToken we will let the api request carry on and inevitably fail
    //and provide us a new access and refresh token if our refresh token is valid

    // if ( config.headers) {

    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
});

//loop through each failed request in the array and let them know if the request was successful
// if error we reject and if not we resolve and provide the access token we got from the refresh-token endpoint
function ProcessQueue(error: any, token: string | null = null) {

    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        }
        else {
            promise.resolve(token)
        }
    })

    failedQueue = [];
}


//api.interceptors.response.use takes in 2 functions 
//the first runs on success and the second runs on failure
api.interceptors.response.use((response) => response, async (error: AxiosError) => {

    const OriginalRequest = error.config!;

    //_retry prevents the same request from running twice.
    if (error?.response?.status === 401 && !OriginalRequest._retry) {

        if (isRefreshing) {

            return new Promise((resolve, reject) => {

                failedQueue.push({ resolve, reject });

            }).then(() => {
                // OriginalRequest.headers.Authorization = `Bearer ${token}`;
                return api(OriginalRequest);
            }).catch((err) => Promise.reject(err));
        }

        OriginalRequest._retry = true;
        isRefreshing = true;

        //run the refresh-token endpoint and if refresh token is valid
        //will send a new access and refresh token
        try {
            console.log("trying");
            const { data } = await axios.post(
                "http://localhost:5112/api/Auth/RefreshTokens",
                {},
                { withCredentials: true }

            );

            //If we get to here, the request has been a success and we have got our new tokens
            //Call the ProcessQueue function and pass null for error and accessToken.
            ProcessQueue(null);
            isRefreshing = false;

            // OriginalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return api(OriginalRequest);
        }

        catch (err) {

            //Request is unsuccessful. So we call the ProcessQueue function and pass err
            ProcessQueue(err);

            isRefreshing = false;

            return Promise.reject(err);
        }

    }

    return Promise.reject(error);

});


export const useMainStore = create<MainStore>((set)=>({

    async GetRandomReviews() {
        
       return await api.get("Review/GetRandomReviews");
       
    },

    async GetReview(ReviewId:number) {
        
       return await api.get(`Review/GetReview/${ReviewId}`);

    },

    async GetReviewsForHandheld(HandheldId:number, sort:string) {
        
       return await api.get(`Review/GetReviewsForHandheld/${HandheldId}`,
        {params: {sort}}
       );

    },

    async GetReviewsByUser(userid:string) {
        
       return await api.get(`Review/GetReviewsByUser/${userid}`);


    },

    async CreateReview(post:any) {
        
       await api.post("Review/CreateReview", post,{

          headers: {
            "Content-Type": "multipart/form-data",
          }
          
        });

    },

    async GetMyProfile() {
        
       return await api.get(`Profile/GetMyProfile`);

    },

    async GetUserProfile(userid:string){
        return await api.get(`Profile/GetUserProfileinfo/${userid}`)
    },

    async GetAllHandhelds() {
        
        return await api.get(`Handheld/GetAllHandhelds`)
    },

    async ToggleLikeButton(reviewId:number) {
        
        return await api.get(`Review/ToggleLikeStatus`,
            {params:{reviewId}}
        )
    },

    async GetLikedReviews() {
        
        return await api.get(`Review/GetLikedReviews`)

    }
    

})

)