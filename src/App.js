import React, {useState, useEffect } from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import {createBrowserHistory} from 'history';

import MainView from './components/MainView';
import BotView from './components/BotView';
import MessageView from './components/MessageView';
import Header from './components/HeaderView';
import WebsocketHandler from './components/Websocket';
import Login, {Logout} from './components/LoginView';
import {useAuthHook} from './components/locStor';


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
          <Route exact path = '/' render = {(props) => <MainView {...props} authstate = {authstate} setAuthstate = {setAuthstate}/>} />
          <Route exact path = '/login' render  = {(props) => <Login {...props} authstate = {authstate} setAuthstate = {setAuthstate}/>}/>
          <Route exact path = '/logout' render  = {(props) => <Logout {...props} authstate = {authstate} setAuthstate = {setAuthstate}/>}/>
          <Route path = '/bot:botId' component = {BotView} />
          <Route path = '/:botId/user:userId' render = {(props) => <MessageView {...props} setMessage = {setMessage}/>} />
        </Switch>
    </Router>
  );
}

export default App;
