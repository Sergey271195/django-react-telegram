import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import {useAuthHook} from './locStor';
import '../App.css'

const Signup = (props) => {


    const isAuthenticated = props.authstate.authenticated

    const [userinfo, setUserinfo] = useState({
        username: '',
        email: '',
        password: '',
        conf_password: '',
    });

    const onSubmitHandle = event => {
        event.preventDefault();
        console.log('submit')
        fetch(`/api/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(
                userinfo
            )
        }).then(response => response.json()).then(data => LoginUser(data))
        setUserinfo({
            username: '',
            email: '',
            password: '',
            conf_password: '',
        })
    }

    const LoginUser = (data) => {
        if (data.status === 200) {
            props.setAuthstate(useAuthHook.setLocalStorage(data));
        }
    }
    if (isAuthenticated) {
        return (<Redirect to = '/profile' />)
    } 
    else {
    return (
        <div className = 'container'>
            <h1>{`< Sign Up />`}</h1>
            <form className = 'form-container' onSubmit = {onSubmitHandle}>
                <label className = 'form-label'>Username</label>
                <input type = 'text' name = 'username' value = {userinfo.username} onChange = {event => setUserinfo({...userinfo, username: event.target.value})}/>
                <label className = 'form-label'>Email *</label>
                <input type = 'email' name = 'email' value = {userinfo.email} onChange = {event => setUserinfo({...userinfo, email : event.target.value})}/>
                <label className = 'form-label'>Password</label>
                <input type = 'password' name = 'password' value = {userinfo.password} onChange = {event => setUserinfo({...userinfo, password : event.target.value})}/>
                <label className = 'form-label'>Confirm Password</label>
                <input type = 'password' name = 'confirm-password' value = {userinfo.conf_password} onChange = {event => setUserinfo({...userinfo, conf_password: event.target.value})}/>
                <button className = 'form-button' type = 'submit'>Submit</button>
            </form>
        </div>
        )
    }
}


export default Signup;
