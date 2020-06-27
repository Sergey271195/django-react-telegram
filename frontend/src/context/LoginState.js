import React, {createContext, useReducer} from 'react';
import LoginReducer from './LoginReducer';

const info = ['token', 'authenticated', 'user_id', 'username']

const checkLocalStorage = () => {
    let userInfo = {}
    info.forEach(item => {
        userInfo[item] = localStorage.getItem(item) ? localStorage.getItem(item) : ''
        })
    return userInfo
}

const initiaLoginState = {
    userInfo: checkLocalStorage()    
}

export const LoginContext = createContext(initiaLoginState);

export const LoginProvider = ({children}) => {

    const [state, dispatch] = useReducer(LoginReducer, initiaLoginState);

    //Actions

    function clearLocalStorage() {
        let userInfo = {}
        for (let key in initiaLoginState.userInfo) {
            localStorage.setItem(key, '')
            userInfo[key] = ''
        }
        dispatch({
            type: 'CLEAR_STORAGE',
            payload: userInfo
        })
    }

    function setLocalStorage(data) {
        let userInfo = {}
        for (let key in initiaLoginState.userInfo) {
            key == 'authenticated' ? 
            (    localStorage.setItem(key, 'true'),
                userInfo[key] = true    )
            :
            (   localStorage.setItem(key, data[key]),
                userInfo[key] = data[key]  )
        }

        dispatch({
            type: 'SET_STORAGE',
            payload: userInfo
        })
    }

    return (
        <LoginContext.Provider value = {{
            userInfo: state.userInfo,
            clearLocalStorage,
            setLocalStorage
            }}>
            {children}
        </LoginContext.Provider>
    );
}