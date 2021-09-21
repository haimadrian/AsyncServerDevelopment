import "../profile/profile.css"
import "./statistic.css"
import React, {useCallback, useState} from "react";
import PieChartStatistics from "./PieChartStatistic/PieChartStatistics";
import Card from "../manage/components/UI/Card";
import FilterDates from "./Options/ComboBoxList"

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
                        <Card className="expenses">
                            <div className='expenses-filter'>
                                <div className='expenses-filter__control'>
                                    <div id='filter'>Please Select : </div>
                                    <FilterDates/>
                                </div>
                            </div>
                        </Card>
                        <PieChartStatistics/>
                    </div>
                </div>
            </div>
        </div>

    );
}



