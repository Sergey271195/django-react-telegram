import React, {useEffect, useContext, useReducer} from 'react';
import {Link} from 'react-router-dom';
import '../App.css';
import {LoginContext} from '../context/LoginState';
import {FetchContext} from '../context/FetchState';


const UserList = ({users}) => {

    return (users.map(user => {
        return (
        <Link key = {user.bot_user} to = {`/${user.bot}/user${user.bot_user}`}>
            <div key = {`${user.bot_user}_div`} className = "element-list">{user.username}</div>
        </Link>
            )
        })
    )
}


const BotView = (props) => {

    let {statelist, dispatchList, LoadingView, ErrorView} = useContext(FetchContext);
    const {userInfo} = useContext(LoginContext);

    const botId = props.match.params.botId
    console.log(botId);

    useEffect(() => {
        dispatchList({type: 'FETCH'})
        fetch(`/api/bot${botId}/`, {
            headers: {
                'WWWCustomToken': userInfo.token
            }
        })
        .then(response => response.json())
        .then(data => (
        dispatchList({
            type: 'FETCH_SUCC',
            payload: data.data
        })))
        .catch(
            (error) => {dispatchList({type: 'FETCH_ERR',})}
        );
    }, [props.match.params])


    return (
        <div className = 'container'>
            {statelist.isError ? <ErrorView /> :

            statelist.isLoading ? <LoadingView /> 
            :
                (<>
                <h1>{`< Subscribers />`}</h1>
                <div><UserList users = {statelist.data} /></div>
                </>
                )
        }
        </div>
    )
}
export default BotView