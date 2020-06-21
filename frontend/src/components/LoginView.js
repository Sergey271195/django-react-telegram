import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import {useAuthHook} from './locStor';

const Login = (props) => {

    console.log(`${process.env.REACT_APP_BACKEND}`);
    console.log(process.env)

    const isAuthenticated = props.authstate.authenticated

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandle = event => {
        event.preventDefault();
        fetch(`${process.env.REACT_APP_BACKEND}/api/login/`, {
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
        return (<Redirect to = '/' />)
    } 
    else {
    return (
        <div>
            <div>LoginView</div>
            <form onSubmit = {onSubmitHandle}>
                <label>Username</label><br/>
                <input type = 'text' name = 'username' value = {username} onChange = {event => setUsername(event.target.value)}/><br/>
                <label>Password</label><br/>
                <input type = 'password' name = 'password' value = {password} onChange = {event => setPassword(event.target.value)}/><br/>
                <button type = 'submit'>Submit</button>
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