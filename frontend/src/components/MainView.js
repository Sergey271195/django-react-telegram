import React, {useState, useEffect, useRef} from 'react';
import {Link, Redirect} from 'react-router-dom';
import '../App.css';

const MainView = (props) => {


    let isAuthenticated = props.authstate.authenticated

    const [botlist, setBotList] = useState([]);
    const mountedRef = useRef(true);

    const cleanUp = () => {
        setBotList([]);
        mountedRef.current = false;
    }

    useEffect(() => {
        if (props.authstate.authenticated) { 
        fetch(`/api/user/${props.authstate.username}_${props.authstate.user_id}`)
        .then(response => response.json())
        .then(data => {if (!mountedRef.current) {return null} else {setBotList(data)}})
        }
    }, [props.authstate])

    useEffect(() => {
        return cleanUp
    }, [])

    const createBotList = botlist => {
        let component = botlist.map(bot => {
            return (
            <Link key = {bot.bot} to = {{pathname: `/bot${bot.bot}`, params:{bot_id: bot.bot}}}>
                <div className = "element-list">{bot.bot_name}</div>
            </Link>);
        })
        return component
    }

    if (isAuthenticated) {
        return (
            <div className = 'container'>
                <h1>{`< Profile />`}</h1>
            <div>{createBotList(botlist)}</div>
            </div>
        )
    }
    else {
        return (<Redirect to = '/login' />)
    }
    
}


export default MainView