import React from "react";
import "./forminput.css";
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";
import DatePicker from "react-widgets/DatePicker";

/**
 * Generic input field
 * @param props <ol>
 *     <li>title - Title of the input (Optional)</li>
 *     <li>type - Type of the input. e.g. email, date, number, etc.</li>
 *     <li>placeholder - A placeholder to display when the input is empty (Optional)</li>
 *     <li>onChange - Listener to input's onChange event (Optional)</li>
 *     <li>value - A text to display in the input</li>
 *     <li>isRequired - If the input is mandatory or not</li>
 *     <li>isReadOnly - If the input is read-only or editable</li>
 *     <li>isDisabled - If the input is disabled or enabled</li>
 *     <li>drawable - A left drawable to draw. e.g. "fa fa-birthday-cake"</li>
 *     </ol>
 * @returns {JSX.Element} HTML representing a form input with drawable
 * @constructor
 * @see input
 */
export default function FormInput(props) {
    return (
        <div className='row'>
            <label id='label'>{props.title}</label>
            <div className='edit'>
                {props.type === 'DropdownList' ?
                    <DropdownList
                        className='input2'
                        data={props.values} placeholder={props.placeholder}
                        value={props.value}
                        onChange={value => props.onChange({target: {value: value}})}
                    />
                    :
                    <input
                        className='input'
                        type={props.type} placeholder={props.placeholder}
                        onChange={props.onChange} required={props.isRequired}
                        readOnly={props.isReadOnly} disabled={props.isDisabled}
                        autoComplete='true' value={props.value}
                    />
                }
                <i id="labelDrawable" className={props.drawable} aria-hidden="true"/>
            </div>
        </div>
    );
}