import React from 'react';
import './signin.css';
import {auth} from "../../firebase";
import Logo from "../components/logo";
import FormInput from "../components/forminput";
import {userSignInFailure} from "./signin";
import {loadToken} from "./userToken";
import {Redirect} from "react-router-dom";
import axios from "axios";
import urls from "../../model/backend_url";

export default function SignUp(props) {
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

        auth.createUserWithEmailAndPassword(username, password)
            .then(() => {
                axios.put(urls.userSignUp, {email: username})
                    .then(() => {
                        props.history.replace('/home');
                    })
                    .catch(error => {
                        setIsSubmitButtonEnabled(true);
                        setIsThinking(false);
                        setErrorMessage(error.message);
                    });
            })
            .catch(error => userSignInFailure(error, setErrorMessage, setIsThinking, setIsSubmitButtonEnabled));
    };

    // If user is already signed in, redirect to the home page.
    let token = loadToken();
    if (token !== null && token !== undefined && token !== '') {
        return (<Redirect to="/home"/>);
    }

    return (
        <div className='frame'>
            <Logo title={'Sign Up'}/>
            <form onSubmit={onFormSubmit}>
                <FormInput type='email' placeholder='email' isRequired={true}
                           drawable='fa fa-at'
                           onChange={e => setUsername(e.target.value)}/>
                <FormInput type='password' placeholder='password' isRequired={true}
                           drawable='fa fa-key'
                           onChange={e => setPassword(e.target.value)}/>
                <button className="submit-button" type="submit"
                        disabled={!isSubmitButtonEnabled}>
                    Sign Up
                </button>
            </form>
            {isThinking ? <i className="fa fa-spinner fa-pulse fa-3x fa-fw"/> : null}
            <label id='labelError'>{errorMessage}</label>
            <div id="alternativeLogin">
                <label>Already have an account?</label>
            </div>
            <div className='signup'>
                <label id="link" onClick={() => props.history.replace('/signin')}>SIGN
                    IN</label>
            </div>
        </div>
    );
};
