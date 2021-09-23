import "../profile/profile.css"
import "./statistic.css"
import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import urls from "../../../../model/backend_url";
import PieChartStatistics from "./PieChartStatistic/PieChartStatistics";
import Card from "../manage/components/UI/Card";
import FilterDates from "./Options/ComboBoxList"
import {potentiallyRefreshToken} from "../../../../firebase";
import ComposedChartStatistic from "./ComposedChartStatistic/ComposedChartStatistic";

export default function Statistic() {
    //Todo take data from DB
    //1. category and amount
    const [yearly, setYearly] = useState('');
    const [monthYearly, setMonthYearly] = useState('');
    const [report, setReport] = useState('Daily');
    const [day, setDay] = useState(1);
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(2015);
    const [generate, setGenerate] = useState(false);
    const [hasDataDay, setHasDataDay] = useState(false);
    const [hasDataMonth, setHasDataMonth] = useState(false);
    const [hasDataYear, setHasDataYear] = useState(false);


    const httpErrorHandler = useCallback(async (error) => {
        let errorMessage = error.response?.data?.message;
        if (!errorMessage) {
            errorMessage = error.toString();
        }
        console.error(errorMessage);
        return potentiallyRefreshToken(error);
    }, []);


    function getDataByYear(year) {
        axios.get(urls.getStatsMonthly(year))
            .then(response => {
                setYearly(response.data);
                if(response.data.length != 0)
                    setHasDataYear(true);
            })
            .catch(httpErrorHandler);
    }


    function getDataByYearMonth(year, month) {
        axios.get(urls.getStatsDaily(year, month))
            .then(response => {
                setMonthYearly(response.data);
                if(response.data.length != 0)
                    setHasDataMonth(true);
            })
            .catch(httpErrorHandler);
    }

    const getReport = (year, month, day, getItemReport, getReportGenerate) => {
        setReport(getItemReport);
        setDay(day);
        setMonth(month);
        setYear(year);
        setGenerate(getReportGenerate)
        if(monthYearly.length != 0){
            setHasDataDay(true);
        }
        if(yearly.length != 0){
            setHasDataDay(true);
        }
        if (getItemReport === 'Daily') {
            getDataByYearMonth(year, month);
        }
        if (getItemReport === 'Months') {
            setDay(0);
            console.log("the Year ", year);
            getDataByYear(year);
        }
    }


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
                    {generate === true && report === 'Daily' ?
                        < PieChartStatistics day={day}
                                             month={month}
                                             statData={monthYearly}/>

                        : < PieChartStatistics day={day}
                                               month={month}
                                               statData={yearly}/>}
                    {generate === true && report === 'Daily' && hasDataDay === false? <h1>No Data found for that Day</h1> : ''}
                    {generate === true && report === 'Months' && hasDataDay === false? <h1>No Data found for that Day</h1> : ''}



                    {generate === true && report === 'Daily' ?
                        <ComposedChartStatistic statData={monthYearly}/>
                        : "Data TODO"}

                    {generate === true && report === 'Daily' && hasDataMonth === false? <h1>No Data found for that Month</h1> : ''}
                </div>
            </div>
        </div>

    );
}



