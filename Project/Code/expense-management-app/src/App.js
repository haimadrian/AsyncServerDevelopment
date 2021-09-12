import React from 'react';
import {
    Route,
    Switch,
    Redirect,
    useHistory
} from 'react-router-dom';
import './App.css';
import './font-awesome.min.css';
import Login from './view/user/login';
import Logout from './view/user/logout';
import userToken from './view/user/userToken';
import Home from './view/home/home';
import {auth} from "./firebase";

export default function App(props) {
    props.history = useHistory();
    userToken.loadToken();

    // Listen to id token updates so we can persist it.
    auth.onIdTokenChanged(user => {
        if (user !== null) {
            user.getIdToken(true).then(idToken => {
                userToken.saveToken(idToken);

                // Go to home page after successful sign in
                props.history.replace('/home');
            });
        }
    });

    return (
        <div className="App">
            <Switch>
                <Route exact path="/" render={() => {
                    return (<Redirect to="/home"/>);
                }
                }
                />
                <Route path="/home" history={props.history}>
                    <Home/>
                </Route>
                <Route path="/signin" history={props.history}>
                    <Login/>
                </Route>
                <Route path="/signout" history={props.history}>
                    <Logout setToken={userToken.saveToken} history={props.history}/>
                </Route>
                <Route path="/signup" history={props.history}>
                    <Home/>
                </Route>
            </Switch>
        </div>
    );
}
