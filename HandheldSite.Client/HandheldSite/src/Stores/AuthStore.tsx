import type { AxiosInstance } from "axios";
import axios from "axios";
import { create } from "zustand";

type AuthStore ={
    
    // token:number;
    Register: (email:string,password:string)=>Promise<void>;
    Login: (email:string,password:string)=>Promise<void>;
    Logout: (email:string,password:string)=>Promise<void>;


    // setAccessToken: ()=>Promise<void>;

}

const api: AxiosInstance = axios.create({
    baseURL: "",
    withCredentials: true,
});

export const useAuthStore = create<AuthStore>((set)=>({

    // token: 0,

    async Register(email:string, password:string) {
        
       await api.post("Register",{email,password});

    },

    async Login(email:string, password:string) {
        
        await api.post("Login",{email,password});

    },

    async Logout() {
        
        await api.get("Logout");

    },


})

)