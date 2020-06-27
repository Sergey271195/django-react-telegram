import React, {useState, useEffect, useContext} from 'react';
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

import {LoginProvider} from '../context/LoginState';
import {FetchProvider} from '../context/FetchState';


const history = createBrowserHistory()

function App() {

  const [message, setMessage] = useState('');
  
  return (
    
    <Router history = {history}>
    <LoginProvider>
      <Header />
        <Switch>
            <FetchProvider>
              <Route exact path = '/' component = {Welcomepage} />
              <Route exact path = '/signup' component = {Signup} />
              <Route exact path = '/profile' component = {MainView} />
              <Route exact path = '/login' component  = {Login} />
              <Route exact path = '/logout' component  = {Logout} />
              <Route path = '/bot:botId' component = {BotView} />
              <Route path = '/:botId/user:userId' render = {(props) => <MessageView {...props} setMessage = {setMessage}/>} />
            </FetchProvider>
        </Switch>
    </LoginProvider>
    </Router>
  );
}

export default App;

const container = document.getElementById("app");
render(<App />, container);