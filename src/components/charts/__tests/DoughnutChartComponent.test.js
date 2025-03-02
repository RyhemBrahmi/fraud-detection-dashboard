import React from "react";
import { render, screen } from "@testing-library/react";
import DoughnutChartComponent from "../../charts/DoughnutChartComponent"; 

// Mock ResizeObserver to avoid errors with Recharts
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock transactions
const mockTransactions = [
  { id: 1, risk_level: "LOW" },
  { id: 2, risk_level: "MEDIUM" },
  { id: 3, risk_level: "HIGH" },
  { id: 4, risk_level: "HIGH" }
];

describe("DoughnutChartComponent", () => {
  test("displays the chart title", () => {
    render(<DoughnutChartComponent transactions={mockTransactions} />);
    expect(screen.getByText(/Risk Level/i)).toBeInTheDocument();
  });

  test("displays a message when no data is available", () => {
    render(<DoughnutChartComponent transactions={[]} />);
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });

  test("renders the chart when data is provided", () => {
    render(<DoughnutChartComponent transactions={mockTransactions} />);
    
    // Check if the chart is rendered in the DOM
    const chartContainer = screen.getByRole("img", { hidden: true });
    expect(chartContainer).toBeInTheDocument();
  });
});
