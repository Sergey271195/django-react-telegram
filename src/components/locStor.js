
class useAuthHook {

    static authstate = {
            token: '',
            authenticated: false,
            user_id: '',
            username: ''
        };

    static setLocalStorage = (data) => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('authenticated', 'true');
            localStorage.setItem('user_id', data.id);
            localStorage.setItem('username', data.username);
            return useAuthHook.checkLocalStorage();
        }
        
        
    static clearLocalStorage = () => {
            localStorage.setItem('token', '');
            localStorage.setItem('authenticated', 'false');
            localStorage.setItem('user_id', '');
            localStorage.setItem('username', '');
            return useAuthHook.clearState();
        }

    static checkLocalStorage = () => {
        let token = localStorage.getItem('token');
        let auth = localStorage.getItem('authenticated');
        let user_id = localStorage.getItem('user_id');
        let username = localStorage.getItem('username');
        if (!token && !auth) {
            useAuthHook.clearLocalStorage()
            useAuthHook.changeState({token: '', authenticated: false, user_id: '', username: ''});
            return useAuthHook.authstate
        }
        else {
            useAuthHook.changeState({token: token, authenticated: (auth === 'true'), user_id: user_id, username: username})
            return useAuthHook.authstate
        }
        
    }

    static getState() {
        return useAuthHook.authstate
    }

    static getAuth() {
        return useAuthHook.authstate.authenticated
    }

    static changeState(dict) {
        useAuthHook.authstate = (dict)
        return useAuthHook.authstate
    }

    static clearState() {
        useAuthHook.authstate = {
            token: '',
            authenticated: false,
            user_id: '',
            username: ''
        }
        return useAuthHook.authstate
    }

    static getList() {
        return [useAuthHook.authstate.token, useAuthHook.authstate.authenticated, useAuthHook.authstate.user_id, useAuthHook.authstate.username]
    }


}


export {useAuthHook}