import React from 'react';
import userToken from "../user/userToken";
import "./home.css";
import {Redirect} from "react-router-dom";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import Profile from "./tabs/profile"
import Manage from "./tabs/manage/manage"
import Statistics from "./tabs/statistics"
import About from "./tabs/about"

export default function Home() {
    // If user is not signed in, redirect to the sign in page.
    if (userToken.token === undefined || userToken.token === '') {
        return (<Redirect to="/signin"/>);
    }

    return (
        <div className="Home">
            <div className="Home-header">
                <img src={"/logo192.png"} alt={"Logo"} className="Home-logo" width={100}/>
                <label className='header-title'>Expense Management</label>
            </div>
            <div className='signout'>
                <a href='/signout'>Sign Out</a>
            </div>
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
                    <div className="panel-content">
                        <Profile/>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="panel-content">
                        <Manage/>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="panel-content">
                        <Statistics/>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="panel-content">
                        <About/>
                    </div>
                </TabPanel>
            </Tabs>

        </div>
    );
}
