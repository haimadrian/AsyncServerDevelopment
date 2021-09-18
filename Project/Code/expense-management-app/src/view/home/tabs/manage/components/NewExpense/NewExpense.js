import "./NewExpense.css";
import ExpenseForm from "./ExpenseForm";
import { useState } from "react";

const NewExpense = (props) => {
  const [isEditing, setIsEditing] = useState(false);

  const saveExpenseDataHandler = (enteredExpenseData) => {
    const expenseData = {
      ...enteredExpenseData,
      //userId: enteredExpenseData._id,
    };

    //sending the data to the Parents we lift it 2 time from ExpenseForm - > NewExpense -> App
    props.onAddExpense(expenseData);
    setIsEditing(false);
  };

  const startEditingHandler = () => {
    setIsEditing(true);
  };

  const stopEditingHandler = () => {
    setIsEditing(false);
  };

  return (
      <div className="new-expense">
        {!isEditing && (
            <button className='new-expense__btn' onClick={startEditingHandler}>Add New Expense</button>
        )}
        {isEditing && (
            <ExpenseForm
                onSaveExpenseData={saveExpenseDataHandler}
                onCancel={stopEditingHandler}
            />
        )}
      </div>
  );
};

export default NewExpense;
