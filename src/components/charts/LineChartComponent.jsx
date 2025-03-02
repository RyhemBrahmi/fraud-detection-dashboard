import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const LineChartComponent = ({ transactions }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setChartData([]);
      return;
    }

    // Filter only transactions from 2024

    const transactions2024 = transactions.filter((transaction) => {
      const date = new Date(transaction.date);
      return date.getFullYear() === 2024 && !isNaN(date.getTime());
    });

    // Group transactions by month
    const riskCounts = transactions2024.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, mediumRisk: 0, highRisk: 0 };
      }

      if (transaction.risk_level === "MEDIUM") {
        acc[monthKey].mediumRisk += 1;
      } else if (transaction.risk_level === "HIGH") {
        acc[monthKey].highRisk += 1;
      }

      return acc;
    }, {});

    // Convert the object into an array and sort by date
    const formattedData = Object.values(riskCounts).sort((a, b) => a.month.localeCompare(b.month));

    setChartData(formattedData);
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="month" tick={{ fill: "#8884d8" }} />
        <YAxis tick={{ fill: "#8884d8" }} />
        <Tooltip />
        <Line type="monotone" dataKey="mediumRisk" stroke="#8884d8" strokeWidth={3} dot={false} />
        <Line type="monotone" dataKey="highRisk" stroke="#38bdf8" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
