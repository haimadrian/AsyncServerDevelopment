import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const PieChartStatistics = () =>{


    const data = [
        { name: "Group A", value: 400 },
        { name: "Group B", value: 300 },
        { name: "Group C", value: 300 },
        { name: "Group D", value: 200 },
        { name: "Group e", value: 250 }
    ];
    const COLORS = ["#deb400", "#3fd4ba", "#1044e8", "#de6b32" , "#FA8032"];

    const renderLabel = ({percent,name}) =>{


        return `${name} ${(percent * 100).toFixed(0)}%`
    }

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
                                       cx,
                                       cy,
                                       midAngle,
                                       innerRadius,
                                       outerRadius,
                                       percent,
                                       index
                                   }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        //{`${(percent * 100).toFixed(0)}%`}

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >

                {`${data[index].name}`}
            </text>
        );
    };

    return(
        <PieChart width={750} height={400}>
            <Pie
                data={data}
                cx={320}
                cy={200}
                fill="#8884d8"
                dataKey="value"
                outerRadius={150}
                labelLine={true}
                label={renderLabel}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
        </PieChart>
    );

}


export default PieChartStatistics
