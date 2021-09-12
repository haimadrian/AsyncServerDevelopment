import {auth} from "../../firebase";
import PropTypes from "prop-types";
import React from "react";
import './logout.css';

export default function Logout(props) {
    // Sign out of Firebase, update the local storage and navigate to sign in page.
    auth.signOut()
        .then(() => {
            // Sign-out successful.
            props.setToken('');
            props.history.replace('/signin');
        })
        .catch((error) => {
            // An error happened.
            console.error(error);
        });

    // Display a spinner while signing out of Firebase. (Loading... animation)
    return (
        <div className='frame'>
            <div className="logo">
                <img src={"/logo192.png"} alt={"Logo"}/>
            </div>
            <span id="signout">Signing out...</span>
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"/>
        </div>
    );
}

Logout.propTypes = {
    setToken: PropTypes.func.isRequired
};