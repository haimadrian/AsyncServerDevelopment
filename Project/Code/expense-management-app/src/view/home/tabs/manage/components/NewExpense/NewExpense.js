import "./NewExpense.css";
import "../../../profile/profile.css"
import ExpenseForm from "./ExpenseForm";
import React, { useState } from "react";

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
            <button className="submit-button" id="profile-addnew" onClick={startEditingHandler}>Add New Expense</button>
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
