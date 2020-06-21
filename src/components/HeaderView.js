import React from 'react';
import {Link} from 'react-router-dom';
import '../App.css';

const Header = (props) => {

    return (
        <div className = "nav-bar">
            <div className = "nav-link"><Link to = '/'>Home</Link></div>
            <div className = "nav-link"><Link to = {props.authstate.authenticated ? '/logout' : '/login'}>{props.authstate.authenticated ? 'Logout' : 'Login'}</Link></div>
            
        </div>
    )

}

export default Header