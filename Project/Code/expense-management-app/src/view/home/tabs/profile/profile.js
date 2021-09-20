import React, {useCallback, useEffect} from "react";
import './profile.css';
import {auth, potentiallyRefreshToken} from "../../../../firebase";
import axios from "axios";
import FormInput from "../../../components/forminput";
import maritalStatuses from "../../../../model/marital_status";
import urls from "../../../../model/backend_url";

export default function Profile() {
    const [email, setEmail] = React.useState(auth.currentUser ? auth.currentUser.email : '');

    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [dateOfBirth, setDateOfBirth] = React.useState('');
    const [street, setStreet] = React.useState('');
    const [city, setCity] = React.useState('');
    const [state, setState] = React.useState('');
    const [postalCode, setPostalCode] = React.useState(0);
    const [country, setCountry] = React.useState('');
    const [maritalStatus, setMaritalStatus] = React.useState('Single');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [isThinking, setIsThinking] = React.useState(false);
    const [isSubmitButtonEnabled, setIsSubmitButtonEnabled] = React.useState(true);

    const createUserModel = () => {
        return {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phone,
            dateOfBirth: new Date(dateOfBirth),
            maritalStatus: maritalStatuses.keyByValue(maritalStatus),
            address: {
                street: street,
                city: city,
                state: state,
                postalCode: postalCode,
                country: country
            }
        };
    }

    const refreshUserModel = (userInfo) => {
        function setIfExists(value, setter) {
            if (value) {
                setter(value);
            }
        }

        setIfExists(userInfo.firstName, setFirstName);
        setIfExists(userInfo.lastName, setLastName);
        setIfExists(userInfo.phoneNumber, setPhone);
        setIfExists(maritalStatuses[userInfo.maritalStatus], setMaritalStatus);

        if (userInfo.address) {
            let address = userInfo.address;
            setIfExists(address.street, setStreet);
            setIfExists(address.city, setCity);
            setIfExists(address.state, setState);
            setIfExists(address.postalCode, setPostalCode);
            setIfExists(address.country, setCountry);
        }

        if (userInfo.dateOfBirth) {
            let date = new Date(userInfo.dateOfBirth);
            let year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date);
            let month = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(date);
            let day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date);
            setDateOfBirth(`${year}-${month}-${day}`);
        }
    }

    const longTaskBegin = (message) => {
        setIsSubmitButtonEnabled(false);
        setIsThinking(true);
        setErrorMessage(message);
    }

    const longTaskEnd = (message) => {
        setIsSubmitButtonEnabled(true);
        setIsThinking(false);
        setErrorMessage(message);
    }

    const httpErrorHandler = useCallback(async (error) => {
        let errorMessage = error.response?.data?.message;
        if (!errorMessage) {
            errorMessage = error.toString();
        }

        longTaskEnd(errorMessage);
        return potentiallyRefreshToken(error);
    }, []);

    const onFormSubmit = async e => {
        // Prevent from default action to be taken, as we handle it here
        e.preventDefault();
        longTaskBegin('');

        let userModel = createUserModel();
        axios.post(urls.userInfo, userModel)
            .then(() => longTaskEnd('User info has been saved successfully.'))
            .catch(httpErrorHandler);
    }

    const onResetClicked = useCallback(async () => {
        longTaskBegin('Fetching info...');

        axios.get(urls.userInfo)
            .then(response => {
                longTaskEnd('');

                // response.data refers to null when user has not signed up
                if (response.data != null) {
                    refreshUserModel(response.data);
                }
            })
            .catch(httpErrorHandler);
    }, [httpErrorHandler]);

    // Update email and user info after render
    useEffect(() => {
        if ((auth.currentUser !== null) && (auth.currentUser !== undefined)) {
            setEmail(auth.currentUser.email);

            // Fetch user info
            return onResetClicked();
        } else {
            // Listen to this event so we can fetch the email once firebase is ready.
            // When we refresh the page, there is no currentUser yet, so the email is missing.
            auth.onAuthStateChanged(() => {
                if ((auth.currentUser !== null) && (auth.currentUser !== undefined)) {
                    setEmail(auth.currentUser.email);

                    // Fetch user info
                    return onResetClicked();
                }
            });
        }
    }, [onResetClicked]);

    return (
        <div className='frame-profile'>
            <form onSubmit={onFormSubmit}>
                <div className='horiz'>
                    <div className='card-vertical'>
                        <FormInput
                            type='email' title='Email' value={email} isDisabled={true}
                            drawable='fa fa-at' onChange={() => new Error('Read-Only')}
                        />
                        <FormInput
                            type='text' title='First Name' value={firstName}
                            drawable='fa fa-smile-o' isRequired={true}
                            onChange={e => setFirstName(e.target.value)}
                        />
                        <FormInput
                            type='text' title='Last Name' value={lastName}
                            drawable='fa fa-smile-o' isRequired={true}
                            onChange={e => setLastName(e.target.value)}
                        />
                        <FormInput
                            type='date' title='Date of Birth' value={dateOfBirth}
                            placeholder='dd-mm-yyyy' drawable='fa fa-birthday-cake'
                            isRequired={true}
                            onChange={e => setDateOfBirth(e.target.value)}
                        />
                        <FormInput
                            type='tel' title='Phone Number' value={phone}
                            placeholder='000-0000000' drawable='fa fa-phone'
                            onChange={e => setPhone(e.target.value)}
                        />
                        <FormInput
                            type='DropdownList' title='Marital Status'
                            value={maritalStatus} values={maritalStatuses.values()}
                            drawable='fa fa-group' isRequired={true}
                            onChange={e => setMaritalStatus(e.target.value)}
                        />
                    </div>
                    <div className='card-vertical'>
                        <FormInput
                            type='text' title='Street' value={street}
                            drawable='fa fa-home'
                            onChange={e => setStreet(e.target.value)}
                        />
                        <FormInput
                            type='text' title='City' value={city} drawable='fa fa-home'
                            onChange={e => setCity(e.target.value)}
                        />
                        <FormInput
                            type='text' title='State' value={state} drawable='fa fa-home'
                            onChange={e => setState(e.target.value)}
                        />
                        <FormInput
                            type='text' title='Country' value={country}
                            drawable='fa fa-home'
                            onChange={e => setCountry(e.target.value)}
                        />
                        <FormInput
                            type='text' title='Postal Code' value={postalCode}
                            drawable='fa fa-barcode'
                            onChange={e => setPostalCode(e.target.value)}
                        />
                    </div>
                </div>
                <div className='horiz'>
                    <button className="submit-button" id="profile-submit" type="submit"
                            disabled={!isSubmitButtonEnabled}>
                        Save
                    </button>
                    <label id="profile-reset" onClick={onResetClicked}>Reset</label>
                </div>
                {isThinking ?
                    <i id="loading"
                       className="fa fa-spinner fa-pulse fa-3x fa-fw"/> : null}
                <label id='labelError'>{errorMessage}</label>
            </form>
        </div>
    );
}
