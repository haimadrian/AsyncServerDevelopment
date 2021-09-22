import "../profile/profile.css"
import "./statistic.css"
import React, {useCallback, useState} from "react";
import PieChartStatistics from "./PieChartStatistic/PieChartStatistics";
import Card from "../manage/components/UI/Card";
import FilterDates from "./Options/ComboBoxList"
import axios from "axios";
import urls from "../../../../model/backend_url";
import {potentiallyRefreshToken} from "../../../../firebase";
import {get} from "firebase/firebase-database";

export default function statistic() {
    //Todo take data from DB
    //1. category and amount

    const httpErrorHandler = useCallback(async (error) => {
        let errorMessage = error.response?.data?.message;
        if (!errorMessage) {
            errorMessage = error.toString();
        }
        console.error(errorMessage);
        return potentiallyRefreshToken(error);
    }, []);


    function getData(date) {
        axios.post(urls.getStatsMonthly(date))
            .then(response => {
                console.log(response.data)
            })
            .catch(httpErrorHandler);
    }

    getData(2021);

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
                                    <div id='filter'>Please Select : </div>
                                    <FilterDates/>
                                </div>
                            </div>
                        </Card>
                        <PieChartStatistics/>
                    </div>
            </div>
        </div>

    );
}



