import React, {useState} from "react";
import '../../manage/components/Expenses/ExpensesFilter'
import Options from './Options'
import './ComboBoxList.css'

const FilterDates = () => {

    const [selectReport,setSelectReport] = useState('Daily');
    const [days,setDays] = useState(1);
    const [weekly,setWeekly] = useState('Week 1');
    const [months,setMonths] = useState(1);
    const [years,setYears] = useState(2015);
    function dateList(start, end) {
        return Array(end - start + 1).fill().map((_, idx) => start + idx)
    }



    function selection() {
        const selectOption = ["Daily","Weekly", "Months" ,"Years" ];
        return selectOption;
    }

    function selectionWeekly() {
        const selectWeekly = ["Week 1","Week 2", "Week 3" ,"Week 4" ];
        return selectWeekly;
    }

    console.log(selectReport);

    //onChange={value => currencyChangeHandler(value)}
    const daysChangeHandler = (event) => {
        setDays(event.target.value);
    }
    const weeklyChangeHandler = (event) => {
        setWeekly(event.target.value);
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
                <select onChange={selectReportChangeHandler}>
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
                <label>Weekly: </label>
                <select className={`report ${selectReport != 'Daily' && selectReport != 'Weekly' ? 'disabled' : ''}`}
                        onChange={weeklyChangeHandler}>
                    {selectionWeekly().map((select) => (
                        <Options dateOption={select}/>
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
                <select onChange={yearsChangeHandler}>
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



