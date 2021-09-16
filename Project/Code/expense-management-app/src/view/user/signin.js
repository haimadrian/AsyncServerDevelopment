import React from 'react';
import ReactTooltip from "react-tooltip";
import {Redirect} from "react-router-dom";
import {GoogleAuthProvider} from "firebase/auth";
import './signin.css';
import {auth} from "../../firebase";
import {loadToken} from "./userToken";
import FormInput from "../components/forminput";
import Logo from "../components/logo";

export default function SignIn(props) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [isThinking, setIsThinking] = React.useState(false);
    const [isSubmitButtonEnabled, setIsSubmitButtonEnabled] = React.useState(true);

    const onFormSubmit = async e => {
        // Prevent from default action to be taken, as we handle it here
        e.preventDefault();

        setIsSubmitButtonEnabled(false);
        setErrorMessage('');
        setIsThinking(true);

        auth.signInWithEmailAndPassword(username, password)
            .catch(error => userSignInFailure(error, setErrorMessage, setIsThinking, setIsSubmitButtonEnabled));
    };

    const onFacebookButtonClicked = () => {
        setErrorMessage('Facebook login will be available soon');

        /*const provider = new FacebookAuthProvider();

        auth.signInWithRedirect(provider)
            .then(this.userSignInSuccess)
            .catch(error => userSignInFailure(error, setErrorMessage, setIsThinking, setIsSubmitButtonEnabled));*/
    }

    const onGoogleButtonClicked = () => {
        setErrorMessage('');
        setIsThinking(true);

        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        provider.setCustomParameters({
            'login_hint': 'user@example.com'
        });

        auth.signInWithRedirect(provider)
            .catch(error => userSignInFailure(error, setErrorMessage, setIsThinking, setIsSubmitButtonEnabled));
    }

    // If user is already signed in, redirect to the home page.
    let token = loadToken();
    if (token !== null && token !== undefined && token !== '') {
        return (<Redirect to="/home"/>);
    }

    return (
        <div className='frame'>
            <Logo title={'Sign In'}/>
            <form onSubmit={onFormSubmit}>
                <FormInput type='email' placeholder='email' isRequired={true}
                           drawable='fa fa-at'
                           onChange={e => setUsername(e.target.value)}/>
                <FormInput type='password' placeholder='password' isRequired={true}
                           drawable='fa fa-key'
                           onChange={e => setPassword(e.target.value)}/>
                <button className="submit-button" type="submit"
                        disabled={!isSubmitButtonEnabled}>Sign In
                </button>
            </form>
            {isThinking ? <i id="loading" className="fa fa-spinner fa-pulse fa-3x fa-fw"/> : null}
            <label id='labelError'>{errorMessage}</label>
            <OtherSignInMethods onGoogleClick={onGoogleButtonClicked}
                                onFacebookClick={onFacebookButtonClicked}/>
            <SignUp history={props.history}/>
        </div>
    );
};

export function userSignInFailure(error, setErrorMessage, setIsThinking, setIsSubmitButtonEnabled) {
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

    setIsThinking(false);
    setIsSubmitButtonEnabled(true);

    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = extractShortErrorMessage();

    // The email of the user's account used.
    let email = error.email;

    // The firebase.auth.AuthCredential type that was used.
    let credential = error.credential;

    console.log(`${errorCode}, ${errorMessage}, ${email}, ${credential}`);
    setErrorMessage(errorMessage);

    console.error(error);
}

const OtherSignInMethods = (props) => {
    return (
        <div id="alternativeLogin">
            <label>Or sign in with:</label>
            <div id="iconGroup">
                <button id="facebookIcon" onClick={props.onFacebookClick} data-tip
                        data-for="facebookTip"/>
                <ReactTooltip id="facebookTip" place="top" effect="solid" type="info">
                    Facebook
                </ReactTooltip>

                <button id="googleIcon" onClick={props.onGoogleClick} data-tip
                        data-for="googleTip"/>
                <ReactTooltip id="googleTip" place="top" effect="solid" type="error">
                    Google
                </ReactTooltip>
            </div>
        </div>
    );
}

const SignUp = (props) => {
    return (
        <div className='signup'>
            <label id="link" onClick={() => props.history.replace('/signup')}>SIGN UP</label>
            <label/>
            <label id="link" onClick={() => props.history.push('/resetpass')}>Help</label>
        </div>
    );
}
