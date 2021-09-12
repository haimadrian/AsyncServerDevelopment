import React from 'react';
import {GoogleAuthProvider} from "firebase/auth";
import ReactTooltip from "react-tooltip";
import './login.css';
import {auth} from "../../firebase";
import userToken from "./userToken";
import {Redirect} from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            errorMessage: ''
        };

        // Bind our own functions so we will not have "this is undefined" errors
        // from within those methods.. Specifically userSignInSuccess, which needs
        // the setToken function. This is an issue with React component.
        this.onUsernameChange = this.onUsernameChange.bind(this);
        this.onPwdChange = this.onPwdChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onFacebookButtonClicked = this.onFacebookButtonClicked.bind(this);
        this.onGoogleButtonClicked = this.onGoogleButtonClicked.bind(this);
        this.userSignInFailure = this.userSignInFailure.bind(this);
    }

    onUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    onPwdChange(e) {
        this.setState({password: e.target.value});
    }

    async onFormSubmit(e) {
        // Prevent from default action to be taken, as we handle it here
        e.preventDefault();

        let credentials = {
            username: this.state.username,
            password: this.state.password
        };

        auth.signInWithEmailAndPassword(credentials.username, credentials.password)
            .catch(this.userSignInFailure);
    }

    async onFacebookButtonClicked(e) {
        this.setState({errorMessage: 'Facebook login will be available soon'});

        /*const provider = new FacebookAuthProvider();

        auth.signInWithRedirect(provider)
            .then(this.userSignInSuccess)
            .catch(this.userSignInFailure);*/
    }

    async onGoogleButtonClicked(e) {
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        provider.setCustomParameters({
            'login_hint': 'user@example.com'
        });

        auth.signInWithRedirect(provider)
            .catch(this.userSignInFailure);
    }

    userSignInFailure(error) {
        /**
         * Error message from Firebase reveals that it is a "Firebase:" error, so we
         * remove this information from the error message.
         * In addition, there might be additional information that we would like to
         * remove from the message, for security purposes.
         * For example, the message:
         * <pre>
         * Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).
         * </pre>
         * will be displayed as:
         * <pre>
         * There is no user record corresponding to this identifier
         * </pre>
         * @returns string error message
         */
        function extractShortErrorMessage() {
            let detailMessage = error.message.split(':');
            let errorMessage = detailMessage[0];

            if (detailMessage.length > 1) {
                errorMessage = detailMessage[1].trim();
            }

            detailMessage = errorMessage.split('.');
            errorMessage = detailMessage[0];

            return errorMessage;
        }

        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = extractShortErrorMessage();

        // The email of the user's account used.
        let email = error.email;

        // The firebase.auth.AuthCredential type that was used.
        let credential = error.credential;

        console.log(`${errorCode}, ${errorMessage}, ${email}, ${credential}`);
        this.setState({errorMessage: errorMessage});

        console.error(error);
    }

    render() {
        // If user is already signed in, redirect to the home page.
        if (userToken.token !== undefined && userToken.token !== '') {
            return (<Redirect to="/home" />);
        }

        return (
            <div className='frame'>
                <Logo/>
                <form onSubmit={(evt) => this.onFormSubmit(evt)}>
                    <FormInput type='email' placeholder='email'
                               onChange={this.onUsernameChange.bind(this)}/>
                    <FormInput type='password' placeholder='password'
                               onChange={this.onPwdChange.bind(this)}/>
                    <button type="submit">Sign In</button>
                </form>
                <label id='labelError'>{this.state.errorMessage}</label>
                <OtherSignInMethods onGoogleClick={this.onGoogleButtonClicked.bind(this)}
                                    onFacebookClick={this.onFacebookButtonClicked.bind(this)}/>
                <SignUp/>
            </div>
        )
    }
};

class Logo extends React.Component {
    render() {
        return (<div className="logo">
            <i><img src={"/logo192.png"} alt={"Logo"}/></i>
            <span> Sign in </span>
        </div>);
    }
}

// Generic input field
class FormInput extends React.Component {
    render() {
        return (
            <div className='row'>
                <label id='label'>{this.props.description}</label>
                <div className='edit'>
                    <input type={this.props.type} placeholder={this.props.placeholder}
                           onChange={this.props.onChange} required autoComplete='true'/>
                    <label className='labelDrawable'/>
                </div>
            </div>
        );
    }
}

class OtherSignInMethods extends React.Component {
    render() {
        return (
            <div id="alternativeLogin">
                <label>Or sign in with:</label>
                <div id="iconGroup">
                    <button id="facebookIcon" onClick={this.props.onGoogleClick} data-tip data-for="facebookTip"/>
                    <ReactTooltip id="facebookTip" place="top" effect="solid" type="info">
                        Facebook
                    </ReactTooltip>

                    <button id="googleIcon" onClick={this.props.onGoogleClick} data-tip data-for="googleTip"/>
                    <ReactTooltip id="googleTip" place="top" effect="solid" type="error">
                        Google
                    </ReactTooltip>
                </div>
            </div>
        );
    }
}

class SignUp extends React.Component {
    render() {
        return (
            <div className='signup'>
                <a href='/signup'>SIGN UP</a>
                <label/>
                <a href='/reset'>Help</a>
            </div>
        );
    }
}
