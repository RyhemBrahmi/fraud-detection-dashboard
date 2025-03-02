import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/BarChartComponent.css";

const BarChartComponent = ({ transactions }) => {
  const [chartData, setChartData] = useState([]);
  const [groupBy, setGroupBy] = useState("month"); 

  useEffect(() => {
    if (transactions.length === 0) return;

    const highRiskTransactions = transactions.filter(
      (transaction) => transaction.risk_level === "HIGH"
    );

    const riskCounts = highRiskTransactions.reduce((acc, transaction) => {
      const dateParts = transaction.date.split("/"); 
      const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
      
      if (isNaN(date.getTime())) {
        console.error("Date invalide :", transaction.date);
        return acc;
      }

      const key =
        groupBy === "year"
          ? date.getFullYear().toString()
          : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // Convert to an array and sort chronologically
    const sortedData = Object.entries(riskCounts)
      .map(([date, value]) => ({ period: date, count: value }))
      .sort((a, b) => a.period.localeCompare(b.period)); // Tri chronologique

    setChartData(sortedData);
  }, [transactions, groupBy]);

  return (
    <div className="bar-chart-container">
      <div className="bar-chart-head">
        <div className="bar-chart-title">High-Risk Transactions</div>
        <FontAwesomeIcon icon={faChartBar} className="chart-icon" />
      </div>

      {/* Buttons to switch between month and year */}
      <div className="toggle-buttons">
        <button
          onClick={() => setGroupBy("month")}
          className={groupBy === "month" ? "active" : ""}
        >
          By Month
        </button>
        <button
          onClick={() => setGroupBy("year")}
          className={groupBy === "year" ? "active" : ""}
        >
          By Year
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4c00ff" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#4c00ff" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="period" tick={{ fill: "#555" }} />
          <YAxis tick={{ fill: "#555" }} />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="url(#colorUv)"
            radius={[10, 10, 0, 0]}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
