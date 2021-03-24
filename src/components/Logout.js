import React from 'react';
import { logout } from '../actions/authActions'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'

const Logout = () => {
    const dispatch = useDispatch()

    return(
        <div className='logout-wrapper'>
            <Link to='/login'>
                <button className="logout_btn" onClick={ () => dispatch(logout())}> Log out </button>
            </Link>
        </div>
    )
}

export default Logout