import React from "react";
import {PieChart, Pie, Cell,ResponsiveContainer} from "recharts";
import "./PieChartStatistics.css"

const PieChartStatistics = (props) => {

    let data = [];
    let mDate = '';
    let dataFrom = [];
    let dayChoose = '';
    let monthChoose ='';
    let yearChoose ='';

    for (const [_, value] of Object.entries(props.statData)) {
        dataFrom.push(value);
    }

    dataFrom.map(el => {
        for (let [keys, value] of Object.entries(el)) {
            if (keys === 'date') {
                mDate = new Date(value);
                dayChoose = mDate.getUTCDate();
                monthChoose = mDate.getMonth();
                yearChoose = mDate.getFullYear();
                if (dayChoose == props.day || (monthChoose == props.month && props.day == 0)) {
                    for (let [_, categoryToExpenses] of Object.entries(el['categoryToExpenses'])) {
                        data.push({
                            name: categoryToExpenses['category'],
                            value: categoryToExpenses['totalExpenses']
                        });
                    }
                }
            }
        }
    })

    let COLORS = ["#ff7c43", "#665191", "#a05195", "#83af70", "#f95d6a",
                  "#d45087","#003f5c","#665191","#488f31","#ffa600"];

    const renderLabel = ({percent, name}) => {


        return `${name} ${(percent * 100).toFixed(0)}%`
    }

    return (
        <div>
            {data.length > 0 ?
            <h1>General Data of the Date {props.day != 0 ? props.day +".": ""}{props.month+1 + "." + yearChoose}</h1>:''}
            {data.length > 0 ?
                <PieChart width={800} height={400}>
                    <Pie
                        isAnimationActive={false}
                        data={data}
                        cx={400}
                        cy={200}
                        fill="#8884d8"
                        dataKey="value"
                        outerRadius={150}
                        labelLine={true}
                        label={renderLabel}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                        ))}
                    </Pie>
                </PieChart>:''}
        </div>
    );

}

export default PieChartStatistics;
