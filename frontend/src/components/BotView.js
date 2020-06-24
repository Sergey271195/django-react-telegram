import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import '../App.css';


const BotView = (props) => {

    const [userlist, setUserList] = useState([]);

    const cleanUp = () => {
        setUserList([]);
    }

    useEffect(() => {
        fetch(`/api/bot${props.match.params.botId}/`, {
            headers: {
                'WWWCustomToken': props.authstate.token
            }
        })
        .then(response => response.json())
        .then(data => setUserList(data.data));
    }, [props.match.params])


    useEffect(() => {
        return cleanUp
    }, [])


    let createUserList = userlist => {
        let response = userlist.map(user => {
            return (
            <Link key = {user.bot_user} to = {`/${props.match.params.botId}/user${user.bot_user}`}>
                <div className = "element-list">{user.username}</div>
            </Link>
            )
        })

        return response
    }

    return (
        <div className = 'container'>
            <h1>{`< Subscribers />`}</h1>
            <div>{createUserList(userlist)}</div>
        </div>
    )

}

export default BotView