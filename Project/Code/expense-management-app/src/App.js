import React from 'react';
import {
    Route,
    Switch,
    Redirect,
    useHistory
} from 'react-router-dom';
import './App.css';
import './font-awesome.min.css';
import {saveToken, loadToken} from './view/user/userToken';
import {auth} from "./firebase";
import SignIn from './view/user/signin';
import SignOut from './view/user/signout';
import Home from './view/home/home';
import SignUp from "./view/user/signup";
import axios from "axios";

export default function App() {
    let history = useHistory();
    let token = loadToken();
    if (token !== null && token !== undefined && token !== '') {
        // Set Authorization header globally, so we do not have to repeat it.
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Listen to id token updates so we can persist it.
    auth.onIdTokenChanged(user => {
        if (user !== null) {
            user.getIdToken().then(idToken => {
                if (idToken?.trim().length > 0) {
                    saveToken(idToken);

                    // Set Authorization header globally, so we do not have to repeat it.
                    axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;

                    // Go to home page after successful sign in
                    if (history.location.pathname !== '/home') {
                        history.replace('/home');
                    }
                }
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
                    <SignIn history={history}/>
                </Route>
                <Route path="/signout">
                    <SignOut setToken={saveToken} history={history}/>
                </Route>
                <Route path="/signup">
                    <SignUp history={history}/>
                </Route>
                <Route path="/resetpass">
                    <Home history={history}/>
                </Route>
            </Switch>
        </div>
    );
}
