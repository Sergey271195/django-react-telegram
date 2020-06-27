import React, {useState, useEffect, useRef, useContext} from 'react';
import '../App.css';
import {LoginContext} from '../context/LoginState';
import {FetchContext} from '../context/FetchState';

const returnDate = messagedate => {
    let date = new Date(messagedate);
    let hours = String(date.getHours());
    let minutes = String(date.getMinutes()).length > 1 ? String(date.getMinutes()) : '0'+String(date.getMinutes());
    let seconds = String(date.getSeconds()).length > 1 ? String(date.getSeconds()) : '0'+String(date.getSeconds());
    let day = String(date.getDate());
    let month = String(date.getMonth()).length > 1 ? String(date.getMonth()) : '0'+String(date.getMonth());
    let year = String(date.getFullYear());
    return (<div key = {`${messagedate}`}>{hours}:{minutes}:{seconds} {day}.{month}.{year}</div>)
}

const MessageList = ({messagelist}) => {
    let response = messagelist.map(message => {
        let date = returnDate(message.date)
        return(
        <div key = {message.message_id} className = {message.is_bot ? "bot-list" : "user-list"}>
            <div key = {`${message.message_id}_from`}>from: {message.is_bot ? message.bot_name : message.username}</div>
            <div key = {`${message.message_id}_text`}>{message.text}</div>
            {date}
        </div>)
    })
    return response.reverse()
}

const MessageView = (props) => {

    console.log(props);
    const {userInfo} = useContext(LoginContext);
    const {statelist, dispatchList, ErrorView, LoadingView} = useContext(FetchContext);
    const [message, setMessage] = useState([]);

    const mountedRef = useRef(true);

    const fetchData = () => {
        if (userInfo.token != '') {
        fetch(`/api/bot${props.match.params.botId}/${props.match.params.userId}/`, {
            headers: {
                'WWWCustomToken': userInfo.token,
            }
        })
        .then(response => response.json())
        .then(data => {if (!mountedRef.current) {return null} else {dispatchList({
            type: 'FETCH_SUCC',
            payload: data.data
                })}
            }).catch((error) => (console.log(error), dispatchList({type: 'FETCH_ERR'})))
        }
    }

    let timer;
    const setTimer = () => {
        timer = setInterval(() => fetchData(), 2000)
    }

    const cleanUp = () => {
        mountedRef.current = false;
        clearInterval(timer);
    }

    useEffect(() => {
        dispatchList({type: 'FETCH'})
        fetchData();
        setTimer();
    }, [])

    useEffect(() => {
        return cleanUp;
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(message)
        setMessage('');
        fetch(`/api/bot${props.match.params.botId}/${props.match.params.userId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'WWWCustomToken': userInfo.token,
            },
            body: JSON.stringify({'message': message})
        })
        .then(response => response.json())
        .then(data => (props.setMessage(data)))
    }


    return (

        <div className = 'container'>
            
            {statelist.isError ? <ErrorView /> :

                statelist.isLoading ? <LoadingView /> 
                :
                    (<>
                        <div className = 'message-container'>< MessageList messagelist = {statelist.data} /></div>
                    
                        <form className = 'form-message-container' onSubmit = {handleSubmit}>
                            <label className = 'form-label'>Your message</label>
                            <textarea className = 'form-textarea' type = 'text' name = 'meassge' value = {message} onChange = {(e) => setMessage(e.target.value)} />
                            <button className = 'form-button' type = 'submit'>Send message</button>
                        </form>

                    </>
                    )
                }

        </div>
    )
}


export default MessageView