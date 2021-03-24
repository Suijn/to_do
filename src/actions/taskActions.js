import axios from 'axios'
import axiosInterceptor from '../App'
import {
    GET_ITEMS, 
    ADD_ITEM, 
    EDIT_ITEM, 
    DELETE_ITEM,
    GET_ERRORS,
    CLEAR_TASKS,
    EDIT_TASK_STATUS
} from '../actions/types'
import {getError} from './errorActions'


export const getItems = () => (dispatch, getState) => {
    axios.get('https://todoapp-hub.herokuapp.com/api/task-list/', tokenConfig(getState))
        .then(res =>{
           if(res){
                dispatch({
                type: GET_ITEMS,
                payload: res.data
            })
           }
        })
        .catch(err => {
            try{
                dispatch(getError(err.response.data, err.response.status))
            }catch(e){
                console.log(e)
            }
        })
}

export const addItem = ({title}) => (dispatch, getState) =>{
    const body = JSON.stringify({title})
    axios.post('https://todoapp-hub.herokuapp.com/api/task-create/', body, tokenConfig(getState))
        .then(res =>{
            dispatch({
                type: ADD_ITEM,
                payload: {
                    data: res.data, 
                    // status: res.status
                }
            })
            dispatch(getItems())
        })
        .catch(err => {
            try{
                dispatch(getError(err.response.data, err.response.status))
            }catch (e){
                console.log(e)
            } 
        })
}

export const editItem = ({id, title}) => (dispatch, getState) =>{
    const body = JSON.stringify({title})
    axios.put(`https://todoapp-hub.herokuapp.com/api/task-update/${id}/`, body, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: EDIT_ITEM,
                payload: res.status
            })
            dispatch(getItems())
        })
        .catch(err =>  {
            try{
                dispatch(getError(err.response.data, err.response.status))
            }catch (e){
                console.log(e)
            }
        })
}

export const editItemStatus = ({id, title, is_completed}) => (dispatch, getState) => {
    const body = JSON.stringify({title, is_completed})
    axios.put(`https://todoapp-hub.herokuapp.com/api/task-update/${id}/`, body, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: 'EDIT_TASK_STATUS',
                payload: res.status
            })
            dispatch(getItems())
        })
        .catch(err => {
           try{
                dispatch(getError(err.response.data, err.response.status))
           }catch (e){
               console.log(e)
           }
        })
}

export const deleteTask = ({id}) => (dispatch, getState) => {
    axios.delete(`https://todoapp-hub.herokuapp.com/api/task-delete/${id}/`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_ITEM,
                payload: res.data
            })
            dispatch(getItems())
        })
        .catch(err => {
            try{
                dispatch(getError(err.response.data, err.response.status))
            }catch (e){
                console.log(e)
            }
        })
} 


export const clearTasks = () => dispatch => {
    dispatch({
        type: CLEAR_TASKS
    })
}

// Set up config/headers and token
export const tokenConfig = (getState) =>{
    // Get toke from localstorage
    const token = getState().auth.token
    
    //headers
    const config = {
        headers: {
            "Content-type":"application/json",
        }
    }
    
    if(token){
        config.headers.authorization = `Bearer ${token}`
    }
    return config
}