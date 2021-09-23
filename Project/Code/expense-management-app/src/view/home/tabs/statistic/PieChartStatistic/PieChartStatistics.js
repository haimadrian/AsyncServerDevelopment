import React from "react";
import {PieChart, Pie, Cell,ResponsiveContainer} from "recharts";
import "./PieChartStatistics.css"

const PieChartStatistics = (props) => {

    let data = [];
    let mDate = '';
    let dataFrom = [];
    let dayChoose = 0;
    let monthChoose = 0;
    let yearChoose = 0;

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
        <div className='vert'>
            {data.length > 0 ?
            <h1>Expense per Category for: {
                props.day != 0
                    ?
                    ((props.day == 1)
                        ?
                        new Date(props.year, props.month, 0).getDate()
                            :
                        (props.day - 1)) + "."
                :
                ""
            }
            {
                props.day == 0 ?
                    ((props.month == 0
                        ?
                        12 : props.month) +
                        "." +
                        (props.month == 0
                            ?
                            (props.year - 1)
                            :
                            props.year))
                    :
                    (props.day == 1
                        ?
                        (props.month + "." + props.year)
                        :
                        ((props.month + 1) + "." + props.year)
                    )
            }</h1>
                : <h1>No Data</h1>}
            {data.length > 0 ?
                <ResponsiveContainer width="90%" height={400}>
                <PieChart>
                    <Pie
                        isAnimationActive={false}
                        data={data}
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
                </PieChart>
                </ResponsiveContainer>:''}
        </div>
    );

}

export default PieChartStatistics;
