import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS, 
    LOGIN_FAIL,
    LOGOUT_SUCCESS, 
    REGISTER_SUCCESS,
    REGISTER_FAIL, 
    TOKEN_REFRESH_SUCCESS,
} from "../actions/types"

const initialState = {
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refresh-token'),
    isAuthenticated: null,
    isLoading: false,
    user: null,

    isRefreshLoading: null,
}

export default function auth(state = initialState, action){
    switch(action.type){
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user:action.payload
            }
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            const token = action.payload.tokens['token'];
            const refreshToken = action.payload.tokens['refresh']
            localStorage.setItem('token', token)
            localStorage.setItem('refresh-token', refreshToken)
            return{
                ...state,
                token: localStorage.getItem('token'),
                refreshToken: localStorage.getItem('refresh-token'),
                user: action.payload,
                isAuthenticated: true,
                isLoading: false
            }
        case LOGOUT_SUCCESS:
            localStorage.removeItem('token')
            localStorage.removeItem('refresh-token')
            return {
                ...state,
                token: null,
                refreshToken: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            }
        case LOGIN_FAIL:
        case REGISTER_FAIL:
        case AUTH_ERROR:
            localStorage.removeItem('token')
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false
            }
        default:
            return state;
        case TOKEN_REFRESH_SUCCESS:
            let tk = localStorage.getItem('token')
            return {
                refreshToken: localStorage.getItem('refresh-token'),
                token: tk,
            }
            
    }
}