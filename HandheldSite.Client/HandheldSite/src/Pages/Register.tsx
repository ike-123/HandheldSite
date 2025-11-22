import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {

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
    }

  return (
    <div>
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