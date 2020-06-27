import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import '../App.css';
import {LoginContext} from '../context/LoginState';


const Header = (props) => {

    const {userInfo} = useContext(LoginContext);

    return (
        <div>
            
            {userInfo.authenticated ? 
            (
            <div className = "nav-bar">
                <div className = "nav-link"><Link to = '/'>Home</Link></div>
                <div className = "nav-link-right"><Link to = '/profile'>Profile</Link></div>
                <div className = "nav-link"><Link to = '/logout'>Logout</Link></div>
                
                
            </div>
            ) : 
            (<div className = "nav-bar">
                <div className = "nav-link"><Link to = '/'>Home</Link></div>
                <div className = "nav-link-right"><Link to = '/login'>Login</Link></div>
                <div className = "nav-link"><Link to = '/signup'>SignUp</Link></div>
            </div>)
            }
            
        </div>
    )

}

export default Header