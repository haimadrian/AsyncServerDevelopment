import { useState } from "react";
import Expenses from "./components/Expenses/Expenses";
import NewExpense from "./components/NewExpense/NewExpense";

const DUMMY_EXPENSE = [];

//App is Main intrance
const App = () => {
    const [expenses, setExpenses] = useState(DUMMY_EXPENSE);

    //getting paramenter from child (NewExpese)
    //<NewExpense onAddExpense={addExpenseHandler}/> is a pointer to get the data

    const addExpenseHandler = (expense) => {
        setExpenses((prevExpenses) => {
            return [expense, ...prevExpenses];
        });
    };

    //<Expenses items={expenses}></Expenses> Passing Data Down
    return (
        <div className="App">
            <NewExpense onAddExpense={addExpenseHandler} />
            <Expenses items={expenses}></Expenses>
        </div>
    );
};

export default App;
