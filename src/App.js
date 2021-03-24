import React from 'react';
import Todo from './components/Todo'
import './styles/App.css';
import {
    HashRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import Register from './components/Register';
import Login from './components/Login';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import combineReducers from './reducers';
import {loadUser} from './actions/authActions';

import thunk from 'redux-thunk';
import {persistStore} from 'redux-persist'
import {PersistGate} from 'redux-persist/integration/react'

import axios from 'axios';
import {ProtectedRoute} from './protectedRoute'

import {getError} from './actions/errorActions'
import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS, 
    LOGIN_FAIL,
    LOGOUT_SUCCESS, 
    REGISTER_SUCCESS,
    REGISTER_FAIL, 
} from "./actions/types"
import NoMatch from './components/NoMatch'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(
    combineReducers,
    composeEnhancers(applyMiddleware(thunk))
)
const persistor = persistStore(store)


export const axiosInterceptor = axios.interceptors.response.use(response => {
    return response;
}, err => {
   
    const expectedError = 
    err.response &&
    err.response.status != 401 &&
    err.response.status >= 400 && err.response.status < 500;


    if(expectedError){
        store.dispatch(getError(err.response.data, err.response.status));
        store.dispatch({
            type:AUTH_ERROR
        })

        return Promise.reject(err)
    } 

    return new Promise((resolve, reject) => {
        const originalReq = err.config;

        if ( err.response && err.response.status === 401 && err.config && !err.config.__isRetryRequest )
        {
           
                if(store.getState().auth.refreshToken){
                    const noInterceptAxios = axios.create();
                    let body = {
                        refresh: store.getState().auth.refreshToken
                    }
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                        
                    }
    
                    noInterceptAxios.post('http://127.0.0.1:8000/users/api/token/refresh/', body, config)
                        .then(res =>{
                                localStorage.setItem('token',res.data.access)
                                store.dispatch({
                                    type: "TOKEN_REFRESH_SUCCESS"
                                })
                        })

                        originalReq.headers['authorization'] = 'Bearer ' + store.getState().auth.token;
                        store.dispatch(loadUser())
                }
                
            }
        return Promise.reject(err);
    });
    
});


class App extends React.Component {
    componentDidMount(){
        store.dispatch(loadUser())
    }

  render(){
    return(
       <Provider store={store}>
            <Router>
                <PersistGate persistor={persistor}>
                    <Switch>
                        <Route exact path='/'> <Register /> </Route>
                        <Route exact path='/login'> <Login /> </Route>
                        <ProtectedRoute 
                            path='/home'
                            component={Todo}
                        />
                        <Route path="*"> <NoMatch/> </Route>
                    </Switch>
                </PersistGate>
                
            </Router>
       </Provider>
    )
  }
}

export default App;
