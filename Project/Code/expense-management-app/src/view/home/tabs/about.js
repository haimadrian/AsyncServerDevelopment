import React from "react";
import "./about.css";

export default function About() {
    return (
        <div className='frame-profile'>
            <div id='form'>
                <div className='card-vertical'>
                    <div className="logo">
                        <i><img src={"/logo192.png"} alt={"Logo"}/></i>
                        <span><u>Lecturer</u></span>
                        <label id="textLabel">Haim Michael a.k.a Life Michael</label><br/>
                        <span><u>Students</u></span>
                        <label id="textLabel">Haim Adrian, Roi Susi, Shay Mualem</label><br/>
                        <span><u>Course</u></span>
                        <label id="textLabel">Asynchronous Server Side, HIT, Computer Science, 2021</label>
                    </div>
                </div>
            </div>
        </div>
    );
}
