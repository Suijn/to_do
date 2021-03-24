import React, { useState, useEffect, useRef} from 'react';
import '../styles/Register.css';
import {Link, Redirect} from "react-router-dom";
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux'
import {register} from '../actions/authActions'
import {clearErrors} from '../actions/errorActions'




const Register = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const error = useSelector(state => state.error)
    const dispatch = useDispatch()

    const [user, setUser] = useState({
        username: '',
        password: '',
    })
    const [errors, setErrors] = useState([])
    
    useEffect(() =>{
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

        dispatch(register(user))
    }

    return(
        <div id='container'>
            <div id='form' onSubmit={handleSubmit}>
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
                    <form id='form-wrap'>
                        <div className='input-wrap'>
                            <input maxLength={20} onChange={handleUsernameChange} value={user.username} placeholder='username'/>
                        </div>
                        <div className='input-wrap'>
                            <input maxLength={20} type='password' onChange={handlePasswordChange} value={user.password} placeholder='password '/>
                        </div>

                        <button id='submit-btn'>Sign up</button>
                    </form>
                <Link onClick={() => dispatch(clearErrors())} to="/login" style={{textDecoration:'none', outline:'none'}}>
                    <div id='form-footer'>
                        <div id='span-wrapper'>
                            <span className='footer-span'>Already have an account?</span>
                            <span className='footer-span'>Click here to log in!</span>
                        </div>
                    </div>
                </Link>
                
                
            </div>
        
        </div>
    )
}

export default Register