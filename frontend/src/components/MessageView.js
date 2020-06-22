import React, {useState, useEffect} from 'react';
import '../App.css';

const MessageView = (props) => {

    const [messagelist, setMessageList] = useState([]);
    const [message, setMessage] = useState([]);

    const fetchData = () => {
        fetch(`/api/bot${props.match.params.botId}/${props.match.params.userId}/`)
        .then(response => response.json())
        .then(data => setMessageList(data))
    }

    let timer;

    const setTimer = () => {
        timer = setInterval(() => fetchData(), 2000)
    }

    const cleanUp = () => {
        console.log('cleanUp')
        clearInterval(timer);
    }

    useEffect(() => {
        fetchData();
        setTimer();
    }, [])

    useEffect(() => {
        return cleanUp;
    }, [])

    const returnDate = messagedate => {
        let date = new Date(messagedate);
        let hours = String(date.getHours());
        let minutes = String(date.getMinutes()).length > 1 ? String(date.getMinutes()) : '0'+String(date.getMinutes());
        let seconds = String(date.getSeconds()).length > 1 ? String(date.getSeconds()) : '0'+String(date.getSeconds());
        let day = String(date.getDate());
        let month = String(date.getMonth()).length > 1 ? String(date.getMonth()) : '0'+String(date.getMonth());
        let year = String(date.getFullYear());
        return (<div>{hours}:{minutes}:{seconds} {day}.{month}.{year}</div>)
    }

    const createMessageList = messagelist => {
        let response = messagelist.map(message => {
            let date = returnDate(message.date)
            return(
            <div key = {message.message_id} className = {message.is_bot ? "bot-list" : "user-list"}>
                <div>from: {message.is_bot ? message.bot_name : message.username}</div>
                <div>{message.text}</div>
                {date}
            </div>)
        })
        return response.reverse()
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(message)
        setMessage('');
        fetch(`/api/bot${props.match.params.botId}/${props.match.params.userId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({'message': message})
        })
        .then(response => response.json())
        .then(data => (props.setMessage(data)))
    }


    return (
        <div className = 'container'>
            

            <div className = 'message-container'>{createMessageList(messagelist)}</div>
            

            <form className = 'form-message-container' onSubmit = {handleSubmit}>
                <label className = 'form-label'>Your message</label>
                <input type = 'text' name = 'meassge' value = {message} onChange = {(e) => setMessage(e.target.value)} />
                <button className = 'form-button' type = 'submit'>Send message</button>
            </form>

        </div>
    )
}


export default MessageView