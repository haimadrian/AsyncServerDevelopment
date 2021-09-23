import React, {useState} from "react";
import "../../../profile/profile.css"
import FormInput from "../../../../../components/forminput";
import currencies from "../../../../../../model/currency";


const ExpenseForm = (props) => {

    const getNowDate = () => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        return yyyy + '-' + mm + '-' + dd;
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


    const descriptionChangeHandler = (event) => {
        setEnteredDescription(event.target.value);
    };

    const amountChangeHandler = (event) => {
        setEnteredAmount(event.target.value);
    };

    const dateChangeHandler = (event) => {
        setEnteredDate(event.target.value);
    };

    const categoryChangeHandler = (value) => {
        setEnteredCategory(value.target.value);
    };

    const currencyChangeHandler = (event) => {
        setEnteredCurrency((event.target.value));
    };

    const submitHandler = (event) => {
        //dont reload the page on click submit
        event.preventDefault();
        const expenseData = {
            description: enteredDescription,
            category: enteredCategory,
            currency: currencies.keyFromDisplayValue(enteredCurrency),
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
    const [enteredCurrency, setEnteredCurrency] = useState(currencies.displayValues()[6]);

    return (
        <div className='frame-profile'>
            <form onSubmit={submitHandler}>
                <div className='horiz'>
                    <div className='card-vertical'>
                        <FormInput
                            type='text' title='Description' value={enteredDescription}
                            isRequired={true}
                            onChange={descriptionChangeHandler}
                        />
                        <FormInput
                            type="number"
                            title='Amount'
                            min="0.01"
                            step="0.01"
                            value={enteredAmount}
                            onChange={amountChangeHandler}
                            isRequired={true}
                        />
                        <FormInput
                            type='date' title='Date of Expense'
                            min="2019-01-01"
                            max="2022-12-31"
                            value={enteredDate === '' ? getNowDate() : enteredDate}
                            onChange={dateChangeHandler}
                        />


                    </div>
                    <div className='card-vertical'>
                        <FormInput type='DropdownList' title='Currency' value={enteredCurrency}
                                   onChange={value => currencyChangeHandler(value)} values={currencies.displayValues()}/>

                        <FormInput type='DropdownList' title='Category' value={enteredCategory}
                                   onChange={value => categoryChangeHandler(value)} values={expenseCategoryList}/>

                    </div>
                </div>
                <div className='horiz'>
                    <button className="submit-button" id="profile-submit" type="submit">Add Expense</button>
                    <button className="submit-button" id="profile-cancel" type="button" onClick={props.onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default ExpenseForm;
