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
import {saveToken, loadToken} from './view/user/userToken';
import Home from './view/home/home';
import {auth} from "./firebase";

export default function App() {
    let history = useHistory();
    loadToken();

    // Listen to id token updates so we can persist it.
    auth.onIdTokenChanged(user => {
        if (user !== null) {
            user.getIdToken(true).then(idToken => {
                saveToken(idToken);

                // Go to home page after successful sign in
                history.replace('/home');
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
                <Route path="/home">
                    <Home history={history}/>
                </Route>
                <Route path="/signin">
                    <Login history={history}/>
                </Route>
                <Route path="/signout">
                    <Logout setToken={saveToken} history={history}/>
                </Route>
                <Route path="/signup">
                    <Home history={history}/>
                </Route>
            </Switch>
        </div>
    );
}
