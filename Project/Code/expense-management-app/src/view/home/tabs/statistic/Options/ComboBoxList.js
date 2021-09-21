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

    function selection() {
        return selectOption;
    }

    console.log(selection())

    //onChange={value => currencyChangeHandler(value)}

    const yearsChangeHandler = (event) => {
        console.log(event.target.value);
    }

    return (
        <div className='expenses-filter'>
            <div className='expenses-filter__control'>
                <select onChange={yearsChangeHandler}>
                    {selection().map((select) => (
                        <Options dateOption={select} />
                    ))}
                </select>
                <select onChange={yearsChangeHandler}>
                    {yearsList(2015, 2025).map((years) => (
                        <Options dateOption={years}/>
                    ))}
                </select>
                <select onChange={yearsChangeHandler}>
                    {yearsList(2015, 2025).map((years) => (
                        <Options dateOption={years}/>
                    ))}
                </select>

            </div>
        </div>
    );
}

export default FilterDates;



