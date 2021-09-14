//import single pices
//import React, { useState } from "react";
import ExpenseDate from "./ExpenseDate";
import "./ExpenseItem.css";
import Card from "../UI/Card";

const ExpenseItem = (props)=> {
  //React Hook
  //save the get and set 
  //title is the current state value
  //setTitle is a function that change the state of the object
  //const [title,setTitle] = useState(props.title);

  // const clickHandler = () => {
  //   setTitle('Update'); //lead to ExpenseItem to be call again that why const is OK to use here
  // };

  return (
    <li>
    <Card className='expense-item'>
      <ExpenseDate date={props.date} />
      <div className='expense-item__description'>
        <h2>{props.title}</h2>
        <div className='expense-item__price'>${props.amount}</div>
      </div>
    </Card>
    </li>
  );
}

export default ExpenseItem;
