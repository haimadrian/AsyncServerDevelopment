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
import AreaChartStatistic from "./AreaChartStatistic/AreaChartStatistic"

export default function Statistic() {
    //Todo take data from DB
    //1. category and amount
    const [yearly, setYearly] = useState('');
    const [monthYearly, setMonthYearly] = useState('');
    const [report, setReport] = useState('Daily');
    const [dayFromData, setDayFromData] = useState(1);
    const [monthFromData, setMonthFromData] = useState(1);
    const [yearFromData, setYearFromData] = useState(2015);
    const [generate, setGenerate] = useState(false);

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
            })
            .catch(httpErrorHandler);
    }


    function getDataByYearMonth(year, month) {
        axios.get(urls.getStatsDaily(year, month))
            .then(response => {
                setMonthYearly(response.data);
            })
            .catch(httpErrorHandler);
    }

    const getReport = (year, month, day, getItemReport, getReportGenerate) => {
        setReport(getItemReport);
        setDayFromData(day);
        setMonthFromData(month);
        setYearFromData(year);
        setGenerate(getReportGenerate)
        if (getItemReport === 'Daily') {
            getDataByYearMonth(year, month);
        }
        if (getItemReport === 'Months') {
            setDayFromData(0);
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
                                <FilterDates itemReport={getReport}/>
                            </div>
                        </div>
                    </Card>
                    <div className='horiz'>
                        {generate === true && report === 'Daily' ?
                            < PieChartStatistics day={dayFromData}
                                                 month={monthFromData}
                                                 statData={monthYearly}/>

                            : < PieChartStatistics day={dayFromData}
                                                   month={monthFromData}
                                                   statData={yearly}/>}

                        {generate === true && report === 'Daily' ?
                            <ComposedChartStatistic statData={monthYearly}/>
                            : <AreaChartStatistic statData={yearly}/>}
                    </div>
                </div>
            </div>
        </div>
    );
}



