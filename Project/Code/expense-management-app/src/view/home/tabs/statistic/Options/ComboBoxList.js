import React, {useState} from "react";
import '../../manage/components/Expenses/ExpensesFilter'
import Options from './Options'
import './ComboBoxList.css'

const FilterDates = () => {

    const [selectReport,setSelectReport] = useState('Daily');
    const [days,setDays] = useState(1);
    const [months,setMonths] = useState(1);
    const [years,setYears] = useState(2015);
    function dateList(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx);
    }


    function selection() {
        const selectOption = ["Daily", "Months"];
        return selectOption;
    }


    console.log(selectReport);

    //onChange={value => currencyChangeHandler(value)}
    const daysChangeHandler = (event) => {
        setDays(event.target.value);
    }
    const monthsChangeHandler = (event) => {
        setMonths(event.target.value);
    }

    const yearsChangeHandler = (event) => {
        setYears(event.target.value);
    }
    const selectReportChangeHandler = (event) => {
        setSelectReport(event.target.value);
    }

    //className={`next ${currentPage === pages ? 'disabled' : ''}`}
    //className={`${yearsChangeHandler() === 'Daily' ? 'disabled' : ''}`}

    return (
        <div className='expenses-filter'>
            <div className='expenses-filter__control'>
                <label>Report: </label>
                <select className='report' onChange={selectReportChangeHandler}>
                    {selection().map((select) => (
                        <Options dateOption={select} />
                    ))}
                </select>
                <label>Days: </label>
                <select className={`report ${selectReport != 'Daily' ? 'disabled' : ''}`}
                        onChange={daysChangeHandler}>
                    {dateList(1, 31).map((years) => (
                        <Options dateOption={years}/>
                    ))}
                </select>
                <label>Months: </label>
                <select className={`report ${selectReport != 'Months' && selectReport != 'Daily'
                && selectReport != 'Weekly'  ? 'disabled' : ''}`}
                        onChange={monthsChangeHandler}>
                    {dateList(1, 12).map((years) => (
                        <Options dateOption={years}/>
                    ))}
                </select>
                <label>Years: </label>
                <select className='report' onChange={yearsChangeHandler}>
                    {dateList(2015, 2025).map((years) => (
                        <Options dateOption={years}/>
                    ))}
                </select>
                <button className='new-expense__btn-statistic'>
                    Generate
                </button>

            </div>
        </div>
    );
}

export default FilterDates;



