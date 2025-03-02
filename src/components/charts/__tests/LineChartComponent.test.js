import React from "react";
import { render, screen } from "@testing-library/react";
import LineChartComponent from "../../charts/LineChartComponent"; 

// Mock ResizeObserver to avoid Recharts-related errors
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Sample transactions data
const mockTransactions = [
  { id: 1, date: "2024-01-15", risk_level: "MEDIUM" },
  { id: 2, date: "2024-02-10", risk_level: "HIGH" },
  { id: 3, date: "2023-12-20", risk_level: "MEDIUM" }, // Should be ignored
  { id: 4, date: "2024-03-05", risk_level: "HIGH" }
];

describe("LineChartComponent", () => {
  test("renders without crashing", () => {
    render(<LineChartComponent transactions={mockTransactions} />);
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  test("displays no data when transactions array is empty", () => {
    render(<LineChartComponent transactions={[]} />);
    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });

  test("filters only 2024 transactions", () => {
    render(<LineChartComponent transactions={mockTransactions} />);
    
    // Ensure only 2024 months appear
    expect(screen.queryByText(/2023/i)).not.toBeInTheDocument();
    expect(screen.getByText(/2024-01/i)).toBeInTheDocument();
    expect(screen.getByText(/2024-02/i)).toBeInTheDocument();
    expect(screen.getByText(/2024-03/i)).toBeInTheDocument();
  });
});
