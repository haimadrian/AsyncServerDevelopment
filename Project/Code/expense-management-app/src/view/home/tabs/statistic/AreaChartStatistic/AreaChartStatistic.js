import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

export default function AreaChartStatistic(props) {

    const data = [];
    for (let keys of props.statData) {
        const turnDate = new Date(keys.date)
        data.push({name: turnDate.getUTCMonth() + 1, Amount: keys.totalExpenses});
    }

    return (
        <div className='vert'>
            {data.length > 0 ?
                <h1>General Data of the Month per Year</h1> : <h1>No Data Found For That Year</h1>}
            {data.length > 0 ?
                <AreaChart
                    width={850}
                    height={400}
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis label="Month of Year" dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Area type="monotone" dataKey="Amount" stroke="#8884d8" fill="#8884d8"/>
                </AreaChart> : ''}
        </div>
    );
}
