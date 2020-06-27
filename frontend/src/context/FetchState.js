import React, {createContext, useReducer} from 'react';
import {FetchListReducer} from './FetchAndErrorReducers';

const ErrorView = () => {

    return(
            <h1>{`< Ooops. Something went wrong />`}</h1>
    )

}

const LoadingView = () => {

    return(
            <h1>{`< Loading... />`}</h1>
    )

}

const initialState = {
        isLoading: false,
        isError: false,
        data: []
}

export const FetchContext = createContext(initialState)


export const FetchProvider = ({children}) => {

    const [state, dispatch] = useReducer(FetchListReducer, initialState)
    
    return (
        <FetchContext.Provider value = {{
            statelist: state,
            dispatchList: dispatch,
            LoadingView,
            ErrorView           
        }}>
            {children}
        </FetchContext.Provider>
    )

}


export {ErrorView, LoadingView}