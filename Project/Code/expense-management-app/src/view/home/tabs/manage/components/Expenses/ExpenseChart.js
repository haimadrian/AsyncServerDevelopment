import "./ExpenseChart.css";
import React from "react";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";



const monthTickFormatter = (tick) => {
  const date = new Date(tick);
  return date.getMonth() + 1;
};

const renderQuarterTick = (tickProps) => {
  const { x, y, payload } = tickProps;
  const { value, offset } = payload;
  const date = new Date(value);
  const month = date.getMonth();
  const quarterNo = Math.floor(month / 3) + 1;

  if (month % 3 === 1) {
    return <text x={x} y={y - 4} fill='#293241' textAnchor="middle">{`Q${quarterNo}`}</text>;
  }

  const isLast = month === 11;

  if (month % 3 === 0 || isLast) {
    const pathX = Math.floor(isLast ? x + offset : x - offset) + 0.5;

    return <path d={`M${pathX},${y - 4}v${-35}`} stroke="red" />;
  }
  return null;
};

export default function ExpenseChart(props) {
  const data = [
    {
      date: "2000-01",
      amount: 0,
    },
    {
      date: "2000-02",
      amount: 0,
    },
    {
      date: "2000-03",
      amount: 0,
    },
    {
      date: "2000-04",
      amount: 0,
    },
    {
      date: "2000-05",
      amount: 0,
    },
    {
      date: "2000-06",
      amount: 0,
    },
    {
      date: "2000-07",
      amount: 0,
    },
    {
      date: "2000-08",
      amount: 0,

    },
    {
      date: "2000-09",
      amount: 0,

    },
    {
      date: "2000-10",
      amount: 0,
    },
    {
      date: "2000-11",
      amount: 0,
    },
    {
      date: "2000-12",
      amount: 0,
    }
  ];

  for (const expense of props.expenses) {
    const expenseMonth = expense.date.getMonth(); // starting at 0 => January => 0
    data[expenseMonth].amount += expense.amount;
  }

  return (
      <BarChart
          width={800}
          height={230}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5
          }}
      >
        <CartesianGrid horizontal={false} vertical={false} fillOpacity={0.6} fill="#3D5A80"/>
        <XAxis dataKey="date" stroke="black" tickFormatter={monthTickFormatter} />
        <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={renderQuarterTick}
            height={1}
            scale="band"
            xAxisId="quarter"
        />
        <YAxis stroke="#black"/>
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#EE6C4D" />
      </BarChart>
  );
}

