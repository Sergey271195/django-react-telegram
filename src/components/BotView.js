import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import '../App.css';


const BotView = (props) => {


    //const [botinfo, setBotInfo] = useState([]);
    const [userlist, setUserList] = useState([]);

    const cleanUp = () => {
        //setBotInfo([]);
        setUserList([]);
    }

    useEffect(() => {
        /* fetch(`${process.env.REACT_APP_BACKEND}/api/bot_info${props.match.params.botId}/`)
        .then(response => response.json())
        .then(data => setBotInfo(data)); */
        fetch(`${process.env.REACT_APP_BACKEND}/api/bot${props.match.params.botId}/`)
        .then(response => response.json())
        .then(data => setUserList(data));
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
        <div>
            <div>BotView</div>
            <div>{createUserList(userlist)}</div>
        </div>
    )

}

export default BotView