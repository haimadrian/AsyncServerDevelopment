import "../profile/profile.css"
import "./statistic.css"
import React, {useCallback, useEffect, useState} from "react";
import PieChartStatistics from "./PieChartStatistic/PieChartStatistics";
import Card from "../manage/components/UI/Card";
import FilterDates from "./Options/ComboBoxList"
import axios from "axios";
import urls from "../../../../model/backend_url";
import {potentiallyRefreshToken} from "../../../../firebase";

export default function Statistic() {
    //Todo take data from DB
    //1. category and amount
    const [yearly, setYearly] = useState('');
    const [monthYearly, setMonthYearly] = useState('');
    const [report, setReport] = useState('Daily');
    const [day, setDay] = useState(1);
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(2015);
    const [generate,setGenerate] = useState(false);

    const httpErrorHandler = useCallback(async (error) => {
        let errorMessage = error.response?.data?.message;
        if (!errorMessage) {
            errorMessage = error.toString();
        }
        console.error(errorMessage);
        return potentiallyRefreshToken(error);
    }, []);


    function getDataByYear(year) {
        // setDay(0);
        // setMonth(month);
        // setYear(year);
        axios.get(urls.getStatsMonthly(year))
            .then(response => {
                setYearly(response.data);
            })
            .catch(httpErrorHandler);
    }


    function getDataByYearMonth(year, month) {
        // setDay(day);
        // setMonth(month);
        // setYear(year);
        axios.get(urls.getStatsDaily(year, month))
            .then(response => {
                setMonthYearly(response.data);
            })
            .catch(httpErrorHandler);
    }

    const getReport = (year, month, day,getItemReport,getReportGenerate) =>{
        setReport(getItemReport);
        setDay(day);
        setMonth(month);
        setYear(year);
        setGenerate(getReportGenerate)
        if(getItemReport === 'Daily') {
            getDataByYearMonth(year, month);
        }
        if(getItemReport === 'Months'){
            setDay(0);
            console.log("the Year " , year);
            getDataByYear(year);
        }
    }


    // console.log(day);
    // console.log(month);
    // console.log(year);

    // <FilterDates itemChooseReport={getReport}
    //              itemReport = {report === 'Daily' ? getDataByYearMonth : getDataByYear}
    // />

    return (

        <div className='frame-profile'>
            <div id='form'>
                <div className='horiz'>
                    <div id='title'>Statistics
                    </div>
                </div>
                <div className='card-vertical'>
                    <Card className="expenses-statistic">
                        <div className='expenses-filter'>
                            <div className='expenses-filter-control'>
                                <div id='filter'>Please Select :</div>
                                <FilterDates itemReport={getReport}/>
                            </div>
                        </div>
                    </Card>
                    {generate === true ?
                    < PieChartStatistics day={day}
                        month={month}
                        statData={report === 'Daily' ? monthYearly : yearly}/> : ''}

                </div>
            </div>
        </div>

    );
}



