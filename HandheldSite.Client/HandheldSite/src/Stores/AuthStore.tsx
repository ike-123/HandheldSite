import type { AxiosInstance } from "axios";
import axios from "axios";
import { create } from "zustand";
import api_Refresh from '../utils/API_Refresh'


type AuthStore = {

    // token:number;
    Register: (email: string, password: string) => Promise<void>;
    Login: (email: string, password: string) => Promise<any>;
    Logout: () => Promise<void>;
    AuthPing: () => Promise<void>;
    user: any | null;
    loggedIn: boolean;


    // setAccessToken: ()=>Promise<void>;

}

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:5112/api/Auth/",
    withCredentials: true,
});

export const useAuthStore = create<AuthStore>((set) => ({

    user: null,
    loggedIn: false,

    async Register(email: string, password: string) {

        await api.post("Register", { email, password });

    },

    async Login(email: string, password: string) {

        try {
            
            const {data} = await api.post("Login", { email, password });

            set({ user: data, loggedIn: true });
            console.log(data);
            
        } catch (error) {

            set({ user: null, loggedIn: false });
            throw error;

        }

    },

    async Logout() {

        await api.get("Logout");

    },

    async AuthPing() {

        console.log("ping");
        try {
            const { data } = await api_Refresh.get("Auth/Ping", { withCredentials: true });

            set({ user: data, loggedIn: true });
            //console.log("User is loggged in");
            console.log(data);

        } catch (error) {
            
            set({ user: null, loggedIn: false });

        }
    },


})

)