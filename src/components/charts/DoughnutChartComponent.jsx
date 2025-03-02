import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/DoughnutChartComponent.css"; // Assure-toi d'avoir un fichier CSS associé

const COLORS = {
  LOW: "#3020FF",
  MEDIUM: "#62C9FF",
  HIGH: "#FF4C4C"
};

const DoughnutChartComponent = ({ transactions }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setChartData([]);
      return;
    }

    console.log("Transactions reçues :", transactions);

    const riskCounts = transactions.reduce((acc, transaction) => {
      if (!transaction.risk_level) return acc; 

      const riskLevel = transaction.risk_level.toUpperCase();
      acc[riskLevel] = (acc[riskLevel] || 0) + 1;

      return acc;
    }, { LOW: 0, MEDIUM: 0, HIGH: 0 });

    const formattedData = Object.keys(riskCounts)
      .map((key) => ({ name: key, value: riskCounts[key], color: COLORS[key] }))
      .filter((item) => item.value > 0);

    setChartData(formattedData);
  }, [transactions]);

  return (
    
    <div >
      <div className="chart-header">
        <div className="chart-title">Risk Level</div>
        <FontAwesomeIcon icon={faChartPie} className="chart-icon" />
      </div>
      <div className="doughnut-chart-container">

      {chartData.length === 0 ? (
        <p className="no-data-text">Aucune donnée disponible pour le graphique.</p>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="80%"
                dataKey="value"
                paddingAngle={5}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      </div>
    </div>
  );
};

export default DoughnutChartComponent;
