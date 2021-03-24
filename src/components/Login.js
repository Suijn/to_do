import React, { useState, useEffect } from 'react';
import '../styles/Register.css';
import {Link, Redirect} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux'
import {login} from '../actions/authActions'
import {clearErrors} from '../actions/errorActions'

const Login = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const error = useSelector(state => state.error)
    const dispatch = useDispatch()

    const [user, setUser] = useState({
        username: '',
        password: '',
    })
    const [errors, setErrors] = useState([])

    useEffect(() => {
        const arr = []
        for(let key in error.msg) {
            let err = error.msg[key]
            arr.push(err)
        }
        setErrors(arr)
    }, [error])

    const handleUsernameChange = (e) =>{
        var value = e.target.value;

        setUser({
            ...user, username:value
        })
    }

    const handlePasswordChange = (e) =>{
        var value = e.target.value;

        setUser({
            ...user, password:value
        })
    }

    const handleSubmit = (e) =>{
        dispatch(clearErrors())
        e.preventDefault();

        dispatch(login(user))
    }

    return(
        
        <div id='container'>
            <div id='form'>
                {isAuthenticated ? 
                    <Redirect to='/home'></Redirect>
                : null
                }
                {errors ? 
                    errors.map((err) => {
                        return <div className='alert-wrapper'> 
                            <span className='text-span'> {err} </span>
                        </div>
                    })
                : null
                }
                <form id='form-wrap' onSubmit={handleSubmit}>
                    <div className='input-wrap'>
                        <input maxLength={20} onChange={handleUsernameChange} value={user.username} placeholder='username'/>
                    </div>
                    <div className='input-wrap'>
                        <input maxLength={20} type='password' onChange={handlePasswordChange} value={user.password} placeholder='password '/>
                    </div>
                    
                    <button id='submit-btn'>Login</button>
                </form>

                <Link onClick={() => clearErrors()} to="/" style={{textDecoration:'none', outline:'none'}}>
                    <div id='form-footer'>
                        <div id='span-wrapper'>
                            <span className='footer-span'>Don't have an account?</span>
                            <span className='footer-span'>Click here to sign up!</span>
                        </div>
                    </div>
                </Link>
                
                
            </div>
        
        </div>
    )
}

export default Login