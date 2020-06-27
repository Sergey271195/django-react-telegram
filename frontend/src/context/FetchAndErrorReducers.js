const  FetchListReducer = (state, action) => {
    switch(action.type) {
        case 'FETCH': {
            return {
                ...state,
                isLoading: true,
                isError: false,
            }
        };
        case 'FETCH_SUCC': {
            return {
                ...state, 
                isLoading: false,
                isError: false,
                data: action.payload
            }
        };
        case 'FETCH_ERR': {
            return {
                ...state, 
                isLoading: false,
                isError: true,
            }
        };
        default:
            return {
            ...state,
            isLoading: false,
            isError: false,
        }
    }
}


export {FetchListReducer}