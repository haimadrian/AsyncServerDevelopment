import ExpenseDate from "./ExpenseDate";
import "./ExpenseItem.css";
import Card from "../UI/Card";
import React from "react";
import currencies from "../../../../../../model/currency";

const ExpenseItem = (props) => {
    return (
        <li>
            <Card className='expense-item'>
                <ExpenseDate date={props.date}/>
                <div className='expense-item__description'>
                    <h2>{props.description}</h2>
                    <h2>{props.category}</h2>
                    <div className='expense-item__price'>{currencies[props.currency]} {props.amount}</div>
                </div>
            </Card>
        </li>
    );
}

export default ExpenseItem;
