import React from "react";
import FormInput from "../../../../components/forminput";
import '../../manage/components/Expenses/ExpensesFilter'
import Options from './Options'
import './ComboBoxList.css'

const FilterDates = () => {
    function yearsList(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }

    const selectOption = ["Daily","Weekly", "Months" ,"Years" ];

    function selection(selectOption) {
        return Array(4).map(( element) => element +1)
    }

    //onChange={value => currencyChangeHandler(value)}

    const yearsChangeHandler = (event) => {
        console.log(event.target.value);
    }

    return (
        <div className='expenses-filter'>
            <div className='expenses-filter__control'>
                <select onChange={yearsChangeHandler}>
                    {yearsList(2015, 2025).map((years) => (
                        <Options dateOption={years} val={"2001"}/>
                    ))}
                </select>
                <select onChange={yearsChangeHandler}>
                    {yearsList(2015, 2025).map((years) => (
                        <Options dateOption={years} val={"2001"}/>
                    ))}
                </select>
                <select onChange={yearsChangeHandler}>
                    {selection(selectOption).map((years) => (
                        <Options dateOption={years} val={"2001"}/>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default FilterDates;



