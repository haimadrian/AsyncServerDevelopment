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
            console.log("total : " , response.data);
            setTotalPages(response.data);

        })
        .catch(httpErrorHandler);


    function getData(page) {
        console.log("Page from menage " , page);

        axios.post(urls.expenseFetch, {page: page, limit: limit})
            .then(response => {
                console.log("Page from menage on Post" , page);

                for (let idx=0 ; idx < response.data.length ;idx++) {
                    newDate = new Date(response.data[idx].date);
                    dataFromServer.push(
                        {
                            key: response.data[idx]._id,
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
        setExpenses((prevExpenses) => {
            return [expense, ...prevExpenses];
        });
    };

    useEffect(()=> {
        getData(pages);
        console.log("use effect page from manage is : " ,pages);
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
