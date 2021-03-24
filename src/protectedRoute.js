import React from 'react'
import {Route, Redirect} from "react-router-dom";
import {useSelector} from 'react-redux'




export const ProtectedRoute = ({component: Component, ...rest}) => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

    return (
        <Route {...rest}>
            {isAuthenticated ?  <Component />: <Redirect to='/' /> }
        </Route>            
    )
}