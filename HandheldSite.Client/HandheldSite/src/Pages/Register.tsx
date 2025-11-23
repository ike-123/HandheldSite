import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../Stores/AuthStore';
import axios from 'axios';

const Register = () => {

    const Register = useAuthStore((state)=>state.Register)
    const navigate = useNavigate();

    const [input, setInput] = useState({
        email:"",
        password:""
    });

    const [errorText,SetErrorText] = useState("");
    

    function OnChangeInput(event: React.ChangeEvent<HTMLInputElement>){

        setInput(previous => ({...previous, [event.target.name]: event.target.value}) );
    }

    async function RegisterButton(event:React.MouseEvent<HTMLButtonElement>) {
        
        event.preventDefault();

        try {
            await Register(input.email,input.password);

            navigate("/Login")

        } catch (error) {
            
            if(axios.isAxiosError(error)){
                
                SetErrorText(error.response?.data);
            };
        }
    }

  return (
    <div>
        hey
        <form action="">
            <h1>Sign up</h1>
            <input required type="text" name='email' placeholder='Email' autoComplete='off' onChange={OnChangeInput}/>
            <input required type="text" name='password' placeholder='Password' autoComplete='off' onChange={OnChangeInput}/>
            <button onClick={RegisterButton}>Sign up</button>

            <p>Have an account? <Link to="/Login">Login</Link> </p>
        </form>
    </div>
  )
}

export default Register