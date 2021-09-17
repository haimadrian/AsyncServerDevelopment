import React from "react";
import "./logo.css";

/**
 * A logo display with optional title
 * @param props <ol>
 *     <li>title - Title to display below the logo</li>
 *     <li>width - Width of the logo</li>
 *     <li>height - Height of the logo</li>
 *     </ol>
 * @returns {JSX.Element} HTML representing a form input with drawable
 * @constructor
 */
export default function Logo(props) {
    return (
        <div className="logo">
            <i><img src={"/logo192.png"} alt={"Logo"} width={props.width} height={props.height}/></i>
            <span>{props.title}</span>
        </div>
    );
}