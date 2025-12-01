import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../Stores/AuthStore';
import axios from 'axios';

const Register = () => {

    const Register = useAuthStore((state) => state.Register)
    const navigate = useNavigate();

    const [input, setInput] = useState({
        email: "",
        password: ""
    });

    const [errorText, SetErrorText] = useState("");


    function OnChangeInput(event: React.ChangeEvent<HTMLInputElement>) {

        setInput(previous => ({ ...previous, [event.target.name]: event.target.value }));
    }

    async function RegisterButton(event: React.MouseEvent<HTMLButtonElement>) {

        event.preventDefault();

        try {
            await Register(input.email, input.password);

            navigate("/Login")

        } catch (error) {

            if (axios.isAxiosError(error)) {

                SetErrorText(error.response?.data);
            };
        }
    }

    return (
        <div>

            {/* <form action="">
            <h1>Sign up</h1>
            <input required type="text" name='email' value={input.email} placeholder='Email' autoComplete='off' onChange={OnChangeInput}/>
            <input required type="text" name='password' value={input.password} placeholder='Password' autoComplete='off' onChange={OnChangeInput}/>
            <button onClick={RegisterButton}>Sign up</button>

            <p>Have an account? <Link to="/Login">Login</Link> </p>
        </form> */}

            <div>

                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            alt="Your Company"
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                            className="mx-auto h-10 w-auto"
                        />
                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Create an account</h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form action="#" method="POST" className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        onChange={OnChangeInput}
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
                                        Password
                                    </label>

                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        onChange={OnChangeInput}
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={RegisterButton}
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                >
                                   Create Account
                                </button>
                            </div>
                        </form>

                        {errorText && <p className="text-center mt-5 font-bold text-red-400">{errorText}</p>}

                        <p className="mt-10 text-center text-sm/6 text-gray-400">
                            Have an account?{' '}
                            <Link to={"/Login"} className="font-semibold text-indigo-400 hover:text-indigo-300">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register