import React from 'react'
import {Link} from 'react-router-dom'

const NoMatch = () => {

    return(
        <div>
            <h1 style={{color: '#fff', fontSize: '20px', padding: '25px'}}> 404 Not Found </h1>
            <p style={{paddingLeft:'25px',color: '#fff'}}> Redirect to
                <Link style={{textDecoration: 'none'}} to='/login'>
                    <span style={{color: '#fff'}} > Login Page </span>
                </Link>
            </p>
        </div>
    )
}

export default NoMatch