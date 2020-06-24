import React, {useState, useEffect } from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {render} from 'react-dom';

import MainView from './MainView';
import Signup from './SignupView';
import Welcomepage from './WelcomeView';
import BotView from './BotView';
import MessageView from './MessageView';
import Header from './HeaderView';
import Login, {Logout} from './LoginView';
import {useAuthHook} from './locStor';


const history = createBrowserHistory()

function App() {

  
  const [authstate, setAuthstate] = useState({
    token: '',
    authenticated: false,
    user_id: '',
    username: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {  
    setAuthstate(useAuthHook.checkLocalStorage());
  }, []);

  
  return (
    <Router history = {history}>
      <Header authstate = {authstate} setAuthstate = {setAuthstate}/>
        <Switch>
            <Route exact path = '/' render = {(props) => <Welcomepage {...props} />} />
            <Route exact path = '/signup' render = {(props) => <Signup {...props} authstate = {authstate} setAuthstate = {setAuthstate}/>} />
            <Route exact path = '/profile' render = {(props) => <MainView {...props} authstate = {authstate} setAuthstate = {setAuthstate}/>} />
            <Route exact path = '/login' render  = {(props) => <Login {...props} authstate = {authstate} setAuthstate = {setAuthstate}/>}/>
            <Route exact path = '/logout' render  = {(props) => <Logout {...props} authstate = {authstate} setAuthstate = {setAuthstate}/>}/>
            <Route path = '/bot:botId' component = {(props) => <BotView {...props} authstate = {authstate} setAuthstate = {setAuthstate} />} />
            <Route path = '/:botId/user:userId' render = {(props) => <MessageView {...props} authstate = {authstate} setMessage = {setMessage}/>} />
        </Switch>
    </Router>
  );
}

export default App;

const container = document.getElementById("app");
render(<App />, container);