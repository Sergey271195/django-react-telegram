import React, {useEffect, useRef, useContext} from 'react';
import {Link, Redirect} from 'react-router-dom';
import '../App.css';
import {LoginContext} from '../context/LoginState';
import {FetchContext} from '../context/FetchState';
import {CSSTransition} from 'react-transition-group';

const BotList = ({botlist}) => {
    return botlist.map(bot => {
        return(
        <Link key = {bot.bot} to = {{pathname: `/bot${bot.bot}`, params:{bot_id: bot.bot}}}>
            <div className = "element-list">{bot.bot_name}</div>
        </Link>
        )
    })
}

const MainView = () => {

    let {statelist, dispatchList, ErrorView, LoadingView} = useContext(FetchContext);
    let {userInfo} = useContext(LoginContext);

    let isAuthenticated = userInfo.authenticated

    const mountedRef = useRef(true);

    const cleanUp = () => {
        mountedRef.current = false;
    }

    useEffect(() => {
        dispatchList({type: 'FETCH'})
        if (userInfo.authenticated) { 
        fetch(`/api/user/${userInfo.username}_${userInfo.user_id}`, {
            headers: {
                'WWWCustomToken': userInfo.token
            }
        })
        .then(response => response.json())
        .then(data => {if (!mountedRef.current) {return null} else {dispatchList({
            type: 'FETCH_SUCC',
            payload: data.data
                })
            }}).catch((error) => dispatchList({type: 'FETCH_ERR'}))
        }
    }, [])

    useEffect(() => {
        return cleanUp
    }, [])

    if (isAuthenticated) {
        return (
            <div className = 'container'>
                {statelist.isError ? <ErrorView />: 
            
                    statelist.isLoading ? <LoadingView /> :

                    (<>
                        <h1>{`< Profile />`}</h1>
                        <div><BotList botlist = {statelist.data} /></div>
                    </>)

                }
            </div>
            )
        }

    else {
        return (<Redirect to = '/login' />)
    }
    
}


export default MainView