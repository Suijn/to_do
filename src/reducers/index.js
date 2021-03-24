import {combineReducers} from 'redux'
import errorReducer from './errorReducer'
import authReducer from './authReducer'
import taskReducer from './taskReducer'

import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key:'root',
    storage,
    whitelist: ['tasks']
}

const rootReducer = combineReducers({
    error: errorReducer,
    auth: authReducer,
    tasks: taskReducer,
});

// export default combineReducers({
//     error: errorReducer,
//     auth: authReducer,
//     tasks: taskReducer,
// });

export default persistReducer(persistConfig, rootReducer)