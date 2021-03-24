import axios from 'axios';
import {getError} from './errorActions'
import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS, 
    LOGIN_FAIL,
    LOGOUT_SUCCESS, 
    REGISTER_SUCCESS,
    REGISTER_FAIL, 
} from "./types"
import {clearTasks} from './taskActions'

// check token and load user
export const loadUser = () => (dispatch, getState) => {
    let user_id = null

    function parseJwt(token) {
        if (!token) { return; }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64))['user_id'];
    }
    try{
        const token = getState().auth.token;
        user_id = parseJwt(token)
    }catch (e){
        console.log(e)
    }
   
    // user loading
    dispatch({type:USER_LOADING});
    axios.get(`https://to-do-app-hub.herokuapp.com/users/user/${user_id}`, tokenConfig(getState))
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch(err => {
            try{
                dispatch(getError(err.response.data, err.response.status));
                dispatch({
                    type:AUTH_ERROR
                })
            }catch (e){
                console.log(e)
            }
            
        })
}

export const register = ({username, password}) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({username, password})
    axios.post('https://to-do-app-hub.herokuapp.com/users/register/', body, config)
        .then(res => dispatch({
                type: REGISTER_SUCCESS,
                // payload: res.data
                payload: {
                    username: res.data.username,
                    tokens: res.data.tokens
                }
                }))
        .catch(err => {
            dispatch(getError(err.response.data, err.response.status, 'REGISTER_FAIL'));
            dispatch({
                type:REGISTER_FAIL,
            })
        })
}

export const login = ({username, password}) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({username, password})
    axios.post('https://to-do-app-hub.herokuapp.com/users/login/', body, config)
        .then(res => {
            try{
                dispatch({
                    type: LOGIN_SUCCESS,
                    // payload: res.data
                    payload: {
                        username: res.data.username,
                        tokens: res.data.tokens
                    }
                    })
            }catch (e){
                console.log(e)
            }
        })
        .catch(err => {
            dispatch(getError(err.response.data, err.response.status, 'LOGIN_FAIL'));
            dispatch({
                type:LOGIN_FAIL,
            })
        })
}

export const logout = () => dispatch =>  {
    dispatch({
        type:LOGOUT_SUCCESS
    })
    dispatch(clearTasks())
    // return {
    //     type: LOGOUT_SUCCESS
    // }
}


// Set up config/headers and token
export const tokenConfig = getState =>{
    // Get toke from localstorage
    const token = getState().auth.token

    //headers
    const config = {
        headers: {
            "Content-type":"application/json"

        }
    }

    if(token){
        config.headers.authorization = `Bearer ${token}`
    }
    return config
}

