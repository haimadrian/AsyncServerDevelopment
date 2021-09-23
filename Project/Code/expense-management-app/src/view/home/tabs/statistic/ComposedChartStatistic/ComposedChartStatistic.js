import React from "react";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

export default function ComposedChartStatistic(props) {
    const data = [];
    for (let keys of props.statData) {
        const turnDate = new Date(keys.date)
        data.push({name: turnDate.getUTCDate(), Amount: keys.totalExpenses});
    }

    return (
        <div className='vert'>
            {data.length > 0 ?
                <h1>General Data of the Month per Day</h1> : <h1>No Data Found For That Month</h1>}
            {data.length > 0 ?
                <ComposedChart
                    width={850}
                    height={400}
                    data={data}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20
                    }}
                >


                    <CartesianGrid stroke="#f5f5f5"/>
                    <XAxis label="Day of Month" dataKey="name" scale="band"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="Amount" barSize={50} fill="#413ea0"/>
                    <Line type="monotone" dataKey="Amount" stroke="#ff7300"/>
                </ComposedChart> : ''}
        </div>
    );
}