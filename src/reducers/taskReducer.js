import {
    GET_ITEMS, 
    ADD_ITEM, 
    EDIT_ITEM, 
    DELETE_ITEM,
    CLEAR_TASKS,
    EDIT_TASK_STATUS
} from '../actions/types'

const initialState = {
    tasks: null,
    status: null
}

export default function item(state = initialState, action){
    switch(action.type){
        case GET_ITEMS:
            return{
                ...state,
                tasks: action.payload
                // status: action.status
            }
        case CLEAR_TASKS:
            return{
                state: null
            }
        case ADD_ITEM:
        case EDIT_ITEM:
            return{
                status: action.payload
            }
        case DELETE_ITEM:
            return{
                status: action.payload
            }
        case EDIT_TASK_STATUS:
            return{
                status: action.payload
            }
        default:
            return state
    }
}  