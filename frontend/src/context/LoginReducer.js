const LoginReducer = (state, action) => {
    switch(action.type) {
        case 'CLEAR_STORAGE':
        case 'SET_STORAGE': {
            return {
                ...state,
                userInfo: action.payload
            }
            
        };
        
        default: {
            return ({...state})
        }
    }
}

export default LoginReducer