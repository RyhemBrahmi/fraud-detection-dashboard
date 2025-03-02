import React, { useState, useEffect } from "react";
import TransactionTable from "./TransactionTable";
import BarChartComponent from "./charts/BarChartComponent";
import LineChartComponent from "./charts/LineChartComponent";
import DoughnutChartComponent from "./charts/DoughnutChartComponent";

import "../assets/css/Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import UserAvatar from "../assets/images/user_avatar.jpg";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter by Transaction ID or Client Name
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.transaction_id.toString().includes(searchTerm) ||
    transaction.cli_nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load transactions from the JSON file
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/transactions.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des données");
        }
        return response.json();
      })
      .then((data) => setTransactions(data))
      .catch((error) => console.error("Erreur:", error));
  }, []);

  

  return (
    <div className="dashboard-container">
      <div className="fixed-search-bar">
        <div className="breadcrumb-search-container">
          <div className="breadcrumbs">
            <a href="#">Dashboard</a>
          </div>
        </div>

        <div className="search-bar-card">
          <div className="icons-container">
            <FontAwesomeIcon icon={faBell} className="notification-icon" />
            <img src={UserAvatar} alt="User" className="user-avatar" />
          </div>
        </div>
      </div>

      <div className="cards-row">
        <div className="left-card">
          <TransactionTable transactions={filteredTransactions} />
        </div>
        <div className="right-card">
            <div className="barChart-card">
              
            <BarChartComponent transactions={filteredTransactions} />
            </div>
          
            <div className="charts-row">
              <div className="pieChart-card">
              <DoughnutChartComponent transactions={transactions} />
              </div>
              <div className="lineChart-card">
                <LineChartComponent transactions={transactions} />
              </div>
             </div>
       </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
