import React, {useCallback, useState,useEffect} from "react";
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
    const [pages, setPages ] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const httpErrorHandler = useCallback(async (error) => {
        let errorMessage = error.response?.data?.message;
        if (!errorMessage) {
            errorMessage = error.toString();
        }
        console.error(errorMessage);
        return potentiallyRefreshToken(error);
    }, []);


    axios.post(urls.totalPages)
        .then(response => {
            setTotalPages(response.data);
        })
        .catch(httpErrorHandler);


    function getData(page) {
        axios.post(urls.expenseFetch, {page: page, limit: limit})
            .then(response => {
                for (let idx=0 ; idx < response.data.length ;idx++) {
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
                console.log(dataFromServer)
            })
            .catch(httpErrorHandler);
    }



    const addExpenseHandler = (expense) => {
        console.log(expense)
        console.log(expenses)

        // userId: req.userId,
        // sum: req.body.sum,
        // currency: req.body.currency,
        // category: req.body.category,
        // description: req.body.description,
        // date: req.body.date

        console.log(expense.currency);
        console.log(expense.amount);

        console.log(expenses[0].userId);

        // axios.post(urls.addExpense, {userId: expenses[0].userId, sum: expense.amount,
        //     currency: "gg",category: expense.category, description: expense.description,
        //       date:  expense.date })
        //     .then(response => {
        //       console.log(response.data)
        //     }).catch(httpErrorHandler);

        axios.put(urls.addExpense)
            .then(response => {
              console.log(response.data)
            }).catch(httpErrorHandler);


        setExpenses((prevExpenses) => {
            return [expense, ...prevExpenses];
        });
    };

    useEffect(()=> {
        getData(pages);
    },[]);

    //<Expenses items={expenses}></Expenses> Passing Data Down
    return (
        <div className="App">
            <NewExpense onAddExpense={addExpenseHandler} />
            <Expenses items={expenses} totalPages={totalPages} dataPages={getData}></Expenses>
        </div>
    );
};

export default App;
