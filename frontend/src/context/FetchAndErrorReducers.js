const  FetchListReducer = (state, action) => {
    switch(action.type) {
        case 'FETCH': {
            console.log('FETCH')
            return {
                ...state,
                isLoading: true,
                isError: false,
            }
        };
        case 'FETCH_SUCC': {
            console.log('FETCH_SUCC')
            console.log({...state})
            console.log('action')
            console.log({...action.payload})
            console.log(action.payload);
            return {
                ...state, 
                isLoading: false,
                isError: false,
                data: action.payload
            }
        };
        case 'FETCH_ERR': {
            console.log('FETCH_ERR')
            return {
                ...state, 
                isLoading: false,
                isError: true,
            }
        };
        default:
            console.log('def')
            return {
            ...state,
            isLoading: false,
            isError: false,
        }
    }
}


export {FetchListReducer}