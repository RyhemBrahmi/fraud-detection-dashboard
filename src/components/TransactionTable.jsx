import React, { useState, useRef } from "react";
import ReactPaginate from "react-paginate";
import "../assets/css/TransactionTable.css";
import SearchBar from "./ui/SearchBar";
import ToggleSwitch from "./ui/ToggleSwitch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faShieldAlt, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";


const formatDate = (excelDate) => {
  if (typeof excelDate === "number") {
    const jsDate = new Date(Date.UTC(1899, 11, 30) + excelDate * 86400000);
    return jsDate.toISOString().split("T")[0]; 
  }
  return excelDate;
};


const TransactionTable = ({ transactions }) => {
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;
   
  const [updatedTransactions, setUpdatedTransactions] = useState([]);


  React.useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem("markedTransactions")) || {};
  
    const newTransactions = transactions.map((transaction) => ({
      ...transaction,
      risk_level: storedTransactions[transaction.transaction_id] || transaction.risk_level,
    }));
  
    setUpdatedTransactions(newTransactions);
  }, [transactions]);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  // Filter States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");




 

  const toggleFraudStatus = (transactionId) => {
    setUpdatedTransactions((prevTransactions) => {
      const newTransactions = prevTransactions.map((transaction) =>
        transaction.transaction_id === transactionId
          ? {
              ...transaction,
              risk_level: transaction.risk_level.toLowerCase() === "high" ? "safe" : "high",
            }
          : transaction
      );
  
      // Update the localStorage
      const updatedStorage = newTransactions.reduce((acc, transaction) => {
        acc[transaction.transaction_id] = transaction.risk_level;
        return acc;
      }, {});
  
      localStorage.setItem("markedTransactions", JSON.stringify(updatedStorage));
  
      return newTransactions;
    });
  };
  
  

  // Handle page change in pagination
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const [showFraudulentOnly, setShowFraudulentOnly] = useState(false);

  // Filter Logic
    const filteredTransactions = updatedTransactions.filter((transaction) => {
    const transactionDate = new Date(formatDate(transaction.date)).getTime();
    const start = startDate ? new Date(startDate).getTime() : null;
    const end = endDate ? new Date(endDate).getTime() : null;
    const amount = parseFloat(transaction.amount);
  
    return (

      // Filter by search term
      (transaction.transaction_id.toString().includes(searchTerm) ||
        (transaction.cli_nom &&
          transaction.cli_nom.toLowerCase().includes(searchTerm.toLowerCase()))) &&

      // Filter by date range
      (!start || transactionDate >= start) &&
      (!end || transactionDate <= end) &&

      // Filter by risk level
      (!riskLevel || transaction.risk_level.toLowerCase() === riskLevel) &&

      // Filter by amount range
      (!minAmount || amount >= parseFloat(minAmount)) &&
      (!maxAmount || amount <= parseFloat(maxAmount)) &&

      // Filter only fraudulent transactions if the toggle is enabled
      (!showFraudulentOnly || transaction.risk_level.toLowerCase() === "high")
    );
  });
  

  // Calculate the transactions to display after filtering
  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(start, end);

  // Comments or Notes
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [comment, setComment] = useState("");
  const [transactionComments, setTransactionComments] = useState({});
  const inputRef = useRef(null);
   
  const [comments, setComments] = useState({});

  React.useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem("transactionComments")) || {};
    setComments(storedComments);
  }, []);

  const handleSaveComment = (transactionId, comment) => {
    setComments((prevComments) => {
      const newComments = { ...prevComments, [transactionId]: comment };
  
      console.log("Saving comment:", newComments); 
  
      localStorage.setItem("transactionComments", JSON.stringify(newComments));
  
      return newComments;
    });
  };
  
  
  
  const handleCommentIconClick = (transactionId) => {
    setSelectedTransactionId(transactionId);
    setComment(transactionComments[transactionId] || ""); // Load the existing comment
    
    // Trigger a focus on the input after opening
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };
  
 
  
  const handleCancelComment = () => {
    setSelectedTransactionId(null); 
  };
  


 

  return (
    <>
      <div className="table-header">
        <h2 className="table-title">Table of Transactions</h2>
        <SearchBar onSearch={setSearchTerm} className="table-icon" />
      </div>

      {/* Filters Section */}
      <div className="filters">
      <div className="date-range-container">
          <label>Date Range:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
      </div>

        <div className="risk-range-container"> 
          <label>Risk Level:</label>
          <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}>
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="amount-range-container">
          <label>Amount Range:</label>
          <input
            type="number"
            placeholder="Min"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
        </div>

        <div className="toggle-fraudulent" onClick={() => setShowFraudulentOnly(!showFraudulentOnly)}>
          <ToggleSwitch checked={showFraudulentOnly} onChange={setShowFraudulentOnly} />
          <span className="toggle-label">
            {showFraudulentOnly ? "Fraud" : "All"}
          </span>
        </div>


      </div>

      <table className="transaction-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Risk Score</th>
            <th>Action</th>
            <th>Comment</th> 

          </tr>
        </thead>
        <tbody>
          {currentTransactions.map((transaction, index) => (
            <tr key={index}
            className={transaction.risk_level.toLowerCase() === "high" ? "high-risk" : ""}
            >
              <td>{transaction.transaction_id}</td>
              <td>${transaction.amount}</td>
              <td>{formatDate(transaction.date)}</td>
              <td>{transaction.risk_score}</td>
              <td>
                {/* Button to mark as Fraudulent or Safe */}
                
                <button
                 className={`status-btn ${transaction.risk_level.toLowerCase() === "high" ? "safe" : "fraud"}`}
                 onClick={() => toggleFraudStatus(transaction.transaction_id)}
                >
                 <FontAwesomeIcon icon={transaction.risk_level.toLowerCase() === "high" ? faShieldAlt : faExclamationTriangle} />
                 <span>{transaction.risk_level.toLowerCase() === "high" ? " Safe" : " Fraud"}</span>
                </button>

              </td>

              <td className="comment-column">
                <FontAwesomeIcon
                  icon={faCommentDots}
                  className="comment-icon"
                  onClick={() => handleCommentIconClick(transaction.transaction_id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedTransactionId && (
        <div className="comment-input-container">
        <input
          ref={inputRef}
          type="text"
          value={comments[selectedTransactionId] || ""} 
          onChange={(e) => handleSaveComment(selectedTransactionId, e.target.value)}
          placeholder="Add a comment..."
          autoFocus
        />
        <button onClick={handleCancelComment} className="btn-cancel">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

    )}


      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        breakLabel={"..."}
        pageCount={Math.ceil(filteredTransactions.length / itemsPerPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </>
  );
};

export default TransactionTable;
