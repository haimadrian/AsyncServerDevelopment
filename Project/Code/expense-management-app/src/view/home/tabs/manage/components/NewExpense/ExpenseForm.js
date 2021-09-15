import React, { useState } from "react";
import "./ExpenseForm.css";
import "react-widgets/styles.css";
import Combobox from "react-widgets/Combobox";

const ExpenseForm = (props) => {

  const getNowDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    return today = yyyy + '-' + mm + '-' + dd;
  }

  const expenseCategoryList = [
    'EDUCATION',
    'ASSOCIATION',
    'ELECTRIC',
    'FUEL',
    'HEALTH',
    'HOUSING',
    'NURSERY',
    'RESTAURANT',
    'SPORT',
    'SUPERMARKET'
  ];

  const currency = {
    USD: '($ US)',
    AUD: '($ AUC)',
    CAD: '($ AUC)',
    EUR: '€',
    GBP: '¥',
    ILS: '₪',
    JPY: '¥'
  }

  const descriptionChangeHandler = (event) => {
    setEnteredDescription(event.target.value);
  };

  const amountChangeHandler = (event) => {
    setEnteredAmount(event.target.value);
  };

  const dateChangeHandler = (event) => {
    setEnteredDate(event.target.value);
    console.log(enteredDate)
  };

  const categoryChangeHandler = (value) => {
    setEnteredCategory(value);
  };

  const currencyChangeHandler = (value) => {
    let symbol = '';
    for(const [keys , values] of Object.entries(currency)){
      if (keys === value ){
        symbol = values;
        console.log(values);
      }
    }
    setEnteredCurrency(symbol);
  };

  const submitHandler = (event) => {
    //dont reload the page on click submit
    event.preventDefault();
    const expenseData = {
      description: enteredDescription,
      category: enteredCategory,
      currency: enteredCurrency,
      amount: +enteredAmount,
      date: new Date(enteredDate),
    };

    props.onSaveExpenseData(expenseData);
    //send data to the Parent
    setEnteredDescription("");
    setEnteredAmount("");
    setEnteredDate("");
    setEnteredCategory("");
    setEnteredCurrency("");
  };

  const [enteredDescription, setEnteredDescription] = useState("");
  const [enteredAmount, setEnteredAmount] = useState("");
  const [enteredDate, setEnteredDate] = useState(getNowDate());
  const [enteredCategory, setEnteredCategory] = useState(expenseCategoryList[0]);
  const [enteredCurrency, setEnteredCurrency] = useState(Object.keys(currency)[0]);

  //<input type="text" value={enteredTitle} onChange={titleChangeHandler} />  is Two-Way Binding
  return (
      <form onSubmit={submitHandler}>
        <div className="new-expense__controls">
          <div className="new-expense__control">
            <label>Description</label>
            <input
                type="text"
                value={enteredDescription}
                onChange={descriptionChangeHandler}
            />
          </div>
          <div className="new-expense__control">
            <label>Amount</label>
            <input
                type="number"
                min="0.01"
                step="0.01"
                value={enteredAmount}
                onChange={amountChangeHandler}
            />
          </div>
          <div className='combobox-inputs-currency'>
            <label>Currency</label>
            <Combobox defaultValue={Object.keys(currency)[0]} onChange={value => currencyChangeHandler(value)} data={Object.keys(currency)}/>
          </div>
          <div className="combobox-inputs">
            <label>Category</label>
            <Combobox defaultValue={expenseCategoryList[0]} onChange={value => categoryChangeHandler(value)} data={expenseCategoryList}/>
          </div>
          <div className="new-expense__control">
            <label>Date</label>
            <input
                type="date"
                min="2019-01-01"
                max="2022-12-31"
                value={enteredDate === '' ? getNowDate() : enteredDate}
                onChange={dateChangeHandler}
            />
          </div>
        </div>
        <div className="new-expense__actions">
          <button className='new-expense__btn' type="button" onClick={props.onCancel}>Cancel</button>
          <button className='new-expense__btn' type="submit">Add Expense</button>

        </div>
      </form>
  );
};

export default ExpenseForm;
