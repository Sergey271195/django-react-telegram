import React, {useState, useEffect, useContext} from 'react';
import {LoginContext} from '../context/LoginState';
import {Redirect} from 'react-router-dom';
import '../App.css'

const Login = () => {

    const {userInfo, setLocalStorage} = useContext(LoginContext);

    const isAuthenticated = userInfo.authenticated

    console.log(userInfo.authenticated)

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [wrongcred, setWrongcred] = useState(false)

    const onSubmitHandle = event => {
        event.preventDefault();
        fetch(`/api/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({'username': username, 'password': password})
        }).then(response => response.json()).then(data => {data.status == 200 ? LoginUser(data): setWrongcred(true)})
        setUsername('');
        setPassword('');
    }

    const LoginUser = (data) => {
        if (data.status === 200) {
            setLocalStorage(data);
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
                <input className = 'form-input' type = 'text' name = 'username' value = {username} onChange = {event => setUsername(event.target.value)}/>
                <label className = 'form-label'>Password</label>
                <input className = 'form-input' type = 'password' name = 'password' value = {password} onChange = {event => setPassword(event.target.value)}/>
                <button className = 'form-button' type = 'submit'>Submit</button>
                <label className = 'form-label'>{wrongcred ? 'Wrong credentials' : ''}</label>
            </form>
        </div>
        )
    }
}

const Logout = (props) => {

    const {userInfo, clearLocalStorage} = useContext(LoginContext);

    useEffect(() => {
        clearLocalStorage();
        //props.setAuthstate(useAuthHook.clearLocalStorage());
    }, [userInfo])

    return (<Redirect to = '/login' />)

}

export default Login;
export {Logout};