import "../profile/profile.css"
import "./statistic.css"
import React, {useCallback, useState} from "react";
import PieChartStatistics from "./PieChartStatistic/PieChartStatistics";

export default function statistic() {
    //Todo take data from DB
    //1. category and amount
    return (
        <div className='frame-profile'>
            <div id='form'>
                <div className='horiz'>
                    <div id='title'>Statistics
                    </div>
                </div>
                <div className='horiz'>
                </div>
                <div className='horiz'>
                    <div className='card-vertical'>
                        <div id='title'>Daily
                        </div>
                        <PieChartStatistics/>
                    </div>
                </div>
            </div>
        </div>

    );
}



