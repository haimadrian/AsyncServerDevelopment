import {auth} from "../../firebase";
import PropTypes from "prop-types";
import React from "react";
import './signout.css';
import Logo from "../components/logo";
import urls from "../../model/backend_url";
import axios from "axios";

export default function SignOut(props) {
    // Sign out of Firebase, update the local storage and navigate to sign in page.
    auth.signOut()
        .then(() => {
            // Sign-out successful.
            props.setToken('');

            axios.post(urls.userSignOut, {})
                .then(() => {
                    props.history.replace('/signin');
                })
                .catch(error => {
                    console.error(error);
                    props.history.replace('/signin');
                });
        })
        .catch((error) => {
            // An error happened.
            console.error(error);
        });

    // Display a spinner while signing out of Firebase. (Loading... animation)
    return (
        <div className='frame-signout'>
            <Logo title={'Signing out...'}/>
            <i id="loading" className="fa fa-spinner fa-pulse fa-3x fa-fw"/>
        </div>
    );
}

SignOut.propTypes = {
    setToken: PropTypes.func.isRequired
};