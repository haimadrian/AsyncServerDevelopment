import React, {useCallback, useState,useEffect} from "react";
import Expenses from "./components/Expenses/Expenses";
import NewExpense from "./components/NewExpense/NewExpense";
import axios from "axios";
import urls from "../../../../model/backend_url";
import {potentiallyRefreshToken} from "../../../../firebase";
import ExpenseItem from "./components/Expenses/ExpenseItem";
import {logEvent} from "firebase/firebase-analytics";




//App is Main intrance
const App = () => {

    let dataFromServer = [];
    let limit = 10;
    let page = 0;
    let newDate = 0
    const [expenses, setExpenses] = useState([]);

    const httpErrorHandler = useCallback(async (error) => {
        let errorMessage = error.response?.data?.message;
        if (!errorMessage) {
            errorMessage = error.toString();
        }
        console.error(errorMessage);
        return potentiallyRefreshToken(error);
    }, []);

    function getData() {
        axios.post(urls.expenseFetch, {page: page, limit: limit})
            .then(response => {
                for (let idx=0 ; idx < limit ;idx++) {
                    newDate = new Date(response.data[idx].date);
                    console.log(newDate.getFullYear(), newDate.getMonth(),newDate.getDay())
                    dataFromServer = [
                        {
                            key: response.data[idx]._id,
                            currency: response.data[idx].currency,
                            description: response.data[idx].description,
                            category: response.data[idx].category,
                            date: new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDay()),
                            amount: response.data[idx].sum
                        }
                    ]
                }
                setExpenses(dataFromServer);
                console.log(dataFromServer)
            })
            .catch(httpErrorHandler);
    }


    // key={expense.id}
    // description={expense.description}
    // category={expense.category}
    // currency={expense.currency}
    // amount={expense.amount}
    // date={expense.date}

    const DUMMY_EXPENSE = [
    //     {
    //     key: dataFromServer[0]._id,
    //     currency: dataFromServer[0].currency,
    //     description: dataFromServer[0].description,
    //     category: dataFromServer[0].category,
    //     date: dataFromServer[0].date,
    //     amount: dataFromServer[0].sum
    // }
    ];

    console.log(DUMMY_EXPENSE)

    const addExpenseHandler = (expense) => {
        setExpenses((prevExpenses) => {
            return [expense, ...prevExpenses];
        });
    };

    useEffect(()=> {
        getData();
    },[getData()]);

    //<Expenses items={expenses}></Expenses> Passing Data Down
    return (
        <div className="App">
            <NewExpense onAddExpense={addExpenseHandler} />
            <Expenses items={expenses}></Expenses>
        </div>
    );
};

export default App;
