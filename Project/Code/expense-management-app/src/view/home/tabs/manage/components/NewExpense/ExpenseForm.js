import React, {useState} from "react";
import "../../../profile/profile.css"
import FormInput from "../../../../../components/forminput";


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
        for (const [keys, values] of Object.entries(currency)) {
            console.log(value);
            console.log(keys);
            if (keys === value) {
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
    const [enteredCurrency, setEnteredCurrency] = useState('($ US)');

    //<input type="text" value={enteredTitle} onChange={titleChangeHandler} />  is Two-Way Binding

    // <div className="new-expense__control">
    //   <label>Description</label>
    //   <input
    //       type="text"
    //       value={enteredDescription}
    //       onChange={descriptionChangeHandler}
    //   />
    // </div>
    // <div className="new-expense__control">
    //     <label>Amount</label>
    //     <input
    //         type="number"
    //         min="0.01"
    //         step="0.01"
    //         value={enteredAmount}
    //         onChange={amountChangeHandler}
    //     />
    // </div>


    // <div className='combobox-inputs-currency'>
    //     <label>Currency</label>
    //     {/*<FormInput type='DropdownList' defaultValue={Object.keys(currency)[0]} onChange={value => currencyChangeHandler(value)} values={Object.keys(currency)}/>*/}
    //     <Combobox className='combobox-inputs-currency' defaultValue={Object.keys(currency)[0]}
    //               onChange={value => currencyChangeHandler(value)} data={Object.keys(currency)}/>
    // </div>
    // <div className="combobox-inputs">
    //     <label>Category</label>
    //     <Combobox defaultValue={expenseCategoryList[0]}
    //               onChange={value => categoryChangeHandler(value)}
    //               data={expenseCategoryList}/>
    // </div>
    // <div className="new-expense__control">
    //     <label>Date</label>
    //     <input
    //         type="date"
    //         min="2019-01-01"
    //         max="2022-12-31"
    //         value={enteredDate === '' ? getNowDate() : enteredDate}
    //         onChange={dateChangeHandler}
    //     />
    // </div>


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
                        <FormInput type='DropdownList' title='Currency' value={Object.keys(currency)[0]}
                                   onChange={value => currencyChangeHandler(value)} values={Object.keys(currency)}/>

                        <FormInput type='DropdownList' title='Category' value={expenseCategoryList[0]}
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
