
import { create } from "zustand";
import api_Refresh from '../utils/API_Refresh'

type MainStore = {

    GetRandomReviews: () => Promise<any>;
    GetReview: (ReviewId: number) => Promise<any>;
    GetReviewsForHandheld: (HandheldId: number, sort: string) => Promise<any>;
    GetReviewsByUser: (UserId: string) => Promise<any>;
    CreateReview: (post: any) => Promise<any>;
    SubmitProfileChange: (post: any) => Promise<any>;
    GetMyProfile: () => Promise<any>;
    GetUserProfile: (userid: string) => Promise<any>;
    GetAllHandhelds: () => Promise<any>;
    ToggleLikeButton: (reviewId: number) => Promise<any>;
    GetLikedReviews: () => Promise<any>;

}



export const useMainStore = create<MainStore>((set) => ({


    async GetRandomReviews() {

        return await api_Refresh.get("Review/GetRandomReviews");

    },

    async GetReview(ReviewId: number) {

        return await api_Refresh.get(`Review/GetReview/${ReviewId}`);

    },

    async GetReviewsForHandheld(HandheldId: number, sort: string) {

        return await api_Refresh.get(`Review/GetReviewsForHandheld/${HandheldId}`,
            { params: { sort } }
        );

    },

    async GetReviewsByUser(userid: string) {

        return await api_Refresh.get(`Review/GetReviewsByUser/${userid}`);


    },

    async CreateReview(post: any) {

        await api_Refresh.post("Review/CreateReview", post, {

            headers: {
                "Content-Type": "multipart/form-data",
            }

        });

    },

    async SubmitProfileChange(post: any) {

        const {data} = await api_Refresh.post("Profile/UpdateProfile", post, {

            headers: {
                "Content-Type": "multipart/form-data",
            }

        });

        set( (previous) =>( { ...previous, profileImage: data.profileImage, username: data.username}));

        

    },


    async GetMyProfile() {

        return await api_Refresh.get(`Profile/GetMyProfile`);

    },

    async GetUserProfile(userid: string) {
        return await api_Refresh.get(`Profile/GetUserProfileinfo/${userid}`)
    },

    async GetAllHandhelds() {

        return await api_Refresh.get(`Handheld/GetAllHandhelds`)
    },

    async ToggleLikeButton(reviewId: number) {

        return await api_Refresh.get(`Review/ToggleLikeStatus`,
            { params: { reviewId } }
        )
    },

    async GetLikedReviews() {

        return await api_Refresh.get(`Review/GetLikedReviews`)

    },


})

)