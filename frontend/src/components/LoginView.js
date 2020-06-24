import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import {useAuthHook} from './locStor';
import '../App.css'

const Login = (props) => {

    const isAuthenticated = props.authstate.authenticated

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandle = event => {
        event.preventDefault();
        fetch(`/api/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({'username': username, 'password': password})
        }).then(response => response.json()).then(data => LoginUser(data))
        setUsername('');
        setPassword('');
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
            <h1>{`< Login />`}</h1>
            <form className = 'form-container' onSubmit = {onSubmitHandle}>
                <label className = 'form-label'>Username</label>
                <input type = 'text' name = 'username' value = {username} onChange = {event => setUsername(event.target.value)}/>
                <label className = 'form-label'>Password</label>
                <input type = 'password' name = 'password' value = {password} onChange = {event => setPassword(event.target.value)}/>
                <button className = 'form-button' type = 'submit'>Submit</button>
            </form>
        </div>
        )
    }
}

const Logout = (props) => {

    useEffect(() => {
        props.setAuthstate(useAuthHook.clearLocalStorage());
    }, [props])

    return (<Redirect to = '/login' />)

}

export default Login;
export {Logout};