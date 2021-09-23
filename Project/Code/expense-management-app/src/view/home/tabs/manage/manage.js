import React, {useCallback, useState, useEffect} from "react";
import Expenses from "./components/Expenses/Expenses";
import NewExpense from "./components/NewExpense/NewExpense";
import axios from "axios";
import urls from "../../../../model/backend_url";
import {potentiallyRefreshToken} from "../../../../firebase";

//App is Main intrance
const App = () => {

    let dataFromServer = [];
    let limit = 10;
    let newDate = 0
    const [expenses, setExpenses] = useState([]);
    const [pages, setPages] = useState(0);
    const [totalDataCount, setTotalDataCount] = useState(0);

    const httpErrorHandler = useCallback(async (error) => {
        let errorMessage = error.response?.data?.message;
        if (!errorMessage) {
            errorMessage = error.toString();
        }
        console.error(errorMessage);
        return potentiallyRefreshToken(error);
    }, []);


    axios.get(urls.totalDataCount)
        .then(response => {
            setTotalDataCount(response.data);
        })
        .catch(httpErrorHandler);


    function getData(page) {
        axios.get(urls.expenseFetch(page, limit))
            .then(response => {
                for (let idx = 0; idx < response.data.length; idx++) {
                    newDate = new Date(response.data[idx].date);
                    dataFromServer.push(
                        {
                            userId: response.data[idx].userId,
                            currency: response.data[idx].currency,
                            description: response.data[idx].description,
                            category: response.data[idx].category,
                            date: new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDay()),
                            amount: response.data[idx].sum
                        }
                    );
                }
                setPages(page);
                setExpenses(dataFromServer);
            })
            .catch(httpErrorHandler);
    }

    const addExpenseHandler = (expense) => {
        axios.post(urls.addExpense, {
            sum: expense.amount,
            currency: expense.currency,
            category: expense.category,
            description: expense.description,
            date: expense.date
        })
            .then(response => {
            }).catch(httpErrorHandler);


        setExpenses((prevExpenses) => {
            return [expense, ...prevExpenses];
        });
    };

    useEffect(() => {
        getData(pages);
    }, []);

    return (
        <div className="App">
            <NewExpense onAddExpense={addExpenseHandler}/>
            <Expenses items={expenses} totalData={totalDataCount} dataPages={getData}></Expenses>
        </div>
    );
};
export default App;
