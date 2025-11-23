import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../Stores/AuthStore';
import axios from 'axios';


const Login = () => {

    const Login = useAuthStore((state)=>state.Login)
    const navigate = useNavigate();

    const [input, setInput] = useState({
        email:"",
        password:""
    });

    const [errorText,SetErrorText] = useState("");
    

    function OnChangeInput(event: React.ChangeEvent<HTMLInputElement>){

        setInput(previous => ({...previous, [event.target.name]: event.target.value}) );
    }

    async function LoginButton(event:React.MouseEvent<HTMLButtonElement>) {
        
        event.preventDefault();

        try {
            await Login(input.email,input.password);

            navigate("/")

        } catch (error) {
            
            if(axios.isAxiosError(error)){
                
                SetErrorText(error.response?.data);
            };
        }
    }

  return (
    <div>
        <form action="">
            <h1>Login</h1>
            <input required type="text" name='email' placeholder='Email' autoComplete='off' onChange={OnChangeInput}/>
            <input required type="text" name='password' placeholder='Password' autoComplete='off' onChange={OnChangeInput}/>
            <button onClick={LoginButton}>Login</button>

            <p>Don't have an account? <Link to="/Login">Sign up</Link> </p>
        </form>
    </div>
  )
}

export default Login