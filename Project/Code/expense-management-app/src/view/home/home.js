import React from 'react';
import {loadToken} from "../user/userToken";
import "./home.css";
import {Redirect} from "react-router-dom";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import Profile from "./tabs/profile/profile"
import Manage from "./tabs/manage"
import Statistics from "./tabs/statistics"
import About from "./tabs/about"
import Logo from "../components/logo";

export default function Home() {
    // If user is not signed in, redirect to the sign in page.
    let token = loadToken();
    if (token === null || token === undefined || token === '') {
        return (<Redirect to="/signin"/>);
    }

    return (
        <div className="Home">
            <div className="Home-header">
                <Logo width={100} height={70}/>
                <label className='header-title'>Expense Management</label>
                <div className='signout'>
                    <a href='/signout'>Sign Out</a>
                </div>
            </div>
            <div className='home-tabs'>
                <Tabs>
                    <TabList>
                        <Tab>
                            <p>Profile</p>
                        </Tab>
                        <Tab>
                            <p>Manage</p>
                        </Tab>
                        <Tab>
                            <p>Statistics</p>
                        </Tab>
                        <Tab>
                            <p>About</p>
                        </Tab>
                    </TabList>

                    <TabPanel>
                        <Profile/>
                    </TabPanel>
                    <TabPanel>
                        <Manage/>
                    </TabPanel>
                    <TabPanel>
                        <Statistics/>
                    </TabPanel>
                    <TabPanel>
                        <About/>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
}
